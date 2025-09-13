import React, { useState, useContext } from 'react'; // useContext ko import karein
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // AuthContext import karein

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  // Login function ab seedhe context se aayega
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
      // Context wale login function ko token ke saath call karein
      login(response.data.access_token);
      navigate('/'); 
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Login failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary" style={{width: '100%', padding: '0.75rem'}}>Login</button>
      </form>
      {message && <p className={`form-message error-message`}>{message}</p>}
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Don't have an account? 
        <Link to="/register" style={{color: '#0057b8', fontWeight: '600'}}> Register here</Link>
      </p>
    </div>
  );
}

export default Login;