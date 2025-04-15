import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// In a real application, you would store these in environment variables
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@example.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-email-password';

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// File path for storing verification codes
const VERIFICATION_FILE = path.join(process.cwd(), 'verification-codes.json');

// Initialize verification codes file if it doesn't exist
if (!fs.existsSync(VERIFICATION_FILE)) {
  fs.writeFileSync(VERIFICATION_FILE, JSON.stringify({}));
}

// Function to read verification codes
function readVerificationCodes() {
  try {
    const data = fs.readFileSync(VERIFICATION_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Function to write verification codes
function writeVerificationCodes(codes: Record<string, { code: string; timestamp: number }>) {
  fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(codes, null, 2));
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check for cooldown period (60 seconds)
    const codes = readVerificationCodes();
    const existingCode = codes[email];
    if (existingCode) {
      const now = Date.now();
      const timeSinceLastCode = now - existingCode.timestamp;
      const cooldownPeriod = 60 * 1000; // 60 seconds in milliseconds

      if (timeSinceLastCode < cooldownPeriod) {
        const remainingSeconds = Math.ceil((cooldownPeriod - timeSinceLastCode) / 1000);
        return NextResponse.json(
          { error: `Please wait ${remainingSeconds} seconds before requesting a new code` },
          { status: 429 }
        );
      }
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code with a timestamp (expires after 10 minutes)
    codes[email] = {
      code,
      timestamp: Date.now(),
    };
    writeVerificationCodes(codes);

    // Send the verification email
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Verify your email for LeetDesign',
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
} 