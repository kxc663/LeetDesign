'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProblem } from '@/lib/problemService';
import { useAuth } from '@/hooks/AuthContext';
import DynamicInputList from '@/components/admin/DynamicInputList';
import DynamicHintsList from '@/components/admin/DynamicHintsList';
import { Hint } from '@/models/Problem';

export default function CreateProblemPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin
  const isAdmin = isAuthenticated && user?.email?.endsWith('@leetdesign.com');
  
  // Form state
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [functionalRequirements, setFunctionalRequirements] = useState<string[]>([]);
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState<string[]>([]);
  const [hints, setHints] = useState<Hint[]>([{ id: 'h1', title: '', content: '' }]);
  const [referenceSolution, setReferenceSolution] = useState('');
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !category || !description || !referenceSolution) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (functionalRequirements.length < 1 || nonFunctionalRequirements.length < 1) {
      setError('Please add at least one requirement for each requirement type.');
      return;
    }
    
    if (hints.some(hint => !hint.title || !hint.content)) {
      setError('Please fill in all hint titles and content.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      
      // Create problem object
      const problemData = {
        title,
        difficulty,
        category,
        description,
        functional_requirements: functionalRequirements,
        non_functional_requirements: nonFunctionalRequirements,
        hints,
        reference_solution: referenceSolution
      };
      
      console.log('Submitting problem:', problemData);
      
      // Submit problem
      const newProblem = await createProblem(problemData);
      
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
      let errorMessage = 'An error occurred while creating the problem. Please try again.';
      
      // Try to extract more specific error message if available
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
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
        <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have permission to access this page.</p>
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
            href="/admin" 
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
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
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. Design a URL Shortener"
                required
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. Web Services, Databases, System Design"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Provide a short description of the problem..."
              required
            ></textarea>
          </div>
          
          {/* Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DynamicInputList
              label="Functional Requirements"
              items={functionalRequirements}
              onChange={setFunctionalRequirements}
              placeholder="Enter a functional requirement..."
            />
            
            <DynamicInputList
              label="Non-Functional Requirements"
              items={nonFunctionalRequirements}
              onChange={setNonFunctionalRequirements}
              placeholder="Enter a non-functional requirement..."
            />
          </div>
          
          {/* Hints */}
          <div className="mb-6">
            <DynamicHintsList
              hints={hints}
              onChange={setHints}
            />
          </div>
          
          {/* Reference Solution */}
          <div className="mb-6">
            <label htmlFor="referenceSolution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reference Solution <span className="text-red-500">*</span>
            </label>
            <textarea
              id="referenceSolution"
              value={referenceSolution}
              onChange={(e) => setReferenceSolution(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              placeholder="# Reference Solution

## 1. System Requirements
..."
              required
            ></textarea>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Markdown formatting is supported.
            </p>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating Problem...' : 'Create Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 