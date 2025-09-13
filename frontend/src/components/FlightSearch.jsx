import React, { useState, useContext } from 'react';
import axios from 'axios';
// Link import abhi use nahi ho raha hai, but future ke liye rakh sakte hain
// import { Link } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';

function FlightSearch() {
  const { token } = useContext(AuthContext);

  // --- States ---
  const [activeTab, setActiveTab] = useState('Flight');
  const [tripType, setTripType] = useState('oneway');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // --- Naye States jo missing the ---
  const [departureDate, setDepartureDate] = useState('');
  const [travelers, setTravelers] = useState('1 Adult');
  const [cabinClass, setCabinClass] = useState('Economy');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setFlights([]); // Purane results clear karein
    try {
      // API call mein naye parameters bhi bhej sakte hain
      const response = await axios.get('https://flight-booking-app-t010.onrender.com/api/flights', {
        params: {
          origin,
          destination,
          // date: departureDate, // Uncomment karein jab backend ready ho
          // travelers: travelers, // Uncomment karein jab backend ready ho
        }
      });
      setFlights(response.data);
    } catch (err) {
      console.error("Error fetching flights:", err);
      // User ko error dikhane ke liye yahan state set kar sakte hain
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    // Origin aur Destination ko aapas mein badalne ka logic
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleBooking = async (flightId) => {
    // Yeh function flight book karega
    if (!token) {
      alert("Please login to book a flight.");
      // Yahan aap user ko login page par redirect kar sakte hain
      return;
    }
    // alert(`Booking flight with ID: ${flightId}. API call yahan se jaayegi.`);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post('https://flight-booking-app-t010.onrender.com/api/book',
        { flightId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert("Booking successful!");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <>
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