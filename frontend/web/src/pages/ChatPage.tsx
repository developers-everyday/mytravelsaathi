import React from 'react';
import { useAuth } from '../services/AuthContext';
import TravelSaathiChat from '../components/TravelSaathiChat';

const ChatPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Travel Saathi Chat</h1>
          <p className="text-gray-600">Your AI travel assistant powered by Google ADK</p>
        </div>
        
        <TravelSaathiChat 
          userId={currentUser?.uid || 'anonymous'}
          apiBaseURL="http://localhost:8082"
        />
      </div>
    </div>
  );
};

export default ChatPage;
