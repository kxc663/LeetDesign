import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// JWT secret key (same as in login route)
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get('auth_token')?.value;

    // If no token is present, the user is not authenticated
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      const decoded = verify(token, JWT_SECRET as string) as { userId: string; email: string };
      
      // Connect to the database
      await connectToDatabase();
      
      // Find the user by ID
      const user = await User.findById(decoded.userId);
      
      // If no user found, return error
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Return user data (excluding sensitive information)
      return NextResponse.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    } catch (error) {
      // If token verification fails, user is not authenticated
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while checking authentication' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get('auth_token')?.value;

    // If no token is present, the user is not authenticated
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      const decoded = verify(token, JWT_SECRET as string) as { userId: string; email: string };
      
      // Parse the request body
      const { name } = await req.json();
      
      // Validate the input
      if (!name) {
        return NextResponse.json(
          { error: 'Name is required' },
          { status: 400 }
        );
      }
      
      // Connect to the database
      await connectToDatabase();
      
      // Find and update the user by ID
      const updatedUser = await User.findByIdAndUpdate(
        decoded.userId,
        { name },
        { new: true } // Return the updated document
      );
      
      // If no user found, return error
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Return updated user data (excluding sensitive information)
      return NextResponse.json({
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        }
      });
    } catch (error) {
      // If token verification fails, user is not authenticated
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
} 