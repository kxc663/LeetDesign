import fs from 'fs';
import path from 'path';

// File path for storing verification codes
const VERIFICATION_FILE = path.join(process.cwd(), 'verification-codes.json');

// Initialize verification codes file if it doesn't exist
if (!fs.existsSync(VERIFICATION_FILE)) {
  fs.writeFileSync(VERIFICATION_FILE, JSON.stringify({}));
}

// Function to read verification codes
export function readVerificationCodes() {
  try {
    const data = fs.readFileSync(VERIFICATION_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading verification codes:', error);
    return {};
  }
}

// Function to write verification codes
export function writeVerificationCodes(codes: Record<string, { code: string; timestamp: number }>) {
  try {
    fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(codes, null, 2));
  } catch (error) {
    console.error('Error writing verification codes:', error);
  }
} 