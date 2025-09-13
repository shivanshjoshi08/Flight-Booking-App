import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function FlightSearch() {
  const { token } = useContext(AuthContext);

  // --- Naye States ---
  const [activeTab, setActiveTab] = useState('Flight'); // 'Flight', 'Hotel', 'Car'
  const [tripType, setTripType] = useState('oneway'); // 'oneway', 'roundtrip'
  
  // --- Purane States ---
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setFlights([]);
    try {
        const response = await axios.get('http://127.0.0.1:5000/api/flights', { params: { origin, destination } });
        setFlights(response.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleBooking = async (flightId) => {
    // ... booking logic same
  };

  return (
    <div className="hero-section">
      <h1 className="hero-title">Find your next destination</h1>

      <div className="search-box">
        {/* Main Tabs */}
        <div className="search-box-tabs">
          <button className={`tab-btn ${activeTab === 'Flight' ? 'active' : ''}`} onClick={() => setActiveTab('Flight')}>Book</button>
          <button className={`tab-btn ${activeTab === 'Status' ? 'active' : ''}`} onClick={() => setActiveTab('Status')}>Flight status</button>
          <button className={`tab-btn ${activeTab === 'Checkin' ? 'active' : ''}`} onClick={() => setActiveTab('Checkin')}>Check-in</button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'Flight' && (
            <form onSubmit={handleSearch}>
              <div className="trip-options">
                <label>
                  <input type="radio" name="trip" value="roundtrip" checked={tripType === 'roundtrip'} onChange={(e) => setTripType(e.target.value)} />
                  Roundtrip
                </label>
                <label>
                  <input type="radio" name="trip" value="oneway" checked={tripType === 'oneway'} onChange={(e) => setTripType(e.target.value)} />
                  One-way
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="from">From</label>
                  <input type="text" id="from" value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} placeholder="Bengaluru (BLR)" required />
                </div>
                <div className="form-group">
                  <label htmlFor="to">To</label>
                  <input type="text" id="to" value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} placeholder="Delhi (DEL)" required />
                </div>
                <div className="swap-icon" onClick={handleSwap}>
                    &#8644; {/* Swap Arrow Icon */}
                </div>
              </div>
              
              {/* Date, Travelers, etc. fields can be added here later */}

              <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <button type="submit" disabled={loading} className="btn-primary" style={{flexGrow: 1, padding: '0.75rem'}}>
                  {loading ? 'Searching...' : 'Find flights'}
                </button>
              </div>
              <a href="#" style={{display: 'block', marginTop: '1rem', fontWeight: '600', color: '#0057b8', textDecoration: 'none'}}>Advanced search</a>
            </form>
          )}

          {activeTab === 'Status' && <p>Flight Status functionality coming soon.</p>}
          {activeTab === 'Checkin' && <p>Check-in functionality coming soon.</p>}
        </div>
      </div>

      {searched && (
        <div className="results-container">
          {/* ... (Result display logic same as before) ... */}
        </div>
      )}
    </div>
  );
}
export default FlightSearch;