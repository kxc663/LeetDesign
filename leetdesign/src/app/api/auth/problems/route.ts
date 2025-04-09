import { NextRequest, NextResponse } from 'next/server';
import Problem from '@/models/Problem';
import { getProblems, getProblem, createProblem } from '@/lib/problemService';
import connectToDatabase from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/auth/problems
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const problems = await getProblems();
    console.log(problems);
    return NextResponse.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

// POST /api/auth/problems
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const problemData = await req.json();
    
    // Validate the required fields
    const requiredFields = ['title', 'difficulty', 'description', 'functional_requirements', 'non_functional_requirements', 'hints', 'category', 'reference_solution'];
    const missingFields = requiredFields.filter(field => !problemData[field]);
    
    console.log(problemData);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate difficulty
    if (!['Easy', 'Medium', 'Hard'].includes(problemData.difficulty)) {
      return NextResponse.json(
        { error: `Invalid difficulty value. Must be one of: Easy, Medium, Hard` },
        { status: 400 }
      );
    }
    
    // Validate hints structure
    if (!Array.isArray(problemData.hints) || 
        problemData.hints.some((hint: {id?: string, title?: string, content?: string}) => 
          !hint.id || !hint.title || !hint.content)) {
      return NextResponse.json(
        { error: `Invalid hints format. Each hint must have id, title, and content.` },
        { status: 400 }
      );
    }
    
    console.log('Creating new problem with data:', problemData);
    
    try {
      const newProblem = await createProblem(problemData);
      console.log('Problem created:', newProblem);
      return NextResponse.json(newProblem, { status: 201 });
    } catch (dbError) {
      console.error('Database error creating problem:', dbError);
      return NextResponse.json(
        { error: 'Database error: Failed to create problem', details: (dbError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json(
      { error: 'Failed to create problem' },
      { status: 500 }
    );
  }
}

