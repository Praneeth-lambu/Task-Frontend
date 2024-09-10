import React, { useState, useEffect } from 'react';
import './Tasks.css';
import { getTaskHistory } from '../../api/taskApi';

const TaskDetailsModal = ({ task, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchTaskHistory = async () => {
      try {
        // Fetch task history
        const response = await getTaskHistory(task._id);
        setHistory(response.history);
      } catch (error) {
        console.error('Error fetching task history:', error);
      }
    };

    fetchTaskHistory();
  }, [task._id]);

  const formatChangeDetails = (entry) => {
    const changes = entry.changes;
    return Object.entries(changes).map(([field, { old_value, new_value }]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      const changeDescription = old_value && new_value 
        ? `changed ${fieldName} from "${old_value}" to "${new_value}"`
        : old_value 
        ? `changed ${fieldName} from "${old_value}"`
        : `changed ${fieldName} to "${new_value}"`;
  
      return (
        <p key={field}>
          <strong>{entry.changed_by}</strong> {changeDescription} on <strong>{new Date(entry.change_time).toLocaleString()}</strong>
        </p>
      );
    });
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{task.title}</h2>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="task-details">
          <p><strong>Assigned To:</strong> {task.assigned_to}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Due Date:</strong> {task.due_date}</p>
          <p><strong>Status:</strong> {task.status === "in_progress" ? "In Progress" : task.status}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          {task.comments.length > 0 && (
                <div className="commentsSection" style={{ marginTop: '20px' }}>
                  <h5>Comments:</h5>
                  <div className="commentsList">
                    {(task.comments || []).map((comment, index) => (
                      <div key={index} className="comment">
                        <p><b>{comment.author}</b> : {comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          <h3>History:</h3>
          <ul className="change-history">
            {history.map((entry, index) => (
              <li key={index}>
                <div>
                  {formatChangeDetails(entry)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
