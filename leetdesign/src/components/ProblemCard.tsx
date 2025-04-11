import Link from 'next/link';
import { ProblemListItem } from '@/models/Problem';
import { ProgressStatus } from '@/models/UserProgress';

interface ProblemCardProps {
  problem: ProblemListItem & {
    progressStatus?: ProgressStatus;
  };
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  // Map status to readable text and styling
  const getStatusBadge = () => {
    if (!problem.progressStatus || problem.progressStatus === 'not_started') {
      return (
        <span className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Not Started
        </span>
      );
    } else if (problem.progressStatus === 'in_progress') {
      return (
        <span className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
          </svg>
          In Progress
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          Completed
        </span>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {typeof problem.displayId !== 'undefined' ? `${problem.displayId}. ` : ''}
              {problem.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`inline-block px-2 py-1 text-xs rounded-full 
                ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {problem.difficulty}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{problem.category}</span>
              {getStatusBadge()}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{problem.description}</p>
          </div>
        </div>
        <div className="mt-4">
          <Link href={`/problems/${problem.id}`} 
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${problem.progressStatus === 'completed' 
              ? 'bg-green-600 hover:bg-green-700' 
              : problem.progressStatus === 'in_progress'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-indigo-600 hover:bg-indigo-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
            {problem.progressStatus === 'completed' 
              ? 'Review Solution' 
              : problem.progressStatus === 'in_progress' 
              ? 'Continue Solving' 
              : 'Solve Problem'}
          </Link>
        </div>
      </div>
    </div>
  );
} 