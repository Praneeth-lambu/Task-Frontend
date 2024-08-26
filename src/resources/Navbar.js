// src/components/Navbar.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import UserProfile from '../pages/userProfile';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ fontSize: "22px" }}>
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                        <UserProfile className="nav-item"/>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        {isAuthenticated && user?.role === 'admin' && (
                            <li className="nav-item">
                                <a className="nav-link" href="/users">Users</a>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <a className="nav-link" href="/tasks">Tasks</a>
                            </li>
                            
                        )}
                    </ul>
                    <div>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {!isAuthenticated ? (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/login">Login</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/register">Register</a>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item mt-1">
                                    <button 
                                        className="btn btn-outline" 
                                        onClick={handleLogout} 
                                        style={{
                                            color: 'black',
                                            backgroundColor: 'transparent',
                                            boxShadow: 'none'
                                        }} 
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
