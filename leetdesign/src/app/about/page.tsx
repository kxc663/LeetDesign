import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* About header */}
      <header className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            About LeetDesign
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            LeetDesign is an open-source platform designed to help students and engineers
            systematically practice System Design problems.
          </p>
        </div>
      </header>

      {/* Our mission */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              System design interviews have become a critical part of the technical interview process
              for software engineers, especially for mid to senior-level positions. Unlike coding interviews,
              system design questions are open-ended and require a deep understanding of distributed systems,
              scalability, and reliability.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We created LeetDesign to provide a structured approach to learning and practicing system design.
              Our platform offers high-quality problems, guided thinking prompts, detailed reference solutions,
              and progress tracking — making it easier to master complex system architecture skills step by step.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our goal is to demystify system design and help engineers build the skills and confidence needed
              to excel in technical interviews and real-world engineering challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-12 text-center">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Curated Problem Bank
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse and search a carefully selected list of system design problems categorized by difficulty.
                From URL shorteners to social networks, our problems cover a wide range of real-world scenarios.
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Guided Learning Workspace
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our structured workspace guides you through the system design process with an intuitive
                markdown editor and step-by-step approach prompts that help you consider all aspects of your design.
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Expert Solutions & Hints
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stuck on a problem? Access targeted hints to guide your thinking without revealing the entire solution.
                When ready, compare your design with detailed expert reference solutions.
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your progress over time. See which problems you&apos;ve attempted, which ones you&apos;ve completed,
                and where you might need more practice.
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Community Discussions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn from others by engaging in discussions about system design problems.
                Share your approach, receive feedback, and discover alternative solutions.
                <span className="text-sm italic block mt-2">(Coming soon)</span>
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                AI-Powered Feedback
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive instant feedback on your solutions with our AI-powered analysis tool.
                Get targeted suggestions to improve your system design skills.
                <span className="text-sm italic block mt-2">(Coming soon)</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-indigo-600 dark:bg-indigo-800 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to master system design?</h2>
            <p className="text-lg mb-8 text-indigo-100">
              Join LeetDesign today and start building the skills you need to excel in system design interviews.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/problems" className="px-8 py-3 rounded-lg bg-white text-indigo-600 hover:bg-gray-100 transition-colors font-medium">
                Browse Problems
              </Link>
              <Link href="/signup" className="px-8 py-3 rounded-lg border border-white text-white hover:bg-indigo-700 transition-colors font-medium">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-12">
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
                  <li><a href="https://github.com/kxc663/LeetDesign" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">GitHub</a></li>
                  <li><a href="mailto:contact@leetdesign.io" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} LeetDesign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 