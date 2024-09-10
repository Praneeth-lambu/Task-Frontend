import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../api/userApi';
import UserView from './UsersView';
import './Users.css';
import '../commonStyles.css';
import UsersForm from './UsersForm';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const status = useSelector(state => state.users.status);
  const error = useSelector(state => state.users.error);
  const [userId, setUserId] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editUser, setEditUser] = useState(null);
  const [formMode, setFormMode] = useState('');
  const [shouldFetchUsers, setShouldFetchUsers] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    dispatch(fetchUsers(''));
  }, [dispatch]);

  useEffect(() => {
    if (shouldFetchUsers) {
      dispatch(fetchUsers(userId));
      setShouldFetchUsers(false);
    }
  }, [dispatch, userId, shouldFetchUsers]);

  const handleSubmit = async () => {
    try {
      await dispatch(addUser(newUser)).unwrap();
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      setFormMode('');
      setShouldFetchUsers(true);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleSaveUpdate = async () => {
    if (editUser) {
      try {
        await dispatch(updateUser(editUser)).unwrap();
        setEditUser(null);
        setFormMode('');
        setShouldFetchUsers(true);
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
  };

  const handleChangeNewUser = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeEdit = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value
    });
  };

  const handleChange = (e) => {
    setUserId(e.target.value);
  };

  const handleFetchUsers = () => {
    setShouldFetchUsers(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

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
      <UsersForm
        formMode={formMode}
        newUser={newUser}
        editUser={editUser}
        onChangeNewUser={handleChangeNewUser}
        onChangeEdit={handleChangeEdit}
        onSubmit={handleSubmit}
        onSaveUpdate={handleSaveUpdate}
        onCancel={onCancel}
      />
      <div className="view-toggle">
        <button onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}>
          {viewMode === 'list' ? 'Card' : 'List'} View
        </button>
      </div>
      {status === 'succeeded' && users.length > 0 && (
        <UserView
          users={users}
          viewMode={viewMode}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
      {getErrorMessage()}
    </div>
  );
};

export default Users;
