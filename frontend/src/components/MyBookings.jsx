import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Agar user logged-in nahi hai to kuch na karein
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get('https://flight-booking-app-t010.onrender.com/api/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBookings(response.data);
      } catch (err) {
        setError('Could not fetch bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]); // Yeh useEffect tab chalega jab token milega

  if (loading) return <p className="text-white text-center">Loading your bookings...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="form-container" style={{maxWidth: '800px'}}>
      <h2 style={{textAlign: 'center'}}>My Bookings</h2>
      {bookings.length > 0 ? (
        <div>
          {bookings.map(item => (
            <div key={item.booking_id} className="flight-card">
              <p><strong>Booking ID:</strong> {item.booking_id} (Booked on: {new Date(item.booking_date).toLocaleDateString()})</p>
              <hr style={{margin: '0.5rem 0'}}/>
              <p><strong>Flight:</strong> {item.flight.flight_number} ({item.flight.origin} to {item.flight.destination})</p>
              <p><strong>Departure:</strong> {new Date(item.flight.departure_time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{textAlign: 'center'}}>You have no bookings.</p>
      )}
    </div>
  );
}

export default MyBookings;