import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/user";
import { sendWelcomeEmail } from "@/lib/sendmail";

/**
 * POST /api/auth/verify-otp
 * Verifies a user's OTP and marks email as verified.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, otp }: { email?: string; otp?: string } = await req.json();

    // 1️⃣ Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Please provide email and OTP" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2️⃣ Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Email is already verified" },
        { status: 400 }
      );
    }

    // 4️⃣ Check OTP validity
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 5️⃣ Check expiry
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // 7️⃣ Send Welcome Email
    await sendWelcomeEmail(user.email, user.name);

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
