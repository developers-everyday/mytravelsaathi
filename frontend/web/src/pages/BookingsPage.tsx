import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

const BookingsPage: React.FC = () => {
  // Mock booking data
  const bookings = [
    {
      id: 1,
      hotelName: 'Taj Exotica Resort & Spa',
      location: 'Benaulim, South Goa',
      checkIn: '2024-12-20',
      checkOut: '2024-12-25',
      guests: 2,
      status: 'confirmed',
      totalPrice: 45000
    },
    {
      id: 2,
      hotelName: 'Hilton Basel',
      location: 'Basel, Switzerland',
      checkIn: '2024-04-20',
      checkOut: '2024-04-22',
      guests: 2,
      status: 'pending',
      totalPrice: 25000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your hotel bookings and travel reservations</p>
      </div>

      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.hotelName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.checkIn} - {booking.checkOut}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{booking.totalPrice.toLocaleString()}
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn-secondary text-sm">
                        View Details
                      </button>
                      <button className="btn-primary text-sm">
                        Manage Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">
              Start planning your trip and book your first hotel through Travel Saathi
            </p>
            <button className="btn-primary">
              Plan a Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
