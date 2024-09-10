import React from 'react';
import './Users.css'; // Import specific styles

const UsersForm = ({
  formMode,
  newUser,
  editUser,
  onChangeNewUser,
  onChangeEdit,
  onSubmit,
  onSaveUpdate,
  onCancel
}) => {
  return (
    <div className="inputGroup" style={{ marginTop: '20px' }}>
      {formMode === 'add' && (
        <>
          <label htmlFor="newUserName" className="inputLabel">Name</label>
          <input
            id="newUserName"
            name="name"
            type="text"
            value={newUser.name}
            onChange={onChangeNewUser}
            className="inputField"
          />
          <label htmlFor="newUserEmail" className="inputLabel">Email</label>
          <input
            id="newUserEmail"
            name="email"
            type="email"
            value={newUser.email}
            onChange={onChangeNewUser}
            className="inputField"
          />
          <label htmlFor="newUserPassword" className="inputLabel">Password</label>
          <input
            id="newUserPassword"
            name="password"
            type="password"
            value={newUser.password}
            onChange={onChangeNewUser}
            className="inputField"
          />
          <label htmlFor="newUserRole" className="inputLabel">Role</label>
          <select
            id="newUserRole"
            name="role"
            value={newUser.role}
            onChange={onChangeNewUser}
            className="inputField"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button onClick={onSubmit} className="button button-add">
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
            onChange={onChangeEdit}
            className="inputField"
          />
          <label htmlFor="editUserEmail" className="inputLabel">Email</label>
          <input
            id="editUserEmail"
            name="email"
            type="email"
            value={editUser.email}
            onChange={onChangeEdit}
            className="inputField"
          />
          <label htmlFor="editUserPassword" className="inputLabel">Password</label>
          <input
            id="editUserPassword"
            name="password"
            type="password"
            value={editUser.password}
            onChange={onChangeEdit}
            className="inputField"
          />
          <label htmlFor="editUserRole" className="inputLabel">Role</label>
          <select
            id="editUserRole"
            name="role"
            value={editUser.role}
            onChange={onChangeEdit}
            className="inputField"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div style={{ textAlign: 'center', marginTop: "10px" }}>
            <button onClick={onSaveUpdate} className="button button-update">
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
    </div>
  );
};

export default UsersForm;
