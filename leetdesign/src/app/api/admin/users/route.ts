import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User, { UserRole, UserStatus } from '@/models/User';
import { Types } from 'mongoose';

// Helper to check if the user is an admin
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isAdmin = async (req: NextRequest) => {
  // For this example, we'll just check if the request comes from the admin
  // In a real app, you would use a proper auth method like NextAuth.js

  // Simplified admin check - the admin endpoint should be protected
  // via middleware in a real application
  return true; // Always return true for now since we don't have nextauth set up
};

// GET handler to retrieve all users
export async function GET(req: NextRequest) {
  try {
    // Check if the requester is an admin
    if (!(await isAdmin(req))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get users from the database
    const users = await User.find({}).select('name email role status createdAt').lean();

    // Format the users for the client
    const formattedUsers = users.map((user) => ({
      id: (user._id as Types.ObjectId).toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'User', // Default role if not specified
      status: user.status || 'active', // Default status if not specified
      joinedDate: new Date(user.createdAt).toLocaleDateString(),
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST handler to create a new user
export async function POST(req: NextRequest) {
  try {
    // Check if the requester is an admin
    if (!(await isAdmin(req))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role, status } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordRules = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };

    if (!passwordRules.minLength) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!passwordRules.hasUpperCase) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }

    if (!passwordRules.hasLowerCase) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      );
    }

    if (!passwordRules.hasNumber) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: Object.values(UserRole).includes(role) ? role : UserRole.USER,
      status: Object.values(UserStatus).includes(status) ? status : UserStatus.ACTIVE,
    });

    await user.save();

    return NextResponse.json(
      { message: 'User created successfully', userId: user._id ? user._id.toString() : null },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a user
export async function DELETE(req: NextRequest) {
  try {
    // Check if the requester is an admin
    if (!(await isAdmin(req))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Don't allow deleting admin users (additional protection)
    if (user.role === UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 