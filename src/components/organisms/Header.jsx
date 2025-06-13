import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ onSearch, onQuickAdd }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        flex-shrink-0 h-16 bg-white/95 backdrop-blur-sm
        border-b border-surface-200 px-4 md:px-6
        flex items-center justify-between
        sticky top-0 z-40
      "
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold text-surface-900">
            TaskFlow
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Desktop Search */}
        <div className="hidden md:block">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search tasks..."
            className="w-64"
          />
        </div>

        {/* Mobile Search Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden p-2 text-surface-500 hover:text-surface-700 transition-colors"
        >
          <ApperIcon name="Search" className="w-5 h-5" />
        </motion.button>

        <Button
          onClick={onQuickAdd}
          icon="Plus"
          size="small"
          className="hidden sm:flex"
        >
          Add Task
        </Button>

        <Button
          onClick={onQuickAdd}
          icon="Plus"
          size="small"
          className="sm:hidden p-2"
        />
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 p-4 bg-white border-b border-surface-200 md:hidden"
        >
          <SearchBar
            onSearch={(query) => {
              onSearch(query);
              setShowSearch(false);
            }}
            placeholder="Search tasks..."
          />
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;