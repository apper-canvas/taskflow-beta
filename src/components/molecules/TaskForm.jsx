import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const TaskForm = ({ 
  task = null,
  categories = [],
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    };

    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-lg border border-surface-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold text-surface-900">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button
          onClick={onCancel}
          className="text-surface-400 hover:text-surface-600 transition-colors"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter task title..."
          error={errors.title}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-surface-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add a description..."
            rows={3}
            className="
              w-full px-3 py-2
              border border-surface-300 rounded-md
              bg-white text-surface-900
              placeholder-surface-400
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200
              resize-none
            "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-surface-700">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="
                w-full px-3 py-2
                border border-surface-300 rounded-md
                bg-white text-surface-900
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-all duration-200
              "
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-surface-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="
                w-full px-3 py-2
                border border-surface-300 rounded-md
                bg-white text-surface-900
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-all duration-200
              "
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />

        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={task ? "Save" : "Plus"}
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;