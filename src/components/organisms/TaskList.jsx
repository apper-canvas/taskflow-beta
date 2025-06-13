import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/organisms/EmptyState';

const TaskList = ({ 
  tasks,
  loading,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  emptyMessage = "No tasks found",
  emptyDescription = "Try adjusting your filters or create a new task",
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg border border-surface-200 p-4"
          >
            <div className="animate-pulse space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-surface-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-surface-200 rounded-full w-16"></div>
                    <div className="h-6 bg-surface-200 rounded-full w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
        icon="CheckSquare"
        className={className}
      />
    );
  }

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      layout
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.2, 
              delay: index * 0.05,
              ease: 'easeOut' 
            }}
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;