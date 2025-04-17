export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { readVerificationCodes, writeVerificationCodes } from '@/lib/verification-storage';

// Get environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('Missing required environment variable: RESEND_API_KEY');
}

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Check if environment variables are set
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured properly' },
        { status: 500 }
      );
    }

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

    // Send the verification email using Resend
    await resend.emails.send({
      from: 'LeetDesign <onboarding@resend.dev>',
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