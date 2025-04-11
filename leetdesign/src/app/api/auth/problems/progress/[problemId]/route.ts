import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import mongoose from 'mongoose';

// Mark this route as dynamic since it uses cookies
export const dynamic = 'force-dynamic';

// JWT secret key (same as in login route)
const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/auth/problems/progress/[problemId]
export async function GET(
  req: NextRequest,
  { params }: { params: { problemId: string } }
) {
  try {
    const { problemId } = params;

    // Get the token from cookies
    const token = req.cookies.get('auth_token')?.value;

    // If no token is present, the user is not authenticated
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!problemId || problemId === 'undefined' || problemId === 'null') {
      return NextResponse.json(
        { error: 'Invalid Problem ID provided' },
        { status: 400 }
      );
    }

    try {
      // Verify the token
      const decoded = verify(token, JWT_SECRET as string) as { userId: string; email: string };
      
      // Connect to the database
      await connectToDatabase();
      
      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(problemId)) {
        return NextResponse.json(
          { error: `Invalid MongoDB ObjectId: ${problemId}` },
          { status: 400 }
        );
      }

      // Get the progress for this specific problem
      const progress = await UserProgress.findOne({
        userId: decoded.userId,
        problemId,
      });

      // If no progress exists, return default values
      if (!progress) {
        return NextResponse.json({
          progress: {
            status: 'not_started',
            solution: '',
            lastUpdated: null
          }
        });
      }

      return NextResponse.json({
        progress: {
          id: progress._id,
          status: progress.status,
          solution: progress.solution,
          lastUpdated: progress.lastUpdated
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
    console.error(`Error fetching progress for problem ${params.problemId}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while fetching progress' },
      { status: 500 }
    );
  }
}

// PUT /api/auth/problems/progress/[problemId]
export async function PUT(
  req: NextRequest,
  { params }: { params: { problemId: string } }
) {
  try {
    const { problemId } = params;

    // Get the token from cookies
    const token = req.cookies.get('auth_token')?.value;

    // If no token is present, the user is not authenticated
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    try {
      // Verify the token
      const decoded = verify(token, JWT_SECRET as string) as { userId: string; email: string };
      
      // Parse request body
      const { solution, status } = await req.json();
      
      // Connect to the database
      await connectToDatabase();
      
      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(problemId)) {
        return NextResponse.json(
          { error: `Invalid MongoDB ObjectId: ${problemId}` },
          { status: 400 }
        );
      }
      
      // Update or create progress entry using upsert
      const progressUpdate = await UserProgress.findOneAndUpdate(
        { userId: decoded.userId, problemId },
        { 
          ...(solution !== undefined && { solution }),
          ...(status !== undefined && { status }),
          lastUpdated: new Date()
        },
        { 
          new: true,  // Return updated document
          upsert: true // Create if doesn't exist
        }
      );

      return NextResponse.json({
        message: 'Progress updated successfully',
        progress: {
          id: progressUpdate._id,
          status: progressUpdate.status,
          solution: progressUpdate.solution,
          lastUpdated: progressUpdate.lastUpdated
        }
      });
    } catch (error) {
      // If token verification fails, user is not authenticated
      return NextResponse.json(
        { error: 'Invalid token or database error' },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error(`Error updating progress for problem ${params.problemId}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while updating progress' },
      { status: 500 }
    );
  }
} 