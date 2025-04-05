'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data - in a real app, this would come from an API
const MOCK_PROBLEMS = [
  {
    id: '1',
    title: 'Design a URL Shortener',
    difficulty: 'Medium',
    description: 'Create a service that takes in a long URL and returns a shorter, unique URL.',
    category: 'Web Services',
    attempted: true,
    completed: false,
  },
  {
    id: '2',
    title: 'Design Twitter',
    difficulty: 'Hard',
    description: 'Design a simplified version of Twitter where users can post tweets, follow other users, and see a feed of tweets.',
    category: 'Social Media',
    attempted: false,
    completed: false,
  },
  {
    id: '3',
    title: 'Design a Key-Value Store',
    difficulty: 'Medium',
    description: 'Create a distributed key-value store with high availability and partition tolerance.',
    category: 'Databases',
    attempted: true,
    completed: true,
  },
  {
    id: '4',
    title: 'Design a Rate Limiter',
    difficulty: 'Easy',
    description: 'Design a rate limiter that can be used to limit the number of requests a client can send to an API within a time window.',
    category: 'System Design',
    attempted: false,
    completed: false,
  },
  {
    id: '5',
    title: 'Design YouTube',
    difficulty: 'Hard',
    description: 'Design a video sharing platform like YouTube that allows users to upload, view, and share videos.',
    category: 'Media Streaming',
    attempted: false,
    completed: false,
  },
];

export default function ProblemsPage() {
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories for the filter dropdown
  const categories = ['All', ...Array.from(new Set(MOCK_PROBLEMS.map(problem => problem.category)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Filter problems based on user selections
  const filteredProblems = MOCK_PROBLEMS.filter(problem => {
    const matchesDifficulty = filterDifficulty === 'All' || problem.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'All' || problem.category === filterCategory;
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                LeetDesign
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                Sign In
              </Link>
              <Link href="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">System Design Problems</h1>
        
        {/* Filters and search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
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
            <div className="w-full md:w-1/3">
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
            <div className="w-full md:w-1/3">
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
          </div>
        </div>
        
        {/* Problems list */}
        <div className="grid grid-cols-1 gap-6">
          {filteredProblems.length > 0 ? (
            filteredProblems.map(problem => (
              <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{problem.title}</h2>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full 
                          ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{problem.category}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{problem.description}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      {problem.completed && (
                        <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium mb-1">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          Completed
                        </span>
                      )}
                      {!problem.completed && problem.attempted && (
                        <span className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                          </svg>
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/problems/${problem.id}`} 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Solve Problem
                    </Link>
                  </div>
                </div>
              </div>
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