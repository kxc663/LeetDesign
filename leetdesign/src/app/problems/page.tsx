'use client';

import { useState, useEffect } from 'react';
import { ProblemListItem } from '@/models/Problem';
import ProblemCard from '@/components/ProblemCard';
import { getProblems } from '@/lib/problemService';
import { ProgressStatus } from '@/models/UserProgress';

// Define interface for problem with progress
interface ProblemWithProgress extends ProblemListItem {
  progressStatus?: ProgressStatus;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch problems and user progress
  useEffect(() => {
    const fetchProblemsAndProgress = async () => {
      try {
        setLoading(true);
        // Fetch all problems
        const problemsData = await getProblems();
        
        // Try to fetch user progress (will fail if not logged in, which is fine)
        try {
          const progressResponse = await fetch('/api/auth/problems/progress');
          
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            
            // Map progress data to problems
            const problemsWithProgress = problemsData.map((problem: ProblemListItem) => {
              const progress = progressData.progress.find(
                (p: { id: string; status: ProgressStatus }) => p.id === problem.id
              );
              
              return {
                ...problem,
                progressStatus: progress ? progress.status : 'not_started',
                attempted: progress && progress.status !== 'not_started',
                completed: progress && progress.status === 'completed'
              };
            });
            
            setProblems(problemsWithProgress);
          } else {
            // If not logged in or other error, just use the problems without progress
            setProblems(problemsData.map((problem: ProblemListItem) => ({
              ...problem,
              progressStatus: 'not_started',
              attempted: false,
              completed: false
            })));
          }
        } catch (error) {
          // If error fetching progress, just use the problems without progress
          setProblems(problemsData.map((problem: ProblemListItem) => ({
            ...problem,
            progressStatus: 'not_started',
            attempted: false,
            completed: false
          })));
        }
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemsAndProgress();
  }, []);

  // Get unique categories for the filter dropdown
  const categories = ['All', ...Array.from(new Set(problems.map(problem => problem.category)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const statuses = ['All', 'Not Started', 'In Progress', 'Completed'];

  // Filter problems based on user selections
  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = filterDifficulty === 'All' || problem.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'All' || problem.category === filterCategory;
    
    // Filter by progress status
    let matchesStatus = true;
    if (filterStatus !== 'All') {
      if (filterStatus === 'Not Started') {
        matchesStatus = problem.progressStatus === 'not_started';
      } else if (filterStatus === 'In Progress') {
        matchesStatus = problem.progressStatus === 'in_progress';
      } else if (filterStatus === 'Completed') {
        matchesStatus = problem.progressStatus === 'completed';
      }
    }
    
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDifficulty && matchesCategory && matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">System Design Problems</h1>
        
        {/* Filters and search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/4">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Problems list */}
        <div className="grid grid-cols-1 gap-6">
          {filteredProblems.length > 0 ? (
            filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">No problems found.</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Try changing your search filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 