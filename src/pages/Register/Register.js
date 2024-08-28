import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../redux/authSlice';
import './Register.css'; // Import the CSS file

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await dispatch(register({ email, name, password })).unwrap();
            setEmail('');
            setName('');
            setPassword('');
            navigate('/login');
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="container">
            <div className="box register-box">
                <h1 className="register-header">User Registration</h1>
                <div className="form-group">
                    <label htmlFor="inputname">Name</label>
                    <input
                        type="text"
                        id="inputname"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <span className="form-text">Must be min of 4 characters.</span>
                </div>
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
                    <span className="form-text">Must be 8-20 characters long.</span>
                </div>
                <div className="button-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                </div>
                {auth.status === 'loading' && <div className="status">Loading...</div>}
                {auth.status === 'failed' && <div className="status error">Error: {auth.error}</div>}
                {auth.status === 'succeeded' && <div className="status success">Registration successful!</div>}
            </div>
        </div>
    );
};

export default Register;
