import { NextRequest, NextResponse } from 'next/server';
import { getProblem, deleteProblem, updateProblem } from '@/lib/problemService';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

// GET /api/auth/problems/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id || id === 'undefined' || id === 'null') {
    return NextResponse.json(
      { error: 'Invalid Problem ID provided' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: `Invalid MongoDB ObjectId: ${id}` },
        { status: 400 }
      );
    }
    
    const problem = await getProblem(id);

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error(`Error fetching problem with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth/problems/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Problem ID is required' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const success = await deleteProblem(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Problem not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting problem with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete problem' },
      { status: 500 }
    );
  }
}

// PUT /api/auth/problems/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Problem ID is required' },
      { status: 400 }
    );
  }

  try {
    const problemUpdate = await req.json();
    await connectToDatabase();
    
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: `Invalid MongoDB ObjectId: ${id}` },
        { status: 400 }
      );
    }
    
    const updatedProblem = await updateProblem(id, problemUpdate);

    if (!updatedProblem) {
      return NextResponse.json(
        { error: 'Problem not found or could not be updated' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error(`Error updating problem with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    );
  }
}
