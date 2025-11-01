import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/user";
import nodemailer from "nodemailer";
import { generateOTP } from "@/lib/sendmail";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    await connectDB();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const otp = generateOTP();

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Email Verification for TASKER",
      text: `Your One-time-password (OTP) for TASKER verification is: ${otp}\n\nThis OTP is valid for 5 minutes. DO NOT SHARE THIS OTP WITH ANYONE.`,
    };

    await transporter.sendMail(mailOptions);

    // Store OTP in user document
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    return NextResponse.json(
      { success: true, message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
