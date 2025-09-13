from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:imShivansh@localhost/flight_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'a-very-secret-key-that-you-should-change'

db = SQLAlchemy(app)
CORS(app) 
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- Database Models ---
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class Flight(db.Model):
    __tablename__ = 'flights'
    flight_id = db.Column(db.Integer, primary_key=True)
    flight_number = db.Column(db.String(20), nullable=False)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)

class Booking(db.Model):
    __tablename__ = 'bookings'
    booking_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    flight_id = db.Column(db.Integer, db.ForeignKey('flights.flight_id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/')
def home():
    return "Server is running the latest code!"

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'Email already exists'}), 409
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=str(user.user_id))
        return jsonify(access_token=access_token)
    return jsonify({'message': 'Invalid email or password'}), 401

@app.route('/api/flights', methods=['GET'])
def search_flights():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    query = Flight.query
    if origin:
        query = query.filter_by(origin=origin.upper())
    if destination:
        query = query.filter_by(destination=destination.upper())
    flights = query.all()
    results = []
    for flight in flights:
        results.append({
            'flight_id': flight.flight_id,
            'flight_number': flight.flight_number,
            'origin': flight.origin,
            'destination': flight.destination,
            'departure_time': flight.departure_time.isoformat(),
            'arrival_time': flight.arrival_time.isoformat(),
            'price': str(flight.price)
        })
    return jsonify(results)

@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    # get_jwt_identity() will now return the user_id as a string
    user_id = get_jwt_identity()
    
    data = request.get_json()
    flight_id = data.get('flight_id')

    if not flight_id:
        return jsonify({'message': 'Flight ID is required'}), 400
    
    flight = Flight.query.get(flight_id)
    if not flight:
        return jsonify({'message': 'Flight not found'}), 404

    # The user_id (which is a string) will be correctly handled by SQLAlchemy
    new_booking = Booking(user_id=user_id, flight_id=flight_id)
    
    db.session.add(new_booking)
    db.session.commit()
    
    return jsonify({'message': 'Booking created successfully!', 'booking_id': new_booking.booking_id}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)