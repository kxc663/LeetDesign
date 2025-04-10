'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProblem } from '@/lib/problemService';
import { useAuth } from '@/hooks/AuthContext';
import { Hint } from '@/models/Problem';
import ProblemForm from '@/components/admin/ProblemForm';
import { CreateProblemInput } from '@/models/Problem';
export default function CreateProblemPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin
  const isAdmin = isAuthenticated && user?.email?.endsWith('@leetdesign.com');
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Initial empty values for the form
  const initialValues = {
    title: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    description: '',
    functionalRequirements: [],
    nonFunctionalRequirements: [],
    hints: [{ id: 'h1', title: '', content: '' }] as Hint[],
    referenceSolution: '',
  };
  
  const handleSubmit = async (formData: CreateProblemInput) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting problem:', formData);
      
      // Submit problem
      const newProblem = await createProblem(formData);
      
      setSuccess('Problem created successfully!');
      console.log('New problem created:', newProblem);
      
      // Make sure we have a valid ID before redirecting
      if (newProblem && newProblem._id) {
        console.log(`Redirecting to problem with ID: ${newProblem._id}`);
        // Redirect to the problem details page after a short delay
        setTimeout(() => {
          router.push(`/problems/${newProblem._id}?from=admin`);
        }, 2000);
      } else {
        console.error('Problem was created but no valid ID was returned', newProblem);
        setError('Problem was created but could not redirect to the new problem page.');
      }
    } catch (error) {
      console.error('Error creating problem:', error);
      const errorMessage = 'An error occurred while creating the problem. Please try again.';
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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Problem</h1>
          <Link 
            href="/admin/problems" 
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Problems
          </Link>
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
          submitButtonText="Create Problem"
          submittingButtonText="Creating Problem..."
        />
      </div>
    </div>
  );
} 