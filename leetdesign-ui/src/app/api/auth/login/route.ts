import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// JWT secret key (in production, use environment variable)
const JWT_SECRET = 'your-jwt-secret-key-change-this-in-production';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const { email, password } = await req.json();

    // Validate the input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user with the provided email and include the password
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify the password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create a JWT token
    const token = sign(
      { 
        userId: user._id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Set the token as an HTTP-only cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
    });

    // Return success response with user data (excluding password)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
} 