import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { login } from '../../redux/authSlice';
import { storeToken } from '../../api/authApi';

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
    

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    return (
        <>
            <div style={{ paddingLeft: "700px" }}>
                <h1>User Login</h1>
            </div>
            <div className='m-5' style={{ display: "flex", flexDirection: "column", paddingLeft: "400px" }}>
                <div className="row pt-3">
                    <div className="col-auto">
                        <label htmlFor="inputemail" className="col-form-label">Email</label>
                    </div>
                    <div className="col-auto" style={{ paddingLeft: "39px" }}>
                        <input
                            type="email"
                            id="inputemail"
                            className="form-control"
                            aria-describedby="emailHelper"
                            value={email}
                            onChange={handleChangeEmail}
                        />
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col-auto">
                        <label htmlFor="inputPassword6" className="col-form-label">Password</label>
                    </div>
                    <div className="col-auto">
                        <input
                            type="password"
                            id="inputPassword6"
                            className="form-control"
                            aria-describedby="passwordHelpInline"
                            value={password}
                            onChange={handleChangePassword}
                        />
                    </div>
                </div>
                <div style={{ padding: "30px 0px 10px 100px" }}>
                    <button
                        type="button"
                        className="btn btn-outline-primary mb-3"
                        style={{ marginRight: "20px" }}
                        onClick={handleLogin}
                    >
                        Submit
                    </button>
                    <button
                        type="reset"
                        className="btn btn-outline-primary mb-3"
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
        </>
    );
};

export default Login;
