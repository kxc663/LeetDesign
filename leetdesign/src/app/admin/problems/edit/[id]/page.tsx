'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProblem, updateProblem } from '@/lib/problemService';
import { useAuth } from '@/hooks/AuthContext';
import { Hint } from '@/models/Problem';
import ProblemForm from '@/components/admin/ProblemForm';
import { CreateProblemInput } from '@/models/Problem';

export default function EditProblemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { id } = params;
  
  // Check if user is admin
  const isAdmin = isAuthenticated && user?.email?.endsWith('@leetdesign.com');
  
  // Initial values for the form (will be populated with problem data)
  const [initialValues, setInitialValues] = useState({
    title: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    description: '',
    functionalRequirements: [] as string[],
    nonFunctionalRequirements: [] as string[],
    hints: [{ id: 'h1', title: '', content: '' }] as Hint[],
    referenceSolution: '',
  });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const problem = await getProblem(id);
        if (problem) {
          setInitialValues({
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            description: problem.description,
            functionalRequirements: problem.functional_requirements,
            nonFunctionalRequirements: problem.non_functional_requirements,
            hints: problem.hints,
            referenceSolution: problem.reference_solution
          });
        } else {
          setError('Problem not found');
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        setError('Failed to load problem data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);
  
  const handleSubmit = async (formData: Partial<CreateProblemInput>) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Updating problem:', formData);
      
      // Update problem
      const updatedProblem = await updateProblem(id, formData);
      
      if (updatedProblem) {
        setSuccess('Problem updated successfully!');
        console.log('Problem updated:', updatedProblem);
        
        // Redirect to the problem details page after a short delay
        setTimeout(() => {
          router.push(`/problems/${id}?from=admin`);
        }, 2000);
      } else {
        setError('Problem could not be updated. Please try again.');
      }
    } catch (error) {
      console.error('Error updating problem:', error);
      const errorMessage = 'An error occurred while updating the problem. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Access control
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You don&apos;t have permission to access this page.</p>
        <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Go to Home
        </Link>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Problem</h1>
          <div className="flex space-x-4">
            <Link 
              href={`/problems/${id}?from=admin`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              View Problem
            </Link>
            <Link 
              href="/admin/problems" 
              className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Problems
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200 rounded-md">
            {success}
          </div>
        )}
        
        <ProblemForm 
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Update Problem"
          submittingButtonText="Updating..."
        />
      </div>
    </div>
  );
} 