import React, { useState } from 'react';
import TravelSaathiChat from '../components/TravelSaathiChat';

const TestChatPage: React.FC = () => {
  const [apiURL, setApiURL] = useState('http://localhost:8082');
  const [userId, setUserId] = useState('test_user');

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Travel Saathi - Direct ADK Integration Test</h1>
        
        {/* Configuration Panel */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Base URL
              </label>
              <input
                type="text"
                value={apiURL}
                onChange={(e) => setApiURL(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="http://localhost:8081"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test_user"
              />
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Integration Status</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>✅ <strong>Direct ADK API Integration</strong> - No FastAPI proxy needed</p>
            <p>✅ <strong>Streaming Responses</strong> - Real-time chat experience</p>
            <p>✅ <strong>Session Management</strong> - Automatic session handling</p>
            <p>✅ <strong>Full Agent Functionality</strong> - All tools available (hotels, bookings, etc.)</p>
            <p>✅ <strong>Error Handling</strong> - Graceful fallbacks and retry mechanisms</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">🏨 Hotel Search</h4>
            <p className="text-sm text-gray-600">Search hotels by location, name, or traveler type</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">📅 Booking Management</h4>
            <p className="text-sm text-gray-600">Create bookings and view booking history</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">🗺️ Places & Attractions</h4>
            <p className="text-sm text-gray-600">Find restaurants, nightlife, and attractions</p>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <TravelSaathiChat 
          userId={userId}
          apiBaseURL={apiURL}
          className="h-full"
        />
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Quick Test Commands</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p><strong>Hotel Search:</strong> "Find hotels in Goa" or "Show me luxury hotels in Paris"</p>
          <p><strong>User Registration:</strong> "Register me as John Doe, john@example.com, +1234567890"</p>
          <p><strong>Booking:</strong> "Book hotel ID 1 for 2 people from 2024-01-15 to 2024-01-20"</p>
          <p><strong>Places:</strong> "Find restaurants near me" or "Show me nightlife in Mumbai"</p>
          <p><strong>Bookings:</strong> "Show my bookings" or "List my reservation history"</p>
        </div>
      </div>
    </div>
  );
};

export default TestChatPage;
