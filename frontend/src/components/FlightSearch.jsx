import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// API ka base URL yahan define karein (environment variable se)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://flight-booking-app-t010.onrender.com';

function FlightSearch() {
  const { token } = useContext(AuthContext);
  // ... (aapke saare states same rahenge)
  const [activeTab, setActiveTab] = useState('Flight');
  const [tripType, setTripType] = useState('oneway');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [travelers, setTravelers] = useState('1 Adult');
  const [cabinClass, setCabinClass] = useState('Economy');


  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setFlights([]);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/flights`, { // <-- Yahan badlaav kiya hai
        params: { origin, destination }
      });
      setFlights(response.data);
    } catch (err) {
      console.error("Error fetching flights:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (flightId) => {
    if (!token) {
      alert("Please login to book a flight.");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/book`, // <-- Yahan bhi badlaav kiya hai
        { flightId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert("Booking successful!");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    }
  };

  // ... (handleSwap function same rahega)
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // --- JSX (return statement) mein koi badlaav nahi ---
  return (
    <>
      {/* ... Aapka poora JSX code yahan same rahega ... */}
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

                <div className="flight-search-grid">
                  <div className="from-to-group">
                    <div className="form-group">
                      <label htmlFor="from">From</label>
                      <input type="text" id="from" value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} placeholder="Bengaluru (BLR)" required />
                    </div>
                    <div className="swap-icon" onClick={handleSwap}>&#8644;</div>
                    <div className="form-group">
                      <label htmlFor="to">To</label>
                      <input type="text" id="to" value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} placeholder="Delhi (DEL)" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="travelers">Travelers</label>
                    <input type="text" id="travelers" value={travelers} onChange={(e) => setTravelers(e.target.value)} required />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}> {/* Yeh poori width lega */}
                    <label htmlFor="cabin">Class</label>
                    <select id="cabin" value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}>
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? 'Searching...' : 'Find flights'}
                    </button>
                  </div>
                </div>

                <a href="#" className="advanced-search-link">Advanced search</a>
              </form>
            )}
            {activeTab === 'Status' && <p>Flight Status functionality coming soon.</p>}
            {activeTab === 'Checkin' && <p>Check-in functionality coming soon.</p>}
          </div>
        </div>
      </div>

      {/* Flight Results Section */}
      {searched && (
        <div className="results-container app-container">
          {loading ? (
            <p>Loading flights...</p>
          ) : flights.length > 0 ? (
            <>
              <h2>Available Flights from {origin} to {destination}</h2>
              {flights.map((flight) => (
                <div key={flight.id} className="flight-card">
                  <div className="flight-details">
                    <h4>{flight.airline} ({flight.flight_number})</h4>
                    <p>{flight.origin} → {flight.destination}</p>
                    <p>Departs: {flight.departure_time} | Arrives: {flight.arrival_time}</p>
                  </div>
                  <div className="flight-price">
                    <h3>₹{flight.price}</h3>
                    <button className="btn-primary" onClick={() => handleBooking(flight.id)}>Book Now</button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <h2>No flights found for this route.</h2>
          )}
        </div>
      )}
    </>
  );
}

export default FlightSearch;