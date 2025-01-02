import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contextApi/AuthContext';
import Lstyle from '../Login/Login.module.css';

import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const { login, user, loading, error } = useAuth(); 
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className={Lstyle.card}>
            <h2 className={Lstyle.title}>Welcome to Employee management system</h2>
            <form onSubmit={handleSubmit} className={Lstyle.form}>
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
                <button type="submit" className={Lstyle.button} disabled={loading}>
                    {loading ? 
                        <Box display="flex" justifyContent="center">
                            <CircularProgress size={24} color="inherit" />
                        </Box> 
                        : 'Submit'
                    }
                </button>
                <h4>You don't have an account? <Link to="/register">Register</Link></h4>
            </form>
            {error && <div className={Lstyle.error}>{error}</div>}  
        </div>
    );
};

export default Login;
