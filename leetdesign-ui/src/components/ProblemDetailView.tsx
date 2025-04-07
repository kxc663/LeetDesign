import { useState } from 'react';
import Link from 'next/link';
import { Problem } from '@/models/Problem';
import { useSearchParams } from 'next/navigation';

interface ProblemDetailViewProps {
  problem: Problem;
  onSaveSolution: (solution: string) => void;
}

export default function ProblemDetailView({ problem, onSaveSolution }: ProblemDetailViewProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleSave = () => {
    onSaveSolution(answer);
  };

  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backHerf = from === 'admin' ? '/admin/problems' : '/problems';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{problem.title}</h1>
            <div className="mt-3 md:mt-0">
              <span className={`inline-block px-3 py-1 text-sm rounded-full 
                ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{problem.description}</p>

          {/* Requirements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Requirements</h2>
            <ul className="space-y-2">
              {problem.requirements.map((req: string, index: number) => (
                <li key={index} className={`${req.endsWith(':') ? 'font-semibold mt-4' : 'ml-4'} text-gray-700 dark:text-gray-300`}>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Two column layout for workspace and hints */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Answer workspace */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Solution</h2>
              <div className="mb-4">
                <textarea
                  className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  placeholder="Write your solution here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                <button 
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={handleSave}
                >
                  Save Progress
                </button>
                <button 
                  className="px-6 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowSolution(!showSolution)}
                >
                  {showSolution ? 'Hide Reference Solution' : 'View Reference Solution'}
                </button>
              </div>
            </div>

            {/* Reference solution */}
            {showSolution && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Reference Solution</h2>
                <div className="prose prose-indigo dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-md overflow-auto">
                    {problem.reference_solution}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Hints and navigation section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Hints</h2>
              <div className="space-y-4">
                {problem.hints.map((hint) => (
                  <div key={hint.id} className="border border-gray-200 dark:border-gray-700 rounded-md">
                    <button
                      className="w-full px-4 py-3 text-left font-medium text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                      onClick={() => setShowHint(showHint === hint.id ? null : hint.id)}
                    >
                      <span>{hint.title}</span>
                      <svg className={`w-5 h-5 transition-transform ${showHint === hint.id ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    {showHint === hint.id && (
                      <div className="px-4 py-3 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
                        {hint.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex flex-col space-y-4">
                <Link href={backHerf} className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                  </svg>
                  Back to Problems
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 