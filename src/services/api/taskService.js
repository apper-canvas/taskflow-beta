import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'priority', 'category', 'due_date', 'completed', 'created_at', 'completed_at', 'CreatedOn', 'ModifiedOn', 'Tags'],
        orderBy: [{
          FieldName: "CreatedOn",
          SortType: "DESC"
        }],
        PagingInfo: {
          Limit: 100,
          Offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        completed: task.completed || false,
        createdAt: task.created_at ? new Date(task.created_at) : (task.CreatedOn ? new Date(task.CreatedOn) : new Date()),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'priority', 'category', 'due_date', 'completed', 'created_at', 'completed_at', 'CreatedOn', 'ModifiedOn']
      };
      
      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      const task = response.data;
      if (!task) return null;
      
      return {
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        completed: task.completed || false,
        createdAt: task.created_at ? new Date(task.created_at) : (task.CreatedOn ? new Date(task.CreatedOn) : new Date()),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: taskData.title,
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          category: taskData.category || 'work',
          due_date: taskData.dueDate ? taskData.dueDate.toISOString().split('T')[0] : null,
          completed: false,
          created_at: new Date().toISOString(),
          completed_at: null
        }]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newTask = successfulRecords[0].data;
          return {
            id: newTask.Id,
            title: newTask.title || newTask.Name || '',
            description: newTask.description || '',
            priority: newTask.priority || 'medium',
            category: newTask.category || 'work',
            dueDate: newTask.due_date ? new Date(newTask.due_date) : null,
            completed: newTask.completed || false,
            createdAt: newTask.created_at ? new Date(newTask.created_at) : new Date(),
            completedAt: newTask.completed_at ? new Date(newTask.completed_at) : null
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields for update operation
      const updateFields = {
        Id: parseInt(id)
      };
      
      if (updateData.title !== undefined) {
        updateFields.Name = updateData.title;
        updateFields.title = updateData.title;
      }
      if (updateData.description !== undefined) {
        updateFields.description = updateData.description;
      }
      if (updateData.priority !== undefined) {
        updateFields.priority = updateData.priority;
      }
      if (updateData.category !== undefined) {
        updateFields.category = updateData.category;
      }
      if (updateData.dueDate !== undefined) {
        updateFields.due_date = updateData.dueDate ? updateData.dueDate.toISOString().split('T')[0] : null;
      }
      if (updateData.completed !== undefined) {
        updateFields.completed = updateData.completed;
        updateFields.completed_at = updateData.completed ? new Date().toISOString() : null;
      }
      
      const params = {
        records: [updateFields]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            id: updatedTask.Id,
            title: updatedTask.title || updatedTask.Name || '',
            description: updatedTask.description || '',
            priority: updatedTask.priority || 'medium',
            category: updatedTask.category || 'work',
            dueDate: updatedTask.due_date ? new Date(updatedTask.due_date) : null,
            completed: updatedTask.completed || false,
            createdAt: updatedTask.created_at ? new Date(updatedTask.created_at) : new Date(),
            completedAt: updatedTask.completed_at ? new Date(updatedTask.completed_at) : null
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      // Get current task to toggle its completion status
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error('Task not found');
      }
      
      return await this.update(id, { completed: !currentTask.completed });
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'priority', 'category', 'due_date', 'completed', 'created_at', 'completed_at', 'CreatedOn'],
        where: [{
          FieldName: "category",
          Operator: "ExactMatch",
          Values: [category]
        }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        completed: task.completed || false,
        createdAt: task.created_at ? new Date(task.created_at) : new Date(),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      return [];
    }
  },

  async getByStatus(completed) {
    try {
      const apperClient = getApperClient();
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'priority', 'category', 'due_date', 'completed', 'created_at', 'completed_at', 'CreatedOn'],
        where: [{
          FieldName: "completed",
          Operator: "ExactMatch",
          Values: [completed]
        }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        completed: task.completed || false,
        createdAt: task.created_at ? new Date(task.created_at) : new Date(),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'priority', 'category', 'due_date', 'completed', 'created_at', 'completed_at', 'CreatedOn'],
        whereGroups: [{
          operator: "OR",
          SubGroups: [
            {
              conditions: [{
                FieldName: "title",
                Operator: "Contains",
                Values: [query]
              }],
              operator: ""
            },
            {
              conditions: [{
                FieldName: "description",
                Operator: "Contains",
                Values: [query]
              }],
              operator: ""
            },
            {
              conditions: [{
                FieldName: "Name",
                Operator: "Contains",
                Values: [query]
              }],
              operator: ""
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        completed: task.completed || false,
        createdAt: task.created_at ? new Date(task.created_at) : new Date(),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      return [];
    }
  }
};

export default taskService;