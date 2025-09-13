import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import FlightSearch from './components/FlightSearch';
import MyBookings from './components/MyBookings';
import './App.css';

function App() {
  const { token, logout } = useContext(AuthContext);

  return (
    <div className="app-container">
      <div className="app-overlay">
        <Header token={token} handleLogout={logout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<FlightSearch />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
            <Route path="/my-bookings" element={token ? <MyBookings /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
export default App;