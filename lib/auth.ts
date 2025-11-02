import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/user";
import JobModel from "@/models/jobs"; // your new job schema

await connectDB();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    // --- Google OAuth ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // --- Credentials Provider (Email + Password) ---
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB(); // ensure DB is connected (important in serverless envs)
        const user = await UserModel.findOne({
          email: credentials.email,
        }).select("+password");

        if (!user) return null;

        if (!user.isVerified) {
          throw new Error("Please verify your email before signing in.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar,
          emailVerified: user.isVerified ? new Date() : null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    /**
     * 🧩 Sign-in callback
     * Handles both Google and Credentials users
     */
    async signIn({ user, account }) {
      await connectDB();

      // --- Credentials Login ---
      if (account?.provider === "credentials") {
        const dbUser = await UserModel.findById(user.id);
        return !!(dbUser && dbUser.isVerified);
      }

      // --- Google Login ---
      if (account?.provider === "google") {
        const existingUser = await UserModel.findOne({ email: user.email });

        if (existingUser) {
          // Auto-verify Google users
          if (!existingUser.isVerified) {
            existingUser.isVerified = true;
            await existingUser.save();
          }

          user.id = existingUser._id.toString();
          user.emailVerified = new Date();
          return true;
        } else {
          // Create new user if first Google login
          const newUser = await UserModel.create({
            name: user.name,
            email: user.email,
            avatar: user.image,
            isVerified: true,
            password: "", // empty since Google users don’t use password auth
          });

          user.id = newUser._id.toString();
          user.emailVerified = new Date();
          return true;
        }
      }

      return true;
    },

    /**
     * 🧠 JWT callback — adds user info to JWT token
     */
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },

    /**
     * 🧾 Session callback — exposes JWT token to session.user
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/error",
  },

  debug: process.env.NODE_ENV === "development",
};

export const verifyJobOwnership = async (jobId: string, userId: string) => {
  await connectDB();
  const job = await JobModel.findById(jobId).select("userId");
  return job?.userId?.toString() === userId;
};
