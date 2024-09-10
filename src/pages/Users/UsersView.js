import React from 'react';
import './Users.css'; // Import specific styles

const UserView = ({ users, viewMode, handleEdit, handleDelete }) => {
  return (
    <>
      {viewMode === 'list' ? (
        <div className="tableContainer">
          <table className="taskTable">
          <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item._id} className="table-row">
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td >
                  <div className="button-group-list">
                    <button onClick={() => handleEdit(item)} className="button button-update">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="button button-delete">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
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
  );
};

export default UserView;
