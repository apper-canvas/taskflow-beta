import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Checkbox from '@/components/atoms/Checkbox';

const TaskCard = ({ 
  task, 
  onToggleComplete,
  onEdit,
  onDelete,
  className = '' 
}) => {
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    if (isToday(dueDate)) return 'Today';
    if (isTomorrow(dueDate)) return 'Tomorrow';
    return format(dueDate, 'MMM d');
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-surface-500';
    if (isPast(dueDate) && !isToday(dueDate)) return 'text-error';
    if (isToday(dueDate)) return 'text-warning';
    return 'text-surface-500';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertCircle';
      case 'medium': return 'Circle';
      case 'low': return 'Minus';
      default: return 'Circle';
    }
  };

  const categoryColors = {
    work: '#6366F1',
    personal: '#10B981',
    shopping: '#F59E0B',
    health: '#EF4444',
    learning: '#8B5CF6'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        bg-white rounded-lg shadow-sm border border-surface-200
        p-4 hover:shadow-md transition-all duration-200
        ${task.completed ? 'opacity-75' : ''}
        ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className={`
              font-medium text-surface-900 break-words
              ${task.completed ? 'line-through text-surface-500' : ''}
            `}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-1 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="p-1 text-surface-400 hover:text-primary transition-colors"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-1 text-surface-400 hover:text-error transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          {task.description && (
            <p className={`
              text-sm text-surface-600 break-words
              ${task.completed ? 'line-through' : ''}
            `}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant={task.priority} size="small">
                <ApperIcon 
                  name={getPriorityIcon(task.priority)} 
                  className="w-3 h-3 mr-1" 
                />
                {task.priority}
              </Badge>
              
              <div 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${categoryColors[task.category] || '#6366F1'}20`,
                  color: categoryColors[task.category] || '#6366F1'
                }}
              >
                {task.category}
              </div>
            </div>
            
            {task.dueDate && (
              <div className={`
                flex items-center space-x-1 text-xs font-medium
                ${getDueDateColor(task.dueDate)}
              `}>
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;