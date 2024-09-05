import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, updateTask, deleteTask } from '../../api/taskApi';
import { addComment, fetchComments } from '../../redux/commentsSlice';
import TaskForm from './TaskForm'; // Import the TaskForm component
import './Tasks.css'; // Import specific styles
import '../commonStyles.css'; // Import common styles
import { fetchUsers } from '../../api/userApi';

const Tasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const status = useSelector(state => state.tasks.status);
  const error = useSelector(state => state.tasks.error);
  const user = useSelector(state => state.auth.user);
  const comments = useSelector(state => state.comments.comments);
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
  const users = useSelector(state => state.users.users);
  useEffect(() => {
    dispatch(fetchTasks(''));
    if(user.role === 'admin')
    dispatch(fetchUsers(''));
  }, [dispatch]);
console.log(users)
  useEffect(() => {
    if (editTask) {
      dispatch(fetchComments(editTask._id));
    }
  }, [dispatch, editTask]);

  const handleFetchTasks = () => {
    dispatch(fetchTasks(taskId));
  };

  const handleAdd = async () => {
    try {
      const taskData = {
        ...newTask,
        assigned_to: user.role === 'admin' ? newTask.assigned_to : user.name,
      };
      await dispatch(addTask(taskData)).unwrap();
      clearForm();
      dispatch(fetchTasks(''));
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleUpdate = async () => {
    if (editTask) {
      try {
        await dispatch(updateTask(editTask)).unwrap();
        clearForm();
        dispatch(fetchTasks(''));
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      dispatch(fetchTasks(''));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleChangeTask = (e) => {
    const { name, value } = e.target;
    if (formMode === 'add') {
      setNewTask({
        ...newTask,
        [name]: value
      });
    } else if (editTask) {
      setEditTask({
        ...editTask,
        [name]: value
      });
    }
  };

  const handleStatusChange = (e) => {
    handleChangeTask(e);
  };

  const handlePriorityChange = (e) => {
    handleChangeTask(e);
  };

  const getErrorMessage = () => {
    if (error) {
      if (error.status === 404) {
        return 'User not found. Please check the User ID.';
      }
      if (error.status === 400) {
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
    if (filter !== '') {
      setFilter('');
      dispatch(fetchTasks(''));
    }
  };

  const filteredTasks = tasks.filter(task => filter === '' || task.status === filter);

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
  if (status === 'failed' && error.status !== 404 && error.status !==400) return <div>{getErrorMessage()}</div>;

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
          &times;
        </button>
        <button
          type="button"
          className="button button-add"
          onClick={() => setFormMode('add')}
        >
          Add Task
        </button>
      </div>

      {formMode && (
        <TaskForm
          task={formMode === 'add' ? newTask : editTask}
          onChange={handleChangeTask}
          onSubmit={formMode === 'add' ? handleAdd : handleUpdate}
          onCancel={clearForm}
          user={user}
          mode={formMode}
        />
      )}

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
