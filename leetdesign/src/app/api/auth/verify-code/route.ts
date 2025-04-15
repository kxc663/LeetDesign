import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// File path for storing verification codes
const VERIFICATION_FILE = path.join(process.cwd(), 'verification-codes.json');

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

    // Check if the code has expired (10 minutes)
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    if (now - storedData.timestamp > tenMinutes) {
      delete codes[email];
      writeVerificationCodes(codes);
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // Check if the code matches
    if (storedData.code !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Code is valid, remove it from storage
    delete codes[email];
    writeVerificationCodes(codes);

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
} 