import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  onSearch,
  placeholder = "Search tasks...",
  className = ''
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-10 py-2
            border border-surface-300 rounded-lg
            bg-white text-surface-900
            placeholder-surface-400
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-200
          "
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute right-3 top-1/2 transform -translate-y-1/2
              text-surface-400 hover:text-surface-600
              transition-colors duration-200
            "
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;