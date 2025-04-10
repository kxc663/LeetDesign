import { Hint } from '@/models/Problem';

interface DynamicHintsListProps {
  hints: Hint[];
  onChange: (hints: Hint[]) => void;
  className?: string;
}

export default function DynamicHintsList({
  hints,
  onChange,
  className = ''
}: DynamicHintsListProps) {
  const handleAddHint = () => {
    const newId = `h${hints.length + 1}`;
    onChange([...hints, { id: newId, title: '', content: '' }]);
  };

  const handleRemoveHint = (index: number) => {
    const newHints = [...hints];
    newHints.splice(index, 1);
    onChange(newHints);
  };

  const handleHintChange = (index: number, field: 'title' | 'content', value: string) => {
    const newHints = [...hints];
    newHints[index] = { ...newHints[index], [field]: value };
    onChange(newHints);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Hints
      </label>
      
      <div className="space-y-4">
        {hints.map((hint, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Hint {index + 1}</h4>
              <button
                type="button"
                onClick={() => handleRemoveHint(index)}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={hint.title}
                  onChange={(e) => handleHintChange(index, 'title', e.target.value)}
                  placeholder="Hint title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Content</label>
                <textarea
                  value={hint.content}
                  onChange={(e) => handleHintChange(index, 'content', e.target.value)}
                  placeholder="Hint content"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddHint}
          className="flex items-center px-4 py-2 text-sm border border-indigo-300 text-indigo-600 rounded-md hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Hint
        </button>
      </div>
    </div>
  );
} 