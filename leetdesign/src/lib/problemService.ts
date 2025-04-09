import mongoose from 'mongoose';
import Problem, { Problem as ProblemType, ProblemListItem, CreateProblemInput } from '@/models/Problem';

// Helper to check if we're on the server or client side
const isServer = typeof window === 'undefined';

/**
 * Get a list of all problems
 */
export async function getProblems(): Promise<ProblemListItem[]> {
  // If on client side, make a fetch request instead of direct DB access
  if (!isServer) {
    try {
      const response = await fetch('/api/auth/problems');
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
  }
  
  // Server-side DB access
  try {
    const problems = await Problem.find({}, 'id displayId title difficulty description category');
    console.log('Raw problems from DB:', problems);
    
    return problems.map((problem: any) => ({
      id: problem._id.toString(),
      displayId: problem.displayId,
      title: problem.title,
      difficulty: problem.difficulty,
      description: problem.description,
      category: problem.category,
      attempted: false, 
      completed: false
    }));
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
}

/**
 * Get a specific problem by ID
 */
export async function getProblem(id: string): Promise<ProblemType | null> {
  // Check for invalid ID
  if (!id || id === 'undefined' || id === 'null') {
    console.log(`Invalid problem ID provided: ${id}`);
    return null;
  }

  // If on client side, make a fetch request instead of direct DB access
  if (!isServer) {
    try {
      const response = await fetch(`/api/auth/problems/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch problem');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching problem with id ${id}:`, error);
      throw error;
    }
  }
  
  // Server-side DB access
  try {
    // Add validation for valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`Invalid MongoDB ObjectId: ${id}`);
      return null;
    }
    
    const problem = await Problem.findById(id);
    return problem;
  } catch (error) {
    console.error(`Error fetching problem with id ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a problem by ID
 */
export async function deleteProblem(id: string): Promise<boolean> {
  // If on client side, make a fetch request instead of direct DB access
  if (!isServer) {
    try {
      const response = await fetch(`/api/auth/problems/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error(`Error deleting problem with id ${id}:`, error);
      throw error;
    }
  }
  
  // Server-side DB access
  try {
    await Problem.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error(`Error deleting problem with id ${id}:`, error);
    throw error;
  }
}

/**
 * Save a user's solution to a problem
 */
export async function saveSolution(problemId: string, solution: string): Promise<boolean> {
  // This would typically update a User or UserSolution collection
  // For now, return true as a placeholder
  return true;
}

/**
 * Mark a problem as completed
 */
export async function markProblemCompleted(problemId: string): Promise<boolean> {
  // In a real app, this would be an API call
  return true;
}

/**
 * Create a new problem
 */
export async function createProblem(problem: CreateProblemInput): Promise<ProblemType> {
  // If on client side, make a fetch request instead of direct DB access
  if (!isServer) {
    try {
      const response = await fetch('/api/auth/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problem),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create problem');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating problem:', error);
      throw error;
    }
  }
  
  // Server-side DB access
  try {
    // Get the current count for displayId
    const count = await Problem.countDocuments();
    const displayIdToUse = count + 1;
    
    console.log(`Creating problem with displayId: ${displayIdToUse}`);
    
    const newProblem = new Problem({
      ...problem,
      displayId: displayIdToUse
    });

    console.log('New problem:', newProblem);
    
    await newProblem.save();
    
    // Create a formatted response with both _id and id fields to ensure compatibility
    const savedProblem = newProblem.toObject();
    
    // Ensure we're returning the MongoDB _id
    console.log('Saved problem with _id:', savedProblem._id);
    
    return savedProblem;
  } catch (error) {
    console.error('Error creating problem:', error);
    throw error;
  }
}