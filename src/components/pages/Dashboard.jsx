import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isToday, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import Header from '@/components/organisms/Header';
import TaskList from '@/components/organisms/TaskList';
import TaskForm from '@/components/molecules/TaskForm';
import FilterBar from '@/components/molecules/FilterBar';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import EmptyState from '@/components/organisms/EmptyState';

const Dashboard = () => {
  // Data state
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formLoading, setFormLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Apply status/priority filters
    switch (selectedFilter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'high':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      case 'today':
        filtered = filtered.filter(task => 
          task.dueDate && isToday(new Date(task.dueDate))
        );
        break;
      default:
        break;
    }

    // Sort tasks: incomplete first, then by due date, then by priority
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tasks, searchQuery, selectedFilter, selectedCategory]);

  // Calculate task counts for filters and categories
  const taskCounts = useMemo(() => {
    const counts = {
      all: tasks.length,
      pending: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      high: tasks.filter(t => t.priority === 'high').length,
      today: tasks.filter(t => t.dueDate && isToday(new Date(t.dueDate))).length
    };

    // Add category counts
    categories.forEach(category => {
      counts[category.id] = tasks.filter(t => t.category === category.id).length;
    });

    return counts;
  }, [tasks, categories]);

  // Task operations
  const handleCreateTask = async (taskData) => {
    setFormLoading(true);
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowTaskForm(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    setFormLoading(true);
    try {
      const updatedTask = await taskService.update(editingTask.id, taskData);
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      setEditingTask(null);
      setShowTaskForm(false);
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      if (updatedTask.completed) {
        toast.success('🎉 Task completed!', {
          position: 'top-center',
          autoClose: 2000
        });
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const handleFormCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleQuickAdd = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  if (error && tasks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          title="Something went wrong"
          description={error}
          icon="AlertCircle"
          actionLabel="Retry"
          onAction={loadData}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-white">
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        taskCounts={taskCounts}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSearch={setSearchQuery}
          onQuickAdd={handleQuickAdd}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Task Form */}
          <AnimatePresence>
            {showTaskForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TaskForm
                  task={editingTask}
                  categories={categories}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                  loading={formLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Bar */}
          <FilterBar
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            taskCounts={taskCounts}
          />

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            emptyMessage={
              searchQuery ? "No tasks match your search" :
              selectedFilter === 'completed' ? "No completed tasks" :
              selectedFilter === 'pending' ? "No pending tasks" :
              selectedFilter === 'high' ? "No high priority tasks" :
              selectedFilter === 'today' ? "No tasks due today" :
              selectedCategory !== 'all' ? `No tasks in ${categories.find(c => c.id === selectedCategory)?.name || 'this category'}` :
              "No tasks yet"
            }
            emptyDescription={
              searchQuery ? "Try adjusting your search terms" :
              "Create your first task to get started with TaskFlow"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;