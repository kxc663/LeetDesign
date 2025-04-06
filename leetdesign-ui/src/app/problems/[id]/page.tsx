'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Problem } from '@/models/Problem';
import ProblemDetailView from '@/components/ProblemDetailView';
import { getProblem, saveSolution } from '@/lib/problemService';

export default function ProblemDetail({ params }: { params: { id: string } }) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblem(params.id);
        setProblem(data);
      } catch (error) {
        console.error('Failed to fetch problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [params.id]);

  const handleSaveSolution = async (solution: string) => {
    if (!problem) return;
    
    try {
      const success = await saveSolution(problem.id, solution);
      if (success) {
        alert('Solution saved!');
      } else {
        alert('Failed to save solution. Please try again.');
      }
    } catch (error) {
      console.error('Error saving solution:', error);
      alert('An error occurred while saving your solution.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Problem not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The problem you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/problems" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Back to Problems
        </Link>
      </div>
    );
  }

  return <ProblemDetailView problem={problem} onSaveSolution={handleSaveSolution} />;
} 