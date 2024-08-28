import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { login } from '../../redux/authSlice';
import { storeToken } from '../../api/authApi';
import './Login.css'
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate
    const auth = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await dispatch(login({ email, password })).unwrap();
            // Store the token in localStorage
            storeToken(response.token);
            // Clear the form
            setEmail('');
            setPassword('');
            // Redirect to the tasks page
            navigate('/tasks');
        } catch (error) {
            // Error is handled by the slice's rejected case
        }
    };

    return (
        <div className="container">
            <div className="box login-box">
                <h1 className="login-header">Login</h1>
                <div className="form-group">
                    <label htmlFor="inputemail">Email</label>
                    <input
                        type="email"
                        id="inputemail"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword">Password</label>
                    <input
                        type="password"
                        id="inputPassword"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="button-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleLogin}
                    >
                        Sign In
                    </button>
                    <button
                        type="reset"
                        className="btn btn-primary"
                        onClick={() => {
                            setEmail('');
                            setPassword('');
                        }}
                    >
                        Reset
                    </button>
                </div>
                {auth.status === 'loading' && <div>Loading...</div>}
                {auth.status === 'failed' && <div style={{ color: 'red' }}>Error: {auth.error}</div>}
                {auth.status === 'succeeded' && <div></div>}
            </div>
        </div>
    );
};

export default Login;
