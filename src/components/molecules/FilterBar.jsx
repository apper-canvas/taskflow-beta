import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const FilterBar = ({ 
  selectedFilter,
  onFilterChange,
  taskCounts = {},
  className = ''
}) => {
  const filters = [
    { id: 'all', label: 'All Tasks', icon: 'List' },
    { id: 'pending', label: 'Pending', icon: 'Clock' },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { id: 'high', label: 'High Priority', icon: 'AlertCircle' },
    { id: 'today', label: 'Due Today', icon: 'Calendar' }
  ];

  return (
    <div className={`flex items-center space-x-2 overflow-x-auto scrollbar-hide ${className}`}>
      {filters.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg
            text-sm font-medium whitespace-nowrap
            transition-all duration-200
            ${selectedFilter === filter.id
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }
          `}
        >
          <ApperIcon name={filter.icon} className="w-4 h-4" />
          <span>{filter.label}</span>
          {taskCounts[filter.id] !== undefined && (
            <Badge 
              variant={selectedFilter === filter.id ? 'default' : 'primary'}
              size="small"
              className={
                selectedFilter === filter.id
                  ? 'bg-white/20 text-white'
                  : ''
              }
            >
              {taskCounts[filter.id]}
            </Badge>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterBar;