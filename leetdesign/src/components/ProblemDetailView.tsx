import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Problem } from '@/models/Problem';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import LoginPrompt from './LoginPrompt';
import ReactMarkdown from 'react-markdown';

interface ProblemDetailViewProps {
  problem: Problem;
  onSaveSolution: (solution: string) => void;
}

// Create a component for the main content that uses useSearchParams
function ProblemDetail({ problem, onSaveSolution }: ProblemDetailViewProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [progressStatus, setProgressStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [checkResult, setCheckResult] = useState<{ matchPercentage: number; feedback: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backHref = from === 'admin' ? '/admin/problems' : '/problems';

  // Get auth status
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  // Fetch user progress when component mounts
  useEffect(() => {
    // Only fetch progress if user is authenticated
    if (!isAuthenticated && !authLoading) {
      return;
    }

    const fetchUserProgress = async () => {
      try {
        const response = await fetch(`/api/auth/problems/progress/${problem._id}`);

        if (!response.ok) {
          // If not authenticated or other error, just continue without progress data
          return;
        }

        const data = await response.json();

        if (data.progress) {
          setAnswer(data.progress.solution || '');
          setProgressStatus(data.progress.status || 'not_started');
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchUserProgress();
  }, [problem._id, isAuthenticated, authLoading]);

  const promptLogin = () => {
    setShowLoginPrompt(true);
  };

  const handleSave = async () => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      promptLogin();
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Call the parent component's onSaveSolution function
      onSaveSolution(answer);

      // Also save to the backend
      const response = await fetch(`/api/auth/problems/progress/${problem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solution: answer,
          status: answer.trim() ? 'in_progress' : 'not_started',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save progress');
      }

      setSaveMessage({ type: 'success', text: 'Progress saved successfully!' });

      // Update status based on the response
      const data = await response.json();
      if (data.progress && data.progress.status) {
        setProgressStatus(data.progress.status);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      setSaveMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error saving progress'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const markAsCompleted = async () => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      promptLogin();
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/auth/problems/progress/${problem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solution: answer,
          status: 'completed',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      setProgressStatus('completed');
      setSaveMessage({ type: 'success', text: 'Problem marked as completed!' });
    } catch (error) {
      console.error('Error updating status:', error);
      setSaveMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error updating status'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetProgress = async () => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      promptLogin();
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`/api/auth/problems/progress/${problem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solution: '',
          status: 'not_started',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset progress');
      }

      // Clear the answer and update status
      setAnswer('');
      setProgressStatus('not_started');
      setShowResetConfirm(false);
      setCheckResult(null);
      setSaveMessage({ type: 'success', text: 'Progress has been reset!' });
    } catch (error) {
      console.error('Error resetting progress:', error);
      setSaveMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error resetting progress'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const checkSolution = async () => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      promptLogin();
      return;
    }

    if (!answer.trim()) {
      setSaveMessage({ type: 'error', text: 'Please write a solution before checking.' });
      return;
    }

    setIsChecking(true);
    setCheckResult(null);

    try {
      const response = await fetch('/api/auth/check-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userSolution: answer,
          referenceSolution: problem.reference_solution,
          problemTitle: problem.title,
          problemDescription: problem.description,
          functionalRequirements: problem.functional_requirements,
          nonFunctionalRequirements: problem.non_functional_requirements,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check solution');
      }

      const data = await response.json();
      setCheckResult({
        matchPercentage: data.matchPercentage,
        feedback: data.feedback
      });

      console.log('Check result:', data);
      // If the match percentage is high enough, suggest marking as completed
      if (data.matchPercentage >= 95) {
        setSaveMessage({
          type: 'success',
          text: `Congratulations! Your solution matches the reference solution by ${data.matchPercentage}%. This problem is now marked as completed!`
        });
        markAsCompleted();
      } else if (data.matchPercentage >= 80) {
        setSaveMessage({
          type: 'success',
          text: `Congratulations! Your solution matches the reference solution by ${data.matchPercentage}%. See what you can improve on!`
        });
      } else if (data.matchPercentage >= 50) {
        setSaveMessage({
          type: 'success',
          text: `Your solution matches the reference solution by ${data.matchPercentage}%. See what you missed!`
        });
      } else {
        setSaveMessage({
          type: 'error',
          text: `Your solution only matches the reference solution by ${data.matchPercentage}%. Practice more to improve!`
        });
      }
    } catch (error) {
      console.error('Error checking solution:', error);
      setSaveMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error checking solution'
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{problem.title}</h1>
            <div className="flex items-center gap-3">
              <span className={`inline-block px-3 py-1 text-sm rounded-full 
              ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {problem.difficulty}
              </span>
              {isAuthenticated && (
                <span className={`inline-block px-3 py-1 text-sm rounded-full 
                ${progressStatus === 'not_started' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                    progressStatus === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                  {progressStatus === 'not_started' ? 'Not Started' :
                    progressStatus === 'in_progress' ? 'In Progress' : 'Completed'}
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{problem.description}</p>

          {/* Requirements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Requirements</h2>

            {/* Functional Requirements */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                Functional Requirements
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                {problem.functional_requirements.map((req: string, index: number) => (
                  req.endsWith(':') ? (
                    <li key={index} className="font-semibold mt-4 list-none -ml-5 text-indigo-600 dark:text-indigo-400">
                      {req}
                    </li>
                  ) : (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      {req}
                    </li>
                  )
                ))}
              </ul>
            </div>

            {/* Non-Functional Requirements */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                Non-Functional Requirements
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                {problem.non_functional_requirements.map((req: string, index: number) => (
                  req.endsWith(':') ? (
                    <li key={index} className="font-semibold mt-4 list-none -ml-5 text-indigo-600 dark:text-indigo-400">
                      {req}
                    </li>
                  ) : (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      {req}
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Two column layout for workspace and hints */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Answer workspace */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative">
              {/* Login prompt overlay */}
              {!isAuthenticated && showLoginPrompt && (
                <LoginPrompt
                  message="You need to be logged in to save your progress and submit solutions."
                  redirectUrl={`/problems/${problem._id}`}
                  onClose={() => setShowLoginPrompt(false)}
                  isOverlay={true}
                />
              )}

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Solution</h2>

                {/* Reset button - only show if there's progress to reset and user is logged in */}
                {isAuthenticated && (progressStatus !== 'not_started' || answer.trim()) && (
                  <div className="relative">
                    <button
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowResetConfirm(true)}
                    >
                      Reset Progress
                    </button>

                    {/* Confirmation popup */}
                    {showResetConfirm && (
                      <div className="absolute right-0 top-8 z-10 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          Are you sure? This will remove your solution and reset your progress.
                        </p>
                        <div className="flex justify-end space-x-2">
                          <button
                            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            onClick={() => setShowResetConfirm(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            onClick={resetProgress}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Resetting...' : 'Reset'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {saveMessage && (
                <div className={`mb-4 p-3 rounded ${saveMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-200'
                  }`}>
                  {saveMessage.text}
                </div>
              )}

              {!isAuthenticated && !showLoginPrompt && (
                <div className="mb-4 p-3 rounded border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800/50">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <p className="font-medium">You are not logged in</p>
                      <p className="text-sm">Your solution will not be saved. <button onClick={promptLogin} className="underline font-medium hover:text-amber-900 dark:hover:text-amber-100">Login</button> to save your progress.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <textarea
                  className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  placeholder={isAuthenticated ? "Write your solution here..." : "Write your solution here... (Login required to save)"}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={isAuthenticated ? handleSave : promptLogin}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Progress'}
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={isAuthenticated ? checkSolution : promptLogin}
                    disabled={isChecking || !answer.trim()}
                  >
                    {isChecking ? 'Checking...' : 'Check Solution'}
                  </button>
                  {answer.trim() && (isAuthenticated ? (progressStatus !== 'completed') : true) && (
                    <button
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={isAuthenticated ? markAsCompleted : promptLogin}
                      disabled={isSaving}
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
                <button
                  className="px-6 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowSolution(!showSolution)}
                >
                  {showSolution ? 'Hide Reference Solution' : 'View Reference Solution'}
                </button>
              </div>
            </div>

            {/* Check solution result */}
            {checkResult && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Solution Check Result</h2>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-4">
                      <div
                        className={`h-4 rounded-full ${checkResult.matchPercentage >= 80 ? 'bg-green-500' :
                          checkResult.matchPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${checkResult.matchPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-medium text-gray-800 dark:text-white">
                      {checkResult.matchPercentage}% Match
                    </span>
                  </div>
                </div>
                <div className="prose prose-indigo dark:prose-invert max-w-none">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Feedback:</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{checkResult.feedback}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reference solution */}
            {showSolution && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 pb-0">Reference Solution</h2>
                <div className="p-6 pt-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md overflow-auto">
                    <ReactMarkdown
                      className="markdown-content text-gray-900 dark:text-white p-4"
                      components={{
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        p: ({ node: _node, ...props }) => <p className="text-gray-900 dark:text-white mb-4" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        h1: ({ node: _node, ...props }) => <h1 className="text-gray-900 dark:text-white text-2xl font-bold mb-4" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        h2: ({ node: _node, ...props }) => <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-3" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        h3: ({ node: _node, ...props }) => <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ul: ({ node: _node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-900 dark:text-white" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        ol: ({ node: _node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-900 dark:text-white" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        li: ({ node: _node, ...props }) => <li className="mb-2 text-gray-900 dark:text-white" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        code: ({ node: _node, inline, ...props }: { node?: unknown, inline?: boolean } & React.HTMLAttributes<HTMLElement>) => (
                          inline ?
                            <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-gray-900 dark:text-white" {...props} /> :
                            <code className="block bg-gray-200 dark:bg-gray-600 p-2 rounded text-gray-900 dark:text-white" {...props} />
                        ),
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        pre: ({ node: _node, ...props }) => <pre className="bg-gray-200 dark:bg-gray-600 p-4 rounded mb-4 overflow-x-auto" {...props} />,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        blockquote: ({ node: _node, ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-500 pl-4 italic text-gray-700 dark:text-gray-300 mb-4" {...props} />,
                      }}
                    >
                      {problem.reference_solution}
                    </ReactMarkdown>
                  </div>
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
                <Link href={backHref} className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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

// Loading component for the Suspense fallback
function ProblemDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
    </div>
  );
}

export default function ProblemDetailView(props: ProblemDetailViewProps) {
  return (
    <Suspense fallback={<ProblemDetailLoading />}>
      <ProblemDetail {...props} />
    </Suspense>
  );
} 