import nodemailer, { Transporter } from "nodemailer";
import crypto from "crypto";
// Define environment variables explicitly for TypeScript

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASS = process.env.EMAIL_PASS as string;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error(
    "❌ Missing EMAIL_USER or EMAIL_PASS in environment variables."
  );
}
const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Your App" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} — Subject: ${subject}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};

// Specific helper for welcome email
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome ${name}! 🎉</h2>
      <p>Your email has been successfully verified.</p>
      <p>You can now access all features of our platform.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Your App" <${EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our Platform!",
      html,
    });
    console.log(`📨 Welcome email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};
