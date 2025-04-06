export interface Hint {
  id: string;
  title: string;
  content: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  requirements: string[];
  hints: Hint[];
  category: string;
  attempted: boolean;
  completed: boolean;
  reference_solution: string;
}

export interface ProblemListItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  category: string;
  attempted: boolean;
  completed: boolean;
} 