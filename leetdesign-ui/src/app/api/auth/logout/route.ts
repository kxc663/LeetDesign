import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Delete the auth cookie
    cookies().delete('auth_token');
    
    return NextResponse.json({ 
      message: 'Logged out successfully' 
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 