import React, { useState, useEffect } from 'react';
import './TaskForm.css';  // Import your CSS file
import { useSelector } from 'react-redux';

const TaskForm = ({ task, onChange, onSubmit, onCancel, user, mode }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const users = useSelector(state => state.users.users);

  // Validate fields
  const validate = () => {
    const newErrors = {};
    if (!task.title.trim()) newErrors.title = 'Title is required';
    if (user.role === 'admin' && !task.assigned_to.trim()) newErrors.assigned_to = 'Assigned To is required';
    if (!task.description.trim()) newErrors.description = 'Description is required';
    if (!task.due_date) newErrors.due_date = 'Due Date is required';
    if (!task.status) newErrors.status = 'Status is required';
    if (!task.priority) newErrors.priority = 'Priority is required';
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    } else {
      setErrors(newErrors);
      setTouched(true);
    }
  };

  // Reset errors when the task or mode changes
  useEffect(() => {
    setErrors({});
    setTouched(false);
  }, [task, mode]);

  return (
    <form className="inputGroup" onSubmit={handleSubmit}>
      <label htmlFor={`${mode}TaskTitle`} className="inputLabel">Title</label>
      <input
        id={`${mode}TaskTitle`}
        name="title"
        type="text"
        value={task.title}
        onChange={onChange}
        className={`inputField ${touched && errors.title ? 'inputError' : ''}`}
      />
      {touched && errors.title && (
        <div className="errorContainer">
          <div className="errorMessage">{errors.title}</div>
        </div>
      )}

      {user.role === "admin" && (
        <>
          <label htmlFor={`${mode}TaskAssignedTo`} className="inputLabel">Assigned To</label>
          <select
            id={`${mode}TaskAssignedTo`}
            name="assigned_to"
            value={task.assigned_to || ''} // Use empty string if value is undefined
            onChange={onChange}
            className={`inputField ${touched && errors.assigned_to ? 'inputError' : ''}`}
          >
            <option value="">Select User</option> {/* Default option */}
            {users.map(option => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
          {touched && errors.assigned_to && (
            <div className="errorContainer">
              <div className="errorMessage">{errors.assigned_to}</div>
            </div>
          )}
        </>
      )}

      <label htmlFor={`${mode}TaskDescription`} className="inputLabel">Description</label>
      <input
        id={`${mode}TaskDescription`}
        name="description"
        type="text"
        value={task.description}
        onChange={onChange}
        className={`inputField ${touched && errors.description ? 'inputError' : ''}`}
      />
      {touched && errors.description && (
        <div className="errorContainer">
          <div className="errorMessage">{errors.description}</div>
        </div>
      )}

      <label htmlFor={`${mode}TaskDueDate`} className="inputLabel">Due Date</label>
      <input
        id={`${mode}TaskDueDate`}
        name="due_date"
        type="date"
        value={task.due_date}
        onChange={onChange}
        className={`inputField ${touched && errors.due_date ? 'inputError' : ''}`}
      />
      {touched && errors.due_date && (
        <div className="errorContainer">
          <div className="errorMessage">{errors.due_date}</div>
        </div>
      )}

      <label htmlFor={`${mode}TaskStatus`} className="inputLabel">Status</label>
      <select
        id={`${mode}TaskStatus`}
        name="status"
        value={task.status || ''} // Use empty string if value is undefined
        onChange={onChange}
        className={`inputField ${touched && errors.status ? 'inputError' : ''}`}
      >
        <option value="">Select Status</option> {/* Default option */}
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      {touched && errors.status && (
        <div className="errorContainer">
          <div className="errorMessage">{errors.status}</div>
        </div>
      )}

      <label htmlFor={`${mode}TaskPriority`} className="inputLabel">Priority</label>
      <select
        id={`${mode}TaskPriority`}
        name="priority"
        value={task.priority || ''} // Use empty string if value is undefined
        onChange={onChange}
        className={`inputField ${touched && errors.priority ? 'inputError' : ''}`}
      >
        <option value="">Select Priority</option> {/* Default option */}
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      {touched && errors.priority && (
        <div className="errorContainer">
          <div className="errorMessage">{errors.priority}</div>
        </div>
      )}

      <div className="buttonGroup">
        <button
          type="submit"
          className="button button-submit"
          disabled={Object.keys(errors).length > 0} // Disable submit button if there are validation errors
        >
          {mode === 'add' ? 'Submit' : 'Save Update'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="button button-clear"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
