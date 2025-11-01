import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { generateOTP, sendEmail } from "@/lib/sendmail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    const userEmailExists = await User.findOne({ email });

    if (userEmailExists) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otp,
      otpExpiry,
    });

    await sendEmail(
      user.email,
      "One-Time Password for Email Verification",
      `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #4f46e5; color: white; padding: 20px 30px; text-align: center;">
          <h2 style="margin: 0;">Verify Your Email Address</h2>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
          <p style="font-size: 15px; color: #444; line-height: 1.6;">
            Thank you for signing up! To complete your registration, please verify your email by entering the OTP below:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #f3f4f6; padding: 12px 30px; border-radius: 8px; font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #111;">
              ${user.otp}
            </div>
          </div>

          <p style="font-size: 15px; color: #444;">
            This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
          </p>
      </div>
    `
    );
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: safeUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
