import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// Mark this route as dynamic since it uses cookies
export const dynamic = 'force-dynamic';

// JWT secret key
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
      
      // Check if the user is an admin
      const adminUser = await User.findById(decoded.userId);
      if (!adminUser || !adminUser.email?.endsWith('@leetdesign.com')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
      
      // Fetch all users (excluding sensitive information)
      const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
      
      // Format the response
      const formattedUsers = users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.email?.endsWith('@leetdesign.com') ? 'Admin' : 'User',
        status: 'Active', // You can add a status field to the User model if needed
        joinedDate: user.createdAt.toISOString().split('T')[0]
      }));

      return NextResponse.json({ users: formattedUsers });
    } catch (error) {
      // If token verification fails, user is not authenticated
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
} 