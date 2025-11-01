import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

console.log("NextAuth route loaded successfully");
console.log("AuthOptions exists:", !!authOptions);
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
