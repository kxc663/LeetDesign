// In-memory storage for verification codes
// Note: In production, you should use a proper database
const verificationCodes: Record<string, { code: string; timestamp: number }> = {};

// Function to read verification codes
export function readVerificationCodes() {
  return verificationCodes;
}

// Function to write verification codes
export function writeVerificationCodes(codes: Record<string, { code: string; timestamp: number }>) {
  // In a real application, you would store this in a database
  // For now, we're just updating the in-memory object
  Object.keys(verificationCodes).forEach(key => {
    delete verificationCodes[key];
  });
  
  Object.keys(codes).forEach(key => {
    verificationCodes[key] = codes[key];
  });
} 