import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { VerificationEmail } from "../templates/emails/VerificationEmail";
import { render } from "@react-email/render";

export const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
} as SMTPTransport.Options)

type VerificationEmailType = {
    email : string;
    name: string;
    token: string;
}

export async function sendVerificationEmail({email, name, token}: VerificationEmailType) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  const emailHtml = await render(VerificationEmail({ name, verificationUrl }));

  try {
    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email Address',
      html: emailHtml,
    });

    return info;
  } catch (error) {
    console.error('Error in send verification email:', error);
    throw error;
  }
}