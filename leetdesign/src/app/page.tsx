import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero section */}
      <section className="container mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Master System Design <span className="text-indigo-600 dark:text-indigo-400">Step by Step</span>
            </h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              LeetDesign offers a structured approach to learning system design with curated problems, guided prompts, and detailed reference solutions.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/problems" className="px-8 py-3 text-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                Browse Problems
              </Link>
              <Link href="/signup" className="px-8 py-3 text-center rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-800 transition-colors">
                Sign Up Free
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-indigo-600 rounded-lg transform rotate-3 opacity-20"></div>
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Design a URL Shortener</h3>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mt-2">Medium</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Create a service that takes in a long URL and returns a shorter URL...</p>
                <div className="flex justify-end">
                  <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm font-medium">Solve Problem →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Problem Bank</h3>
              <p className="text-gray-600 dark:text-gray-300">Browse and search a curated list of system design problems categorized by difficulty.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Writing Workspace</h3>
              <p className="text-gray-600 dark:text-gray-300">Draft and organize your solutions using a clean markdown editor with integrated guidance.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Reference Solutions</h3>
              <p className="text-gray-600 dark:text-gray-300">Unlock step-by-step hints and compare your design against expert reference answers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-indigo-600 dark:bg-indigo-800 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to improve your system design skills?</h2>
          <p className="text-lg mb-8 text-indigo-100">Join LeetDesign today and start mastering system architecture step by step.</p>
          <Link href="/signup" className="px-8 py-3 rounded-lg bg-white text-indigo-600 hover:bg-gray-100 transition-colors font-medium">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">LeetDesign</span>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Master system design one problem at a time.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-gray-800 dark:text-white font-semibold mb-4">Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/problems" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Problems</Link></li>
                  <li><Link href="/about" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">About</Link></li>
                  <li><Link href="/privacy" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-gray-800 dark:text-white font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="https://github.com/yourusername/LeetDesign" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">GitHub</a></li>
                  <li><a href="mailto:contact@leetdesign.io" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} LeetDesign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
