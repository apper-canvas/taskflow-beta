import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = "No items found",
  description = "Get started by creating your first item",
  icon = "Package",
  actionLabel = "Create Item",
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-surface-400" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {onAction && actionLabel && (
        <Button
          onClick={onAction}
          icon="Plus"
          className="mx-auto"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;