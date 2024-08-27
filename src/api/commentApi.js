// src/api/commentApi.js
const API_URL = 'http://127.0.0.1:5000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    } : {};
};

// Fetch comments for a specific task
export const fetchCommentsFromApi = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/getComments/${taskId}`, { headers: getAuthHeaders() });
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage || 'Failed to fetch comments');
      }
      const data = await response.json();
      return data; // Ensure this returns the data
    } catch (error) {
      console.error("Fetch Comments Error:", error.message);
      throw error; // Rethrow the error to be caught by the thunk
    }
  };
  

export const handleAddCommentAPI = async (taskId, comment) => {
    try {
        const response = await fetch(`${API_URL}/tasks/addComment/${taskId}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(comment),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Failed to add comment');
        }

        return response.json(); // Ensure this is a plain object
    } catch (error) {
        console.error('Error in handleAddCommentAPI:', error);
        throw error;
    }
};

