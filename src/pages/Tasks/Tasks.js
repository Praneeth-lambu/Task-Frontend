import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, updateTask, deleteTask } from '../../api/taskApi';
import { addComment, fetchComments } from '../../redux/commentsSlice';
import './Tasks.css'; // Import specific styles
import '../commonStyles.css'; // Import common styles

const Tasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const status = useSelector(state => state.tasks.status);
  const error = useSelector(state => state.tasks.error);
  const user = useSelector(state => state.auth.user);
  const comments = useSelector(state => state.comments.comments); // Fetch comments from the state
  const [taskId, setTaskId] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    assigned_to: '',
    description: '',
    due_date: '',
    status: 'pending',
    priority: 'Medium'
  });
  const [editTask, setEditTask] = useState(null);
  const [formMode, setFormMode] = useState('');
  const [filter, setFilter] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    dispatch(fetchTasks(''));
  }, [dispatch]);

  useEffect(() => {
    if (editTask) {
      dispatch(fetchComments(editTask._id)); // Fetch comments for the task being edited
    }
  }, [dispatch, editTask]);

  const handleFetchTasks = () => {
    dispatch(fetchTasks(taskId));
  };

  const handleAdd = async () => {
    try {
      const taskData = {
        ...newTask,
        assigned_to: user.role === 'admin' ? newTask.assigned_to : user.name, // Set assigned_to based on role
      };
      await dispatch(addTask(taskData)).unwrap();
      setNewTask({
        title: '',
        assigned_to: '',
        description: '',
        due_date: '',
        status: 'pending',
        priority: 'Medium'
      });
      dispatch(fetchTasks(''));
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleUpdate = async () => {
    if (editTask) {
      try {
        await dispatch(updateTask(editTask)).unwrap();
        setEditTask(null); // Clear edit form
        setFormMode('add'); // Reset form mode to 'add'
        dispatch(fetchTasks('')); // Fetch tasks again to update the list
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      dispatch(fetchTasks('')); // Fetch tasks again to update the list
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleChangeNewTask = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeEditTask = (e) => {
    setEditTask({
      ...editTask,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = (e) => {
    if (formMode === 'add') {
      setNewTask({ ...newTask, status: e.target.value });
    } else if (editTask) {
      setEditTask({ ...editTask, status: e.target.value });
    }
  };

  const handlePriorityChange = (e) => {
    if (formMode === 'add') {
      setNewTask({ ...newTask, priority: e.target.value });
    } else if (editTask) {
      setEditTask({ ...editTask, priority: e.target.value });
    }
  };

  const getErrorMessage = () => {
    if (error) {
      if (error.status === 404) {
        return error.message;
      } else {
        return error.message || 'An error occurred. Please try again later.';
      }
    }
    return null;
  };

  const handleEditClick = (task) => {
    setEditTask({ ...task });
    setFormMode('edit');
    dispatch(fetchComments(task._id));
  };

  const clearForm = () => {
    setNewTask({
      title: '',
      assigned_to: '',
      description: '',
      due_date: '',
      status: 'pending',
      priority: 'Medium'
    });
    setEditTask(null);
    setFormMode('');
    setTaskId('');
  };

  const handleFilter = (status) => {
    setFilter(status);
    dispatch(fetchTasks(''));
  };

  const clearFilter = () => {
    setFilter('');
    dispatch(fetchTasks(''));
  };

  const filteredTasks = tasks.filter(task => {
    return filter === '' || task.status === filter;
  });

  const handleAddComment = async () => {
    if (newComment.trim() && editTask?._id) {
      try {
        await dispatch(addComment({ taskId: editTask._id, commentData: { text: newComment } })).unwrap();
        setNewComment('');
        dispatch(fetchComments(editTask._id));
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed' && error.status !== 404) return <div>{getErrorMessage()}</div>;

  return (
    <div className="container">
      <div className="inputGroup">
        <label htmlFor="taskIdInput" className="inputLabel">Enter Task Details to Search</label>
        <input
          id="taskIdInput"
          type="text"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="inputField"
        />
        <button
          type="button"
          className="button button-search"
          onClick={handleFetchTasks}
        >
          Search
        </button>
      </div>

      <div className="buttonGroup">
        <button
          type="button"
          className={`button button-filter ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilter('pending')}
        >
          Show Pending
        </button>
        <button
          type="button"
          className={`button button-filter ${filter === 'in_progress' ? 'active' : ''}`}
          onClick={() => handleFilter('in_progress')}
        >
          Show In Progress
        </button>
        <button
          type="button"
          className={`button button-filter ${filter === 'done' ? 'active' : ''}`}
          onClick={() => handleFilter('done')}
        >
          Show Completed
        </button>
        <button
          type="button"
          className="button button-clear-filter"
          onClick={clearFilter}
        >
          &times; {/* or use "Clear" text */}
        </button>
        <button
          type="button"
          className="button button-add"
          onClick={() => setFormMode('add')}
        >
          Add Task
        </button>
      </div>

      <div className="inputGroup" style={{ marginTop: '20px' }}>
        {formMode === 'add' && (
          <>
            <label htmlFor="newTaskTitle" className="inputLabel">Title</label>
            <input
              id="newTaskTitle"
              name="title"
              type="text"
              value={newTask.title}
              onChange={handleChangeNewTask}
              className="inputField"
            />
            {user.role ==="admin" && <div>
            <label htmlFor="newTaskAssignedTo" className="inputLabel">Assigned To</label>
            <input
              id="newTaskAssignedTo"
              name="assigned_to"
              type="text"
              value={newTask.assigned_to}
              onChange={handleChangeNewTask}
              className="inputField"
              />
              </div>}
            <label htmlFor="newTaskDescription" className="inputLabel">Description</label>
            <input
              id="newTaskDescription"
              name="description"
              type="text"
              value={newTask.description}
              onChange={handleChangeNewTask}
              className="inputField"
            />
            <label htmlFor="newTaskDueDate" className="inputLabel">Due Date</label>
            <input
              id="newTaskDueDate"
              name="due_date"
              type="date"
              value={newTask.due_date}
              onChange={handleChangeNewTask}
              className="inputField"
            />
            <label htmlFor="newTaskStatus" className="inputLabel">Status</label>
            <select
              id="newTaskStatus"
              name="status"
              value={newTask.status}
              onChange={handleStatusChange}
              className="inputField"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <label htmlFor="newTaskPriority" className="inputLabel">Priority</label>
            <select
              id="newTaskPriority"
              name="priority"
              value={newTask.priority}
              onChange={handlePriorityChange}
              className="inputField"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div className="buttonGroup">
              <button
                onClick={handleAdd}
                className="button button-submit"
              >
                Submit
              </button>
              <button
                onClick={clearForm}
                className="button button-clear"
              >
                Clear
              </button>
            </div>
          </>
        )}
        {formMode === 'edit' && editTask && (
          <>
            <label htmlFor="editTaskTitle" className="inputLabel">Title</label>
            <input
              id="editTaskTitle"
              name="title"
              type="text"
              value={editTask.title}
              onChange={handleChangeEditTask}
              className="inputField"
            />
            <label htmlFor="editTaskAssignedTo" className="inputLabel">Assigned To</label>
            <input
              id="editTaskAssignedTo"
              name="assigned_to"
              type="text"
              value={editTask.assigned_to}
              onChange={handleChangeEditTask}
              className="inputField"
            />
            <label htmlFor="editTaskDescription" className="inputLabel">Description</label>
            <input
              id="editTaskDescription"
              name="description"
              type="text"
              value={editTask.description}
              onChange={handleChangeEditTask}
              className="inputField"
            />
            <label htmlFor="editTaskDueDate" className="inputLabel">Due Date</label>
            <input
              id="editTaskDueDate"
              name="due_date"
              type="date"
              value={editTask.due_date}
              onChange={handleChangeEditTask}
              className="inputField"
            />
            <label htmlFor="editTaskStatus" className="inputLabel">Status</label>
            <select
              id="editTaskStatus"
              name="status"
              value={editTask.status}
              onChange={handleStatusChange}
              className="inputField"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <label htmlFor="editTaskPriority" className="inputLabel">Priority</label>
            <select
              id="editTaskPriority"
              name="priority"
              value={editTask.priority}
              onChange={handlePriorityChange}
              className="inputField"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div className="buttonGroup">
              <button
                onClick={handleUpdate}
                className="button button-submit"
              >
                Save Update
              </button>
              <button
                onClick={clearForm}
                className="button button-clear"
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>

      {status === 'idle' && filteredTasks.length > 0 && (
        <div className="gridContainer">
          {filteredTasks.map((item) => (
            <div
              key={item._id}
              className="card"
            >
              <h2>Title: {item.title}</h2>
              <p>Assigned To: {item.assigned_to}</p>
              <p>Description: {item.description}</p>
              <p>Due Date: {item.due_date}</p>
              <p>Status: {item.status === "in_progress" ? "In Progress" : item.status}</p>
              <p>Priority: {item.priority}</p>
              <div className="button-group" style={{ marginTop: '10px' }}>
                <button
                  onClick={() => handleEditClick(item)}
                  className="button button-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="button button-delete"
                >
                  Delete
                </button>
              </div>
              {formMode === 'edit' && editTask && editTask._id === item._id && (
                <div className="commentsSection" style={{ marginTop: '20px' }}>
                  <h3>Comments:</h3>
                  <div className="commentsList">
                    {(comments[item._id] || []).map((comment, index) => (
                      <div key={index} className="comment">
                        <p><b>{comment.author}</b> : {comment.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="inputGroup">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="commentInput"
                      placeholder="Add a comment"
                    />
                    <button
                      type="button"
                      onClick={handleAddComment}
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
    </div>
  );
};

export default Tasks;
