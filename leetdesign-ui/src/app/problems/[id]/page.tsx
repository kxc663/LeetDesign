'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Hint {
  id: string;
  title: string;
  content: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  requirements: string[];
  hints: Hint[];
  category: string;
  attempted: boolean;
  completed: boolean;
  reference_solution: string;
}

// Mock problem data
const MOCK_PROBLEMS: Record<string, Problem> = {
  '1': {
    id: '1',
    title: 'Design a URL Shortener',
    difficulty: 'Medium',
    description: 'Create a service that takes in a long URL and returns a shorter, unique URL. When users access the shortened URL, they should be redirected to the original URL. The system should be able to handle high traffic and be scalable.',
    requirements: [
      'Functional Requirements:',
      'Given a URL, generate a shorter and unique alias (short link)',
      'When users access a short link, redirect them to the original link',
      'Users should be able to customize their short link',
      'Links should expire after a standard default timespan (configurable)',
      
      'Non-Functional Requirements:',
      'The system should be highly available',
      'URL redirection should happen in real-time with minimal latency',
      'Shortened links should not be guessable'
    ],
    hints: [
      {
        id: 'h1',
        title: 'API Design',
        content: 'Consider designing RESTful APIs for URL shortening and redirection. What endpoints will you need?'
      },
      {
        id: 'h2',
        title: 'Storage',
        content: 'What kind of database would be suitable for this use case? How would you structure your data model?'
      },
      {
        id: 'h3',
        title: 'URL Generation Strategy',
        content: 'How will you generate unique short URLs? Consider tradeoffs between different approaches like hashing, encoding, or using random characters.'
      }
    ],
    category: 'Web Services',
    attempted: false,
    completed: false,
    reference_solution: `
# Design a URL Shortener

## 1. System Requirements

### Functional Requirements:
- Generate a short URL from a long URL
- Redirect to the original URL when accessing the short URL
- Support custom short URLs
- URLs should expire after a certain time
- Analytics for URL access

### Non-Functional Requirements:
- High availability
- Low latency for redirection
- Scalable system
- Secure - URLs should not be guessable

## 2. API Design

**Create Short URL:**
\`\`\`
POST /api/shorten
Request: {
  "original_url": "https://example.com/very/long/path",
  "custom_alias": "custom" (optional),
  "expiration_time": 3600 (optional, seconds)
}
Response: {
  "short_url": "https://short.url/abc123",
  "expiration_time": "2023-04-06T12:00:00Z"
}
\`\`\`

**Redirect:**
\`\`\`
GET /:shortcode
Response: HTTP 302 redirect to original URL
\`\`\`

## 3. Database Design

**URL Table:**
- id: Primary Key
- short_code: String, unique, indexed
- original_url: String
- creation_date: Timestamp
- expiration_date: Timestamp
- user_id: Foreign Key (if user authentication is implemented)

## 4. System Architecture

### Components:
1. **Application Service** - Handles API requests, URL generation, and redirections
2. **Database** - Stores URL mappings
3. **Cache** - For frequently accessed URLs
4. **Analytics Service** - Tracks URL usage statistics

### Data Flow:
1. User submits a long URL
2. Application generates a unique short code
3. Mapping is stored in the database and cache
4. User gets the short URL
5. When short URL is accessed, system looks up original URL and redirects

## 5. URL Generation Strategy

Use base62 encoding (a-z, A-Z, 0-9) for generating short codes:
- Take the auto-incremented ID from the database
- Convert it to base62 representation
- For a 7-character code, we can support up to 62^7 ≈ 3.5 trillion URLs

## 6. Scaling Considerations

- **Database Sharding**: Partition data based on short code hash
- **Caching**: Use Redis/Memcached for frequently accessed URLs
- **Load Balancing**: Distribute traffic across multiple application servers
- **Rate Limiting**: Prevent abuse of the service
- **CDN**: For global access with reduced latency

## 7. Analytics

Track metrics like:
- Click count
- Referrer sources
- Geographical distribution
- Time distribution
`
  },
  // Additional problems would be defined here
};

export default function ProblemDetail({ params }: { params: { id: string } }) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  // Simulate fetching problem data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setProblem(MOCK_PROBLEMS[params.id] || null);
      setLoading(false);
    }, 500);
  }, [params.id]);

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
              <Link href="/problems" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                All Problems
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
                  onClick={() => alert('Solution saved!')}
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
          </div>

          {/* Hints and guidance */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Hints</h2>
              <div className="space-y-3">
                {problem.hints.map((hint: Hint) => (
                  <div key={hint.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button
                      className="w-full px-4 py-3 text-left text-gray-800 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg focus:outline-none flex justify-between items-center"
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
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Approach Guidelines</h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full mr-2 text-sm font-medium">1</span>
                  <span>Start with the functional and non-functional requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full mr-2 text-sm font-medium">2</span>
                  <span>Define the API design for key operations</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full mr-2 text-sm font-medium">3</span>
                  <span>Sketch the high-level system architecture</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full mr-2 text-sm font-medium">4</span>
                  <span>Detail data models and storage requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full mr-2 text-sm font-medium">5</span>
                  <span>Consider scaling challenges and solutions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reference solution (conditionally rendered) */}
        {showSolution && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Reference Solution</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-auto">
              <pre className="text-gray-800 dark:text-gray-300 font-mono whitespace-pre-wrap">{problem.reference_solution}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 