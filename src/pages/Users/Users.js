import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../api/userApi';
import './Users.css';
import '../commonStyles.css';


const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const status = useSelector(state => state.users.status);
  const error = useSelector(state => state.users.error);
  const [userId, setUserId] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editUser, setEditUser] = useState(null); // Initializing as null for edit mode
  const [formMode, setFormMode] = useState(''); // 'add' or 'edit'
  const [shouldFetchUsers, setShouldFetchUsers] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    dispatch(fetchUsers(''));
  }, [dispatch]);

  // Fetch users when component mounts or when shouldFetchUsers changes
  useEffect(() => {
    if (shouldFetchUsers) {
      dispatch(fetchUsers(userId));
      setShouldFetchUsers(false); // Reset after fetching
    }
  }, [dispatch, userId, shouldFetchUsers]);

  // Handle form submission for adding new user
  const handleSubmit = async () => {
    try {
      await dispatch(addUser(newUser)).unwrap();
      setNewUser({ name: '', email: '', password: '', role: 'user' }); // Reset form
      setFormMode(''); // Reset form mode
      setShouldFetchUsers(true); // Fetch users again to refresh the list
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  // Handle form submission for updating an existing user
  const handleSaveUpdate = async () => {
    if (editUser) {
      try {
        await dispatch(updateUser(editUser)).unwrap();
        setEditUser(null); // Reset edit form
        setFormMode(''); // Reset form mode
        setShouldFetchUsers(true); // Fetch users again to refresh the list
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
  };

  // Handle input changes for new user form
  const handleChangeNewUser = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  // Handle input changes for edit user form
  const handleChangeEdit = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value
    });
  };

  // Handle user ID input change
  const handleChange = (e) => {
    setUserId(e.target.value);
  };

  // Handle button clicks
  const handleFetchUsers = () => {
    setShouldFetchUsers(true); // Trigger fetching users
  };

  // Handle delete user action
  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  // Handle edit user action
  const handleEdit = (user) => {
    setEditUser({ ...user });
    setFormMode('edit');
  };
  const onCancel = () => {
    setNewUser({ name: '', email: '', password: '', role: 'user' });
    setEditUser(null);
    setFormMode('');
    setUserId('');
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

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed' && error.status !== 404 && error.status !== 400) return <div style={{color:"black",fontSize: "20px"}}>{getErrorMessage()}</div>;

  return (
    <div className="container">
      <div className="inputGroup">
        <label htmlFor="userIdInput" className="inputLabel">
          Enter User Name to search
        </label>
        <input
          id="userIdInput"
          type="text"
          value={userId}
          onChange={handleChange}
          className="inputField"
        />
      </div>
      <div className="buttonGroup">
        <button type="button" className="button button-add" onClick={handleFetchUsers}>
          Get User Details
        </button>
        <button type="button" className="button button-add" onClick={() => setFormMode('add')}>
          Add User
        </button>
      </div>
      <div className="inputGroup" style={{ marginTop: '20px' }}>
        {formMode === 'add' && (
          <>
            <label htmlFor="newUserName" className="inputLabel">Name</label>
            <input
              id="newUserName"
              name="name"
              type="text"
              value={newUser.name}
              onChange={handleChangeNewUser}
              className="inputField"
            />
            <label htmlFor="newUserEmail" className="inputLabel">Email</label>
            <input
              id="newUserEmail"
              name="email"
              type="email"
              value={newUser.email}
              onChange={handleChangeNewUser}
              className="inputField"
            />
            <label htmlFor="newUserPassword" className="inputLabel">Password</label>
            <input
              id="newUserPassword"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleChangeNewUser}
              className="inputField"
            />
            <label htmlFor="newUserRole" className="inputLabel">Role</label>
            <select
              id="newUserRole"
              name="role"
              value={newUser.role}
              onChange={handleChangeNewUser}
              className="inputField"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button onClick={handleSubmit} className="button button-add">
                Submit
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="button button-clear"
              >
                Clear
              </button>
            </div>
          </>
        )}
        {formMode === 'edit' && editUser && (
          <>
            <label htmlFor="editUserName" className="inputLabel">Name</label>
            <input
              id="editUserName"
              name="name"
              type="text"
              value={editUser.name}
              onChange={handleChangeEdit}
              className="inputField"
            />
            <label htmlFor="editUserEmail" className="inputLabel">Email</label>
            <input
              id="editUserEmail"
              name="email"
              type="email"
              value={editUser.email}
              onChange={handleChangeEdit}
              className="inputField"
            />
            <label htmlFor="editUserPassword" className="inputLabel">Password</label>
            <input
              id="editUserPassword"
              name="password"
              type="password"
              value={editUser.password}
              onChange={handleChangeEdit}
              className="inputField"
            />
            <label htmlFor="editUserRole" className="inputLabel">Role</label>
            <select
              id="editUserRole"
              name="role"
              value={editUser.role}
              onChange={handleChangeEdit}
              className="inputField"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div style={{ textAlign: 'center', marginTop: "10px" }}>
              <button onClick={handleSaveUpdate} className="button button-update">
                Save Update
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="button button-clear"
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div><div className="view-toggle">
        <button onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}>
          {viewMode === 'list' ? 'Card' : 'List'} View
        </button>
      </div>
      {status === 'succeeded' && users.length > 0 && (
        <>
          {viewMode === 'list' ? (
            <div className="listContainer">
              <div className="headerRow">
                <div className="headerCell">Name</div>
                <div className="headerCell">Email</div>
                <div className="headerCell">Role</div>
                <div className="headerCell">Actions</div>
              </div>
              <ul className="listView">
                {users.map((item) => (
                  <li key={item._id} className="listItem">
                    <div className="listCell ">{item.name}</div>
                    <div className="listCell">{item.email}</div>
                    <div className="listCell"style={{textAlign:"center"}}>{item.role}</div>
                    <div className="listCell">
                      <div className="button-group-list">
                        <button onClick={() => handleEdit(item)} className="button button-update">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="button button-delete">
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="gridContainer">
              {users.map((item) => (
                <div key={item._id} className="card">
                  <h2>Name: {item.name}</h2>
                  <p>Email: {item.email}</p>
                  <p>Password: {''}</p>
                  <p>Role: {item.role}</p>
                  <div className="button-group">
                    <button onClick={() => handleEdit(item)} className="button button-update">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="button button-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {getErrorMessage()}
    </div>
  );
};

export default Users;