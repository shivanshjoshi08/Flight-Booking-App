import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Link aur useNavigate import karein

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/register', { name, email, password });
      setMessage(response.data.message + " Redirecting to login...");
      // Register successful hone ke 2 second baad login page par bhej dein
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Registration failed.');
    }
  };

  return (
    <div className="form-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
            {/* ... form inputs (no change) ... */}
            <div className="form-group">
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', padding: '0.75rem'}}>Register</button>
        </form>
        {message && <p className={`form-message ${message.includes('failed') ? 'error-message' : 'success-message'}`}>{message}</p>}
        <p style={{textAlign: 'center', marginTop: '1rem'}}>
            Already have an account? 
            {/* Button ki jagah Link use karein */}
            <Link to="/login" style={{color: '#0057b8', fontWeight: '600'}}> Login here</Link>
        </p>
    </div>
  );
}

export default Register;