import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req: NextRequest) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Parse the request body
        const { email, code, newPassword } = await req.json();

        // Validate the input
        if (!email || !code || !newPassword) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        return NextResponse.json(
            { message: 'Password reset successful' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json(
            { error: 'An error occurred while resetting the password' },
            { status: 500 }
        );
    }
}