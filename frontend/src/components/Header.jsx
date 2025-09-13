import React from 'react';
import { Link } from 'react-router-dom';

function Header({ token, handleLogout }) {
  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>United Airlines</Link>
      </div>
      <nav className="nav-links">
        <a href="#">BOOK</a>
        <a href="#">MY TRIPS</a>
        <a href="#">TRAVEL INFO</a>
      </nav>
      <div className="auth-buttons">
        {token ? (
          <>
            <Link to="/my-bookings" className="btn btn-signin">My Bookings</Link>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-signin">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
export default Header;