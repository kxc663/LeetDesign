import { Problem, ProblemListItem } from '@/models/Problem';

// Mock problem data - In a real app, this would be fetched from an API
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
  '2': {
    id: '2',
    title: 'Design Twitter',
    difficulty: 'Hard',
    description: 'Design a simplified version of Twitter where users can post tweets, follow other users, and see a feed of tweets.',
    requirements: [
      'Functional Requirements:',
      'Users can post tweets (let\'s limit to text-only for simplicity)',
      'Users can follow other users',
      'Users can view a timeline of tweets from users they follow',
      'Users can like and retweet posts',
      'Users can search for tweets or users',
      
      'Non-Functional Requirements:',
      'The system should be highly available',
      'Timeline generation should be efficient with minimal latency',
      'System should scale to millions of users and billions of tweets',
      'Tweet delivery should be consistent'
    ],
    hints: [
      {
        id: 'h1',
        title: 'Data Model',
        content: 'How would you model users, tweets, follows, and likes? What kind of relationships exist between these entities?'
      },
      {
        id: 'h2',
        title: 'Feed Generation',
        content: 'What approaches could you take to generate a user\'s feed? Consider trade-offs between different approaches like pull vs push models.'
      },
      {
        id: 'h3',
        title: 'Scaling Challenges',
        content: 'How would you handle the "hotkey" problem where celebrities have millions of followers? How can you efficiently deliver tweets to all followers?'
      }
    ],
    category: 'Social Media',
    attempted: false,
    completed: false,
    reference_solution: `
# Design Twitter

## 1. System Requirements

### Functional Requirements:
- Post tweets (text up to 280 characters)
- Follow/unfollow users
- Generate home timeline (tweets from followed users)
- Like and retweet functionality
- Search for tweets and users

### Non-Functional Requirements:
- High availability 
- Low latency for timeline generation
- Scalability for millions of users and billions of tweets
- Eventual consistency is acceptable

## 2. Capacity Estimation

Assumptions:
- 200 million daily active users
- Each user posts 2 tweets per day on average
- Each user follows 200 other users on average
- 10% of tweets contain media
- Average tweet size: 150 bytes
- Average media size: 1MB

Daily tweet generation: 200M * 2 = 400M tweets/day
Storage needed for tweets (text only): 400M * 150B = 60GB/day
Storage needed for media: 400M * 10% * 1MB = 40TB/day

## 3. Database Schema

**User Table:**
- user_id (PK)
- username
- email
- password_hash
- profile_info
- created_at

**Tweet Table:**
- tweet_id (PK)
- user_id (FK)
- content
- created_at
- retweet_count
- like_count

**Follow Table:**
- follower_id (FK)
- followee_id (FK)
- created_at
- Composite primary key: (follower_id, followee_id)

**Like Table:**
- user_id (FK)
- tweet_id (FK)
- created_at
- Composite primary key: (user_id, tweet_id)

**Media Table:**
- media_id (PK)
- tweet_id (FK)
- media_url
- media_type
- created_at

## 4. System Architecture

### Components:

1. **Application Servers**:
   - Handle user requests
   - Authenticate users
   - Route to appropriate services

2. **Tweet Service**:
   - Create, read, update tweets
   - Handle media uploads

3. **User Service**:
   - User authentication
   - Follow/unfollow management

4. **Timeline Service**:
   - Generate home timeline
   - Implement timeline caching

5. **Search Service**:
   - Index tweets and users
   - Provide search capability

6. **Notification Service**:
   - Handle notification delivery 

### Data Storage:

- **Relational Database**: For user data and relationships (MySQL/PostgreSQL)
- **NoSQL Database**: For tweets and timeline data (Cassandra)
- **Blob Storage**: For media files (S3)
- **Cache**: For frequently accessed data (Redis)
- **Search Index**: For search functionality (Elasticsearch)

## 5. Feed Generation Approaches

### Pull Model:
- When a user requests their timeline, fetch tweets from all followed users
- Sort by timestamp
- Cons: High latency for users following many accounts

### Push Model:
- When a user tweets, push to all followers' timelines
- Pre-compute timelines
- Cons: Resource intensive for users with millions of followers

### Hybrid Approach:
- Push model for regular users
- Pull model for high-profile users with many followers
- Best of both worlds

## 6. Scaling Considerations

- **Database Sharding**: Partition by user_id
- **Caching Strategy**: Cache timelines, popular tweets, user data
- **Load Balancing**: Distribute traffic across application servers
- **CDN**: For media content delivery
- **Asynchronous Processing**: Queue-based system for tweet fanout
- **Read Replicas**: For read-heavy workloads

## 7. Advanced Features

- **Trending Topics**: 
  - Aggregate hashtags in real-time
  - Use stream processing (Spark/Flink)

- **Who to Follow**:
  - Graph-based recommendation system

- **Tweet Visibility**:
  - Public vs private tweets
  - Muting/blocking functionality
`
  }
  // Additional problems would be defined here
};

// Convert full problems to list items
const PROBLEM_LIST: ProblemListItem[] = Object.values(MOCK_PROBLEMS).map(problem => ({
  id: problem.id,
  title: problem.title,
  difficulty: problem.difficulty,
  description: problem.description,
  category: problem.category,
  attempted: problem.attempted,
  completed: problem.completed
}));

/**
 * Get a list of all problems
 */
export async function getProblems(): Promise<ProblemListItem[]> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PROBLEM_LIST);
    }, 500);
  });
}

/**
 * Get a specific problem by ID
 */
export async function getProblem(id: string): Promise<Problem | null> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROBLEMS[id] || null);
    }, 500);
  });
}

/**
 * Save a user's solution to a problem
 */
export async function saveSolution(problemId: string, solution: string): Promise<boolean> {
  // In a real app, this would be an API call to save the solution
  console.log(`Saving solution for problem ${problemId}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mark the problem as attempted
      if (MOCK_PROBLEMS[problemId]) {
        MOCK_PROBLEMS[problemId].attempted = true;
      }
      resolve(true);
    }, 500);
  });
}

/**
 * Mark a problem as completed
 */
export async function markProblemCompleted(problemId: string): Promise<boolean> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (MOCK_PROBLEMS[problemId]) {
        MOCK_PROBLEMS[problemId].attempted = true;
        MOCK_PROBLEMS[problemId].completed = true;
      }
      resolve(true);
    }, 500);
  });
}

/**
 * Create a new problem
 */
export async function createProblem(problem: Omit<Problem, 'id'>): Promise<Problem> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a new ID - this would typically be done by the backend
      const newId = (Math.max(...Object.keys(MOCK_PROBLEMS).map(id => parseInt(id))) + 1).toString();
      
      // Create the new problem with the generated ID
      const newProblem: Problem = {
        id: newId,
        ...problem
      };
      
      // Add to our mock database
      MOCK_PROBLEMS[newId] = newProblem;
      
      // Update the problem list
      PROBLEM_LIST.push({
        id: newId,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description,
        category: problem.category,
        attempted: false,
        completed: false
      });
      
      resolve(newProblem);
    }, 500);
  });
}

/**
 * Update an existing problem
 */
export async function updateProblem(id: string, problem: Partial<Problem>): Promise<Problem | null> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!MOCK_PROBLEMS[id]) {
        resolve(null);
        return;
      }
      
      // Update the problem
      MOCK_PROBLEMS[id] = {
        ...MOCK_PROBLEMS[id],
        ...problem
      };
      
      // Update the problem list if needed
      const listIndex = PROBLEM_LIST.findIndex(p => p.id === id);
      if (listIndex !== -1) {
        PROBLEM_LIST[listIndex] = {
          ...PROBLEM_LIST[listIndex],
          title: problem.title || PROBLEM_LIST[listIndex].title,
          difficulty: problem.difficulty || PROBLEM_LIST[listIndex].difficulty,
          description: problem.description || PROBLEM_LIST[listIndex].description,
          category: problem.category || PROBLEM_LIST[listIndex].category,
        };
      }
      
      resolve(MOCK_PROBLEMS[id]);
    }, 500);
  });
}

/**
 * Delete a problem
 */
export async function deleteProblem(id: string): Promise<boolean> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!MOCK_PROBLEMS[id]) {
        resolve(false);
        return;
      }
      
      // Delete the problem
      delete MOCK_PROBLEMS[id];
      
      // Remove from the problem list
      const listIndex = PROBLEM_LIST.findIndex(p => p.id === id);
      if (listIndex !== -1) {
        PROBLEM_LIST.splice(listIndex, 1);
      }
      
      resolve(true);
    }, 500);
  });
} 