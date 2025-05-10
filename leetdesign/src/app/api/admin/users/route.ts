import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// Mark this route as dynamic since it uses cookies
export const dynamic = 'force-dynamic';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to verify admin access
async function verifyAdminAccess(token: string | undefined) {
    if (!token) {
        return { error: 'Not authenticated', status: 401 };
    }

    try {
        const decoded = verify(token, JWT_SECRET as string) as { userId: string; email: string };
        await connectToDatabase();

        const adminUser = await User.findById(decoded.userId);
        if (!adminUser || !adminUser.email?.endsWith('@leetdesign.com')) {
            return { error: 'Unauthorized - Admin access required', status: 403 };
        }

        return { adminUser, error: null };
    } catch (error) {
        return { error: 'Invalid token', status: 401 };
    }
}

export async function GET(req: NextRequest) {
    try {
        const { error, status } = await verifyAdminAccess(req.cookies.get('auth_token')?.value);
        if (error) {
            return NextResponse.json({ error }, { status });
        }

        // Fetch all users (excluding sensitive information)
        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

        // Format the response
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            joinedDate: user.createdAt.toISOString().split('T')[0]
        }));

        return NextResponse.json({ users: formattedUsers });
    } catch (error: unknown) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An error occurred while fetching users' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        // Verify admin access
        const { error, status } = await verifyAdminAccess(req.cookies.get('auth_token')?.value);
        if (error) {
            return NextResponse.json({ error }, { status });
        }

        // Get the user ID from the request body
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Find the user to be deleted
        const userToDelete = await User.findById(userId);

        if (!userToDelete) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent deleting admin users
        if (userToDelete.email?.endsWith('@leetdesign.com')) {
            return NextResponse.json(
                { error: 'Cannot delete admin users' },
                { status: 403 }
            );
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        return NextResponse.json(
            { message: 'User deleted successfully' },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An error occurred while deleting user' },
            { status: 500 }
        );
    }
} 