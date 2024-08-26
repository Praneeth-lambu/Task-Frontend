import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../redux/authSlice';

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
            // Clear the form
            setEmail('');
            setName('');
            setPassword('');
            navigate('/login'); // Redirect to login page on success

        } catch (error) {
            console.error("Registration failed:", error); // Log error for debugging
        }
    };

    return (
        <>
            <div style={{ paddingLeft: "700px" }}>
                <h1>User Registration</h1>
            </div>
            <div className='m-5' style={{ display: "flex", flexDirection: "column", paddingLeft: "400px" }}>
                
                <div className="row pt-3">
                    <div className="col-auto">
                        <label htmlFor="inputname" className="col-form-label">Name</label>
                    </div>
                    <div className="col-auto" style={{ paddingLeft: "36px" }}>
                        <input
                            type="text"
                            id="inputname"
                            className="form-control"
                            aria-describedby="namehelper"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="col-auto">
                        <span id="namehelper" className="form-text" style={{ color: "white" }}>
                            Must be min of 4 characters.
                        </span>
                    </div>
                </div>
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
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="col-auto">
                        <span id="passwordHelpInline" className="form-text" style={{ color: "white" }}>
                            Must be 8-20 characters long.
                        </span>
                    </div>
                </div>
                <div style={{ padding: "30px 0px 10px 100px" }}>
                    <button
                        type="button"
                        className="btn btn-outline-primary mb-3"
                        style={{ marginRight: "20px" }}
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                    <button
                        type="reset"
                        className="btn btn-outline-primary mb-3"
                        onClick={() => {
                            setEmail('');
                            setName('');
                            setPassword('');
                        }}
                    >
                        Reset
                    </button>
                </div>
                {auth.status === 'loading' && <div>Loading...</div>}
                {auth.status === 'failed' && <div style={{ color: 'red' }}>Error: {auth.error}</div>}
                {auth.status === 'succeeded' && <div>Registration successful!</div>}
            </div>
        </>
    );
};

export default Register;
