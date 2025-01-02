import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contextApi/AuthContext';
import RStyle from '../Register/Register.module.css';

import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading, user,error } = useAuth(); 

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        image: null,
    });
    

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'image' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('file', formData.image);

        try {
            await register(data);
        } catch (error) {
            setError(error.message);  // Set error message here
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className={RStyle.whole}>
            <div className={RStyle.card}>
                <h2 className={RStyle.title}>Welcome to employee management</h2>
                <form onSubmit={handleSubmit} className={RStyle.form}>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleChange} 
                    />
                    <button type="submit" className={RStyle.button} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                    </button>
                    <h4>Already have an account? <Link to="/login">Login</Link></h4>
                    {error && <div className={RStyle.error}>{error}</div>}  
                </form>
            </div>
        </div>
    );
};

export default Register;
