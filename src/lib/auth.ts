import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      const info = await transporter.sendMail({
        from: '"Maddison Foo Koch" <prismablog@ph.com>',
        to: user.email,
        subject: "Verify your email for Prisma Blog",

        // Plain-text fallback
        text: `Hello! ${user.name}

Please verify your email address by clicking the link below:

${verificationUrl}

If you did not create an account, you can safely ignore this email.`,

        // HTML email
        html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Welcome to Prisma Blog!</h2>
    <p>Hello,</p>
    <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="
        background-color: #4CAF50;
        color: white;
        padding: 12px 25px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        display: inline-block;
      ">Verify Email</a>
    </p>
    <p>If the button doesn’t work, copy and paste this link into your browser:</p>
    <p><a href="${verificationUrl}" style="color: #4CAF50;">${verificationUrl}</a></p>
    <hr>
    <p style="font-size: 12px; color: #777;">If you did not create an account, you can safely ignore this email.</p>
  </div>
  `,
      });

      console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
   socialProviders: {
        google: { 
            prompt: "select_account",
            clientId: process.env.G_CLIENT as string, 
            clientSecret: process.env.G_SECRET as string, 
        }, 
    },
});
