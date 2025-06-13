import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const CategorySidebar = ({ 
  categories,
  selectedCategory,
  onCategorySelect,
  taskCounts = {},
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categoryItems = [
    { id: 'all', name: 'All Tasks', icon: 'List', color: '#6366F1' },
    ...categories
  ];

  const CategoryItem = ({ category, isSelected, onClick }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full flex items-center justify-between p-3 rounded-lg
        text-left transition-all duration-200
        ${isSelected
          ? 'bg-primary text-white shadow-sm'
          : 'text-surface-700 hover:bg-surface-100'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <ApperIcon name={category.icon} className="w-4 h-4" />
        <span className="font-medium">{category.name}</span>
      </div>
      
      {taskCounts[category.id] !== undefined && (
        <Badge 
          variant={isSelected ? 'default' : 'primary'}
          size="small"
          className={
            isSelected
              ? 'bg-white/20 text-white'
              : ''
          }
        >
          {taskCounts[category.id]}
        </Badge>
      )}
    </motion.button>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-primary text-white rounded-full shadow-lg"
      >
        <ApperIcon name="Folder" className="w-5 h-5" />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -320 }}
        className={`
          fixed lg:static top-0 left-0 bottom-0 z-40
          w-80 bg-surface-50 border-r border-surface-200
          overflow-y-auto p-6 space-y-2
          ${className}
        `}
      >
        <div className="flex items-center justify-between mb-6 lg:mb-4">
          <h2 className="text-lg font-display font-semibold text-surface-900">
            Categories
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-surface-400 hover:text-surface-600"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          {categoryItems.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => {
                onCategorySelect(category.id);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      </motion.aside>
    </>
  );
};

export default CategorySidebar;