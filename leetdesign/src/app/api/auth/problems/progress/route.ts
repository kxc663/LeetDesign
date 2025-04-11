import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import mongoose from 'mongoose';

// Mark this route as dynamic since it uses cookies
export const dynamic = 'force-dynamic';

// JWT secret key (same as in login route)
const JWT_SECRET = process.env.JWT_SECRET;

// Define interface for populated problem data
interface PopulatedProblem {
  _id: mongoose.Types.ObjectId;
  displayId: number;
  title: string;
  difficulty: string;
  category: string;
}

interface PopulatedProgress {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  problemId: PopulatedProblem;
  status: string;
  solution: string;
  lastUpdated: Date;
}

// Get user progress for all problems
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
      
      // Get all progress entries for this user
      const progress = await UserProgress.find({ userId: decoded.userId })
        .populate('problemId', 'title displayId difficulty category')
        .lean() as unknown as PopulatedProgress[];
      
      // Format the response 
      const formattedProgress = progress.map(item => ({
        id: item.problemId._id,
        displayId: item.problemId.displayId,
        title: item.problemId.title,
        difficulty: item.problemId.difficulty,
        category: item.problemId.category,
        status: item.status,
        lastUpdated: item.lastUpdated
      }));

      return NextResponse.json({
        progress: formattedProgress
      });
    } catch (error) {
      // If token verification fails, user is not authenticated
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while fetching progress' },
      { status: 500 }
    );
  }
}

// Save user progress for a problem
export async function POST(req: NextRequest) {
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
      
      // Parse request body
      const { problemId, solution, status } = await req.json();
      
      // Validate input
      if (!problemId) {
        return NextResponse.json(
          { error: 'Problem ID is required' },
          { status: 400 }
        );
      }

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
          solution: solution || '',
          status: status || 'in_progress',
          lastUpdated: new Date()
        },
        { 
          new: true,  // Return updated document
          upsert: true // Create if doesn't exist
        }
      );

      return NextResponse.json({
        message: 'Progress saved successfully',
        progress: {
          id: progressUpdate._id,
          status: progressUpdate.status,
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
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while saving progress' },
      { status: 500 }
    );
  }
} 