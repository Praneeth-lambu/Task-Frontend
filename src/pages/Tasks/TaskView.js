import React, { useState } from 'react';
import TaskDetailsModal from './TaskDetailsModal'; // Import the TaskDetailsModal component
import './Tasks.css'; // Import specific styles for TaskView

const TaskView = ({ tasks, onEditClick, onDeleteClick, viewMode, onToggleView, filter, onFilter, onClearFilter, onAddComment }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState('');

  const filteredTasks = tasks.filter(task => filter === '' || task.status === filter);

  const handleShowDetails = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleAddComment = (taskId) => {
    if (newComment.trim()) {
      onAddComment(taskId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="task-view-container" style={{ width: '100%' }}>
      <div className="view-toggle" style={{ marginTop: "10px" }}>
        <button onClick={onToggleView}>
          {viewMode === 'list' ? 'Card' : 'List'} View
        </button>
      </div>

      {filteredTasks.length > 0 && viewMode === 'list' ? (
        <div className="tableContainer">
          <table className="taskTable">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assigned to</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((item) => (
                <tr key={item._id} className='table-row'>
                  <td>{item.title}</td>
                  <td>{item.assigned_to}</td>
                  <td>{item.due_date}</td>
                  <td style={{ textTransform: "capitalize" }}>{item.status === "in_progress" ? "In Progress" : item.status}</td>
                  <td>{item.priority}</td>
                  <td>
                    <div className="button-group-table">
                      <button onClick={() => onEditClick(item)} className="button button-update">
                        Edit
                      </button>
                      <button onClick={() => onDeleteClick(item._id)} className="button button-delete">
                        Delete
                      </button>
                      <button onClick={() => handleShowDetails(item)} className="button button-details">
                        Show Details
                      </button>
                    </div>
                    {item._id === item.editing && (
                      <div className="commentsaddSection" style={{ marginTop: '20px' }}>
                        <div className="inputGroup">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="commentInput"
                            placeholder="Add a comment"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(item._id)}
                            className="button button-add-comment"
                          >
                            Add Comment
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="gridContainer">
          {filteredTasks.map((item) => (
            <div key={item._id} className="card">
              <h2>Title: {item.title}</h2>
              <p>Assigned To: {item.assigned_to}</p>
              <p>Description: {item.description}</p>
              <p>Due Date: {item.due_date}</p>
              <p>Status: {item.status === "in_progress" ? "In Progress" : item.status}</p>
              <p>Priority: {item.priority}</p>
              {item.comments.length > 0 && (
                <div className="commentsSection" style={{ marginTop: '20px' }}>
                  <h5>Comments:</h5>
                  <div className="commentsList">
                    {(item.comments || []).map((comment, index) => (
                      <div key={index} className="comment">
                        <p><b>{comment.author}</b> : {comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="button-group" style={{ marginTop: '10px' }}>
                <button onClick={() => onEditClick(item)} className="button button-edit">
                  Edit
                </button>
                <button onClick={() => onDeleteClick(item._id)} className="button button-delete">
                  Delete
                </button>
              </div>
              {item._id === item.editing && (
                <div className="commentsaddSection" style={{ marginTop: '20px' }}>
                  <div className="inputGroup">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="commentInput"
                      placeholder="Add a comment"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(item._id)}
                      className="button button-add-comment"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default TaskView;
