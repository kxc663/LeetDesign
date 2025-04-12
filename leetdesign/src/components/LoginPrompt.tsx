import Link from 'next/link';

interface LoginPromptProps {
  message?: string;
  redirectUrl: string;
  onClose?: () => void;
  isOverlay?: boolean;
}

export default function LoginPrompt({ 
  message = "You need to be logged in to access this feature.", 
  redirectUrl, 
  onClose, 
  isOverlay = true 
}: LoginPromptProps) {
  return (
    <div className={`${isOverlay ? 'absolute inset-0 bg-white/90 dark:bg-gray-800/90 flex items-center justify-center p-6 z-10 rounded-lg' : ''}`}>
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <svg className="w-16 h-16 text-indigo-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login Required</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href={`/login?redirect=${redirectUrl}`} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href={`/signup?redirect=${redirectUrl}`} 
            className="bg-white text-indigo-600 border border-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700 transition-colors"
          >
            Sign Up
          </Link>
          {onClose && (
            <button 
              className="text-gray-600 dark:text-gray-400 underline hover:text-gray-800 dark:hover:text-white transition-colors mt-2 sm:mt-0"
              onClick={onClose}
            >
              Continue Reading
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 