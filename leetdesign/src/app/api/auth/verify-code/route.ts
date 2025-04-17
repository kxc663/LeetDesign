export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { readVerificationCodes, writeVerificationCodes } from '@/lib/verification-storage';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const codes = readVerificationCodes();
    const storedData = codes[email];

    if (!storedData) {
      return NextResponse.json(
        { error: 'No verification code found for this email' },
        { status: 400 }
      );
    }

    // Check if code has expired (10 minutes)
    const now = Date.now();
    const codeAge = now - storedData.timestamp;
    const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds

    if (codeAge > expirationTime) {
      delete codes[email]; // Clean up expired code
      writeVerificationCodes(codes);
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      );
    }

    if (storedData.code !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Clean up the used code
    delete codes[email];
    writeVerificationCodes(codes);

    return NextResponse.json({ message: 'Code verified successfully' });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
} 