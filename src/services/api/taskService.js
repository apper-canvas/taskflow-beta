import taskData from '../mockData/tasks.json';

const STORAGE_KEY = 'taskflow_tasks';

// Utility function to add delay for realistic UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load tasks from localStorage or use mock data
const loadTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        completedAt: task.completedAt ? new Date(task.completedAt) : null
      }));
    }
    return taskData.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      completedAt: task.completedAt ? new Date(task.completedAt) : null
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [...taskData];
  }
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

let tasks = loadTasks();

const taskService = {
  async getAll() {
    await delay(200);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      category: taskData.category || 'general',
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      completed: false,
      createdAt: new Date(),
      completedAt: null
    };
    
    tasks.unshift(newTask);
    saveTasks(tasks);
    return { ...newTask };
  },

  async update(id, updateData) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updateData,
      dueDate: updateData.dueDate ? new Date(updateData.dueDate) : tasks[index].dueDate
    };
    
    // Handle completion status change
    if (updateData.completed !== undefined) {
      updatedTask.completedAt = updateData.completed ? new Date() : null;
    }
    
    tasks[index] = updatedTask;
    saveTasks(tasks);
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    saveTasks(tasks);
    return { ...deletedTask };
  },

  async toggleComplete(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    return this.update(id, { completed: !task.completed });
  },

  async getByCategory(category) {
    await delay(200);
    return tasks.filter(t => t.category === category).map(t => ({ ...t }));
  },

  async getByStatus(completed) {
    await delay(200);
    return tasks.filter(t => t.completed === completed).map(t => ({ ...t }));
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.category.toLowerCase().includes(searchTerm)
    ).map(t => ({ ...t }));
  }
};

export default taskService;