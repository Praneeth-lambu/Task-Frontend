import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, updateTask, deleteTask } from '../../api/taskApi';
import './Tasks.css'; // Import specific styles
import '../commonStyles.css'; // Import common styles

const Tasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const status = useSelector(state => state.tasks.status);
  const error = useSelector(state => state.tasks.error);
  const [taskId, setTaskId] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    assigned_to: '',
    description: '',
    due_date: '',
    status: 'pending'
  });
  const [editTask, setEditTask] = useState(null); // State for the task being edited
  const [formMode, setFormMode] = useState(''); // 'add' or 'edit'

  useEffect(() => {
    // Fetch tasks when the component mounts
    dispatch(fetchTasks(''));
  }, [dispatch]);

  const handleFetchTasks = () => {
    dispatch(fetchTasks(taskId));
  };

  const handleTaskIdChange = (e) => {
    setTaskId(e.target.value);
  };

  const handleAdd = async () => {
    try {
      await dispatch(addTask(newTask)).unwrap();
      setNewTask({ title: '', assigned_to: '', description: '', due_date: '', status: 'pending' }); // Clear form
      dispatch(fetchTasks('')); // Fetch tasks again to update the list
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
    setEditTask({ ...task }); // Populate edit form with task data
    setFormMode('edit'); // Switch to edit mode
  };

  const clearForm = () => {
    setNewTask({ title: '', assigned_to: '', description: '', due_date: '', status: 'pending' });
    setEditTask(null);
    setFormMode('');
    setTaskId('');
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed' && error.status !== 404) return <div>{getErrorMessage()}</div>;

  return (
    <div className="container">
      <div className="inputGroup">
        <label htmlFor="taskIdInput" className="inputLabel">Enter Task Id to search</label>
        <input
          id="taskIdInput"
          type="text"
          value={taskId}
          onChange={handleTaskIdChange}
          className="inputField"
        />
      </div>
      <div className="buttonGroup">
        <button type="button" className="button button-add" onClick={handleFetchTasks}>
          Search Task
        </button>
        <button type="button" className="button button-add" onClick={() => setFormMode('add')}>
          Add Task
        </button>
      </div>

      {/* Always show the form for adding or editing tasks */}
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
            <label htmlFor="newTaskAssignedTo" className="inputLabel">Assigned To</label>
            <input
              id="newTaskAssignedTo"
              name="assigned_to"
              type="text"
              value={newTask.assigned_to}
              onChange={handleChangeNewTask}
              className="inputField"
            />
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
            <div className="buttonGroup">
              <button
                onClick={handleAdd}
                className="button button-add"
              >
                Add Task
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
            <div className="buttonGroup">
              <button
                onClick={handleUpdate}
                className="button button-update"
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
      {status === 'idle' && tasks.length > 0 && (
        <div className="gridContainer">
          {tasks.map((item) => (
            <div
              key={item._id}
              className="card"
            >
              <h2>Title: {item.title}</h2>
              <p>Assigned To: {item.assigned_to}</p>
              <p>Description: {item.description}</p>
              <p>Due Date: {item.due_date}</p>
              <p>Status: {item.status === "in_progress" ? "In Progress" : item.status}</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
