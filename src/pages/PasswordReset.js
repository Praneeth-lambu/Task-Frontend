import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ResetPassword } from '../redux/authSlice'; // Correct import path
import './ResetPassword.css';

const PasswordReset = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Extract token from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        setToken(tokenFromUrl);

        // Validate if token is present
        if (!tokenFromUrl) {
            setError('Invalid or missing token');
        }
    }, [location.search]);

    const handleResetPassword = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await dispatch(ResetPassword({ token, password })).unwrap();
            setSuccess('Password reset successful!');
            setPassword('');
            setConfirmPassword('');
            setError('');
            navigate('/login'); // Redirect to login page
        } catch (error) {
            setError(error || 'Password reset failed'); // Display specific error message
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h1 className="reset-password-header">Reset Your Password</h1>
                <form onSubmit={handleResetPassword} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="status error">{error}</p>}
                    {success && <p className="status success">{success}</p>}
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
