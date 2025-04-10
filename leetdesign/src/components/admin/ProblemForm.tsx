import { useState } from 'react';
import { Hint } from '@/models/Problem';
import DynamicInputList from '@/components/admin/DynamicInputList';
import DynamicHintsList from '@/components/admin/DynamicHintsList';

interface ProblemFormProps {
  initialValues: {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    description: string;
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    hints: Hint[];
    referenceSolution: string;
  };
  onSubmit: (formData: {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    description: string;
    functional_requirements: string[];
    non_functional_requirements: string[];
    hints: Hint[];
    reference_solution: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  submittingButtonText: string;
}

export default function ProblemForm({ 
  initialValues, 
  onSubmit, 
  isSubmitting,
  submitButtonText,
  submittingButtonText
}: ProblemFormProps) {
  // Form state
  const [title, setTitle] = useState(initialValues.title);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(initialValues.difficulty);
  const [category, setCategory] = useState(initialValues.category);
  const [description, setDescription] = useState(initialValues.description);
  const [functionalRequirements, setFunctionalRequirements] = useState<string[]>(initialValues.functionalRequirements);
  const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState<string[]>(initialValues.nonFunctionalRequirements);
  const [hints, setHints] = useState<Hint[]>(initialValues.hints);
  const [referenceSolution, setReferenceSolution] = useState(initialValues.referenceSolution);
  
  // Form state
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !category || !description || !referenceSolution) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (functionalRequirements.length < 1 || nonFunctionalRequirements.length < 1) {
      setError('Please add at least one requirement for each requirement type.');
      return;
    }
    
    if (hints.some(hint => !hint.title || !hint.content)) {
      setError('Please fill in all hint titles and content.');
      return;
    }
    
    setError('');
    
    // Create problem data object
    const problemData = {
      title,
      difficulty,
      category,
      description,
      functional_requirements: functionalRequirements,
      non_functional_requirements: nonFunctionalRequirements,
      hints,
      reference_solution: referenceSolution
    };
    
    // Pass data to parent component
    await onSubmit(problemData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Design a URL Shortener"
            required
          />
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Web Services, Databases, System Design"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty <span className="text-red-500">*</span>
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Provide a short description of the problem..."
          required
        ></textarea>
      </div>
      
      {/* Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DynamicInputList
          label="Functional Requirements"
          items={functionalRequirements}
          onChange={setFunctionalRequirements}
          placeholder="Enter a functional requirement..."
        />
        
        <DynamicInputList
          label="Non-Functional Requirements"
          items={nonFunctionalRequirements}
          onChange={setNonFunctionalRequirements}
          placeholder="Enter a non-functional requirement..."
        />
      </div>
      
      {/* Hints */}
      <div className="mb-6">
        <DynamicHintsList
          hints={hints}
          onChange={setHints}
        />
      </div>
      
      {/* Reference Solution */}
      <div className="mb-6">
        <label htmlFor="referenceSolution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Reference Solution <span className="text-red-500">*</span>
        </label>
        <textarea
          id="referenceSolution"
          value={referenceSolution}
          onChange={(e) => setReferenceSolution(e.target.value)}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          placeholder="# Reference Solution

## 1. System Requirements
..."
          required
        ></textarea>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Markdown formatting is supported.
        </p>
      </div>
      
      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? submittingButtonText : submitButtonText}
        </button>
      </div>
    </form>
  );
} 