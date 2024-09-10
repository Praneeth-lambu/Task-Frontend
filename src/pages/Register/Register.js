import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../redux/authSlice';
import './Register.css'; // Import the CSS file

const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('black');
    const [resendTimer, setResendTimer] = useState(0); // Timer for resend OTP

    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if (email.length === 0) {
            // Clear feedback if the input is empty
            setFeedback('');
            setFeedbackColor('black');
            return;
        }

        if (emailRegex.test(email)) {
            // Basic format is correct
            setFeedback('Email format looks good.');
            setFeedbackColor('yellow');

            // Optional: Check if the email is available
            if (!otpSent) {
                checkEmailAvailability(email);
            }
        } else {
            // Invalid format
            setFeedback('Invalid email format.');
            setFeedbackColor('red');
        }
    }, [email]);

    useEffect(() => {
        // Start a countdown timer when OTP is sent
        let timer;
        if (otpSent && resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        if (resendTimer === 0 && otpSent) {
            setFeedback('You can resend OTP now.');
            setFeedbackColor('green');
        }
        return () => clearInterval(timer);
    }, [otpSent, resendTimer]);

    const checkEmailAvailability = async (email) => {
        try {
            const payload = JSON.stringify({ email });
            const response = await fetch(`${API_URL}/auth/email_check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.available) {
                setFeedback('Email is available.');
                setFeedbackColor('green');
            } else {
                setFeedback('Email is already taken.');
                setFeedbackColor('red');
                setOtpSent(false); // Reset OTP sent state if email is not available
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setFeedback('Error checking email.');
            setFeedbackColor('red');
        }
    };

    const handleSendOtp = async () => {
        if (feedbackColor !== 'green') {
            setFeedback('Please enter a valid and available email before sending OTP.');
            setFeedbackColor('red');
            return;
        }
        setLoading(true);
        try {
            await fetch(`${API_URL}/mail/send_otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            setOtpSent(true);
            setResendTimer(60); // Set timer for 1 minute (60 seconds)
            setFeedback('OTP sent successfully.');
            setFeedbackColor('blue'); // Indicate OTP has been sent
        } catch (error) {
            console.error("Failed to send OTP:", error);
            setFeedback('Failed to send OTP.');
            setFeedbackColor('red');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/mail/verify_otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setOtpVerified(true);
                setFeedback('OTP verified successfully.');
                setFeedbackColor('green');
            } else {
                setFeedback('OTP verification failed: ' + (result.message || 'No message provided'));
                setFeedbackColor('red');
            }
        } catch (error) {
            console.error("Failed to verify OTP:", error.message || error);
            setFeedback('Failed to verify OTP.');
            setFeedbackColor('red');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!otpVerified) {
            console.error("OTP not verified");
            setFeedback('Please verify the OTP before registering.');
            setFeedbackColor('red');
            return;
        }
        try {
            await dispatch(register({ email, name, password })).unwrap();
            setEmail('');
            setName('');
            setPassword('');
            setOtp('');
            setOtpSent(false);
            setOtpVerified(false);
            navigate('/login');
        } catch (error) {
            console.error("Registration failed:", error);
            setFeedback('Registration failed.');
            setFeedbackColor('red');
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
                        disabled={otpSent}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!otpSent && feedback && <div style={{ color: feedbackColor }}>{feedback}</div>}
                    {<div className="button-group">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSendOtp}
                            disabled={loading || feedbackColor !== 'green'}
                        >
                            {otpSent ? (resendTimer !== 0 ? `Resend OTP (${Math.floor(resendTimer / 60)}m ${resendTimer % 60}s)` : "Resend OTP") : "Verify"}
                        </button>
                    </div>}
                    {otpSent && (
                        <div className="form-group">
                            <label htmlFor="inputOtp">OTP</label>
                            <input
                                type="text"
                                id="inputOtp"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <div className="button-group">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                >
                                    Verify OTP
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {otpVerified && (
                    <>
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
                                disabled={loading}
                            >
                                Register
                            </button>
                        </div>
                    </>
                )}
                {auth.status === 'loading' && <div className="status">Loading...</div>}
                {auth.status === 'failed' && <div className="status error">Error: {auth.error}</div>}
                {auth.status === 'succeeded' && <div className="status success">Registration successful!</div>}
            </div>
        </div>
    );
};

export default Register;
