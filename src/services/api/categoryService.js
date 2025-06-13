import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        Fields: ['Id', 'Name', 'color', 'icon', 'CreatedOn', 'ModifiedOn', 'Tags'],
        orderBy: [{
          FieldName: "Name",
          SortType: "ASC"
        }],
        PagingInfo: {
          Limit: 100,
          Offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(category => ({
        id: category.Id,
        name: category.Name || '',
        color: category.color || '#6366F1',
        icon: category.icon || 'Folder'
      })) || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: ['Id', 'Name', 'color', 'icon', 'CreatedOn', 'ModifiedOn']
      };
      
      const response = await apperClient.getRecordById('category', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      const category = response.data;
      if (!category) return null;
      
      return {
        id: category.Id,
        name: category.Name || '',
        color: category.color || '#6366F1',
        icon: category.icon || 'Folder'
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: categoryData.name,
          color: categoryData.color || '#6366F1',
          icon: categoryData.icon || 'Folder'
        }]
      };
      
      const response = await apperClient.createRecord('category', params);
      
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
          const newCategory = successfulRecords[0].data;
          return {
            id: newCategory.Id,
            name: newCategory.Name || '',
            color: newCategory.color || '#6366F1',
            icon: newCategory.icon || 'Folder'
          };
        }
      }
      
      throw new Error('Failed to create category');
    } catch (error) {
      console.error("Error creating category:", error);
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
      
      if (updateData.name !== undefined) {
        updateFields.Name = updateData.name;
      }
      if (updateData.color !== undefined) {
        updateFields.color = updateData.color;
      }
      if (updateData.icon !== undefined) {
        updateFields.icon = updateData.icon;
      }
      
      const params = {
        records: [updateFields]
      };
      
      const response = await apperClient.updateRecord('category', params);
      
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
          const updatedCategory = successfulUpdates[0].data;
          return {
            id: updatedCategory.Id,
            name: updatedCategory.Name || '',
            color: updatedCategory.color || '#6366F1',
            icon: updatedCategory.icon || 'Folder'
          };
        }
      }
      
      throw new Error('Failed to update category');
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('category', params);
      
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
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

export default categoryService;