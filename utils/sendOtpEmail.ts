import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { OtpEmail } from "../templates/emails/verifyOtp";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";


interface SendOtpEmailOptions {
  to: string;
  otp: string;
  username?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail({ to, otp, username = "User" }: SendOtpEmailOptions) {
    if (!username) {
    await dbConnect();
    const user = await User.findOne({ email: to });
    if (user) {
      username = user.firstName || "User";
    } else {
      username = "User";
    }
  }
  const htmlContent = await render(OtpEmail({ username, otp }));

  const mailOptions = {
    from: `"GigMarket" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code - GigMarket",
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);

  return info;
}
