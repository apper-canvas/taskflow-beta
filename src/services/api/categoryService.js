import categoryData from '../mockData/categories.json';

const STORAGE_KEY = 'taskflow_categories';

// Utility function to add delay for realistic UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load categories from localStorage or use mock data
const loadCategories = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...categoryData];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [...categoryData];
  }
};

// Save categories to localStorage
const saveCategories = (categories) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};

let categories = loadCategories();

const categoryService = {
  async getAll() {
    await delay(200);
    return [...categories];
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.id === id);
    return category ? { ...category } : null;
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      color: categoryData.color || '#6366F1',
      icon: categoryData.icon || 'Folder'
    };
    
    categories.push(newCategory);
    saveCategories(categories);
    return { ...newCategory };
  },

  async update(id, updateData) {
    await delay(300);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories[index] = { ...categories[index], ...updateData };
    saveCategories(categories);
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const deletedCategory = categories[index];
    categories.splice(index, 1);
    saveCategories(categories);
    return { ...deletedCategory };
  }
};

export default categoryService;