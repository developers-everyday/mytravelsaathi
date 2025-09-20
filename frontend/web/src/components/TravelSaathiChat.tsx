import React, { useState, useEffect, useRef } from 'react';
import { TravelSaathiAPI, ChatMessage } from '../services/TravelSaathiAPI';

interface TravelSaathiChatProps {
  userId?: string;
  apiBaseURL?: string;
  className?: string;
}

export const TravelSaathiChat: React.FC<TravelSaathiChatProps> = ({
  userId = 'user123',
  apiBaseURL = 'http://localhost:8081',
  className = ''
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<TravelSaathiAPI | null>(null);

  // Initialize API and check connection
  useEffect(() => {
    const initializeAPI = async () => {
      try {
        apiRef.current = new TravelSaathiAPI(apiBaseURL, userId);
        const isHealthy = await apiRef.current.healthCheck();
        setIsConnected(isHealthy);
        
        if (isHealthy) {
          // Add welcome message
          setMessages([{
            role: 'assistant',
            text: 'Hello! I\'m your Travel Saathi 🧳. I can help you with hotel bookings, travel planning, and finding great places to visit. How can I assist you today?',
            timestamp: new Date()
          }]);
        } else {
          setError('Unable to connect to Travel Saathi service. Please check if the server is running.');
        }
      } catch (err) {
        console.error('Failed to initialize API:', err);
        setError('Failed to connect to Travel Saathi service.');
        setIsConnected(false);
      }
    };

    initializeAPI();
  }, [apiBaseURL, userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiRef.current || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: inputMessage.trim(),
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setCurrentResponse('');
    setError(null);

    try {
      await apiRef.current.sendMessage(
        userMessage.text,
        // onChunk - handle streaming response chunks
        (chunk: string) => {
          setCurrentResponse(prev => prev + chunk);
        },
        // onComplete - handle complete response
        (fullResponse: string) => {
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            text: fullResponse,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          setCurrentResponse('');
          setIsLoading(false);
        },
        // onError - handle errors
        (error: Error) => {
          console.error('Chat error:', error);
          setError(`Error: ${error.message}`);
          setIsLoading(false);
          setCurrentResponse('');
        }
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      setIsLoading(false);
      setCurrentResponse('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(false);
    setCurrentResponse('');
  };

  return (
    <div className={`travel-saathi-chat ${className}`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Travel Saathi 🧳</h2>
            <p className="text-sm opacity-90">
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
          <div className="text-sm">
            Session: {apiRef.current?.getCurrentSessionId()?.slice(0, 8) || 'None'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50 border-x">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              {message.timestamp && (
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Current streaming response */}
        {currentResponse && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white text-gray-800 border">
              <p className="whitespace-pre-wrap">{currentResponse}</p>
              <div className="flex items-center mt-1">
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-1" style={{ animationDelay: '0.2s' }}></div>
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-red-100 text-red-800 border border-red-200">
              <p>{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-b border-x rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Ask about hotels, bookings, or travel..." : "Connecting..."}
            disabled={!isConnected || isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        
        {/* Quick action buttons */}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setInputMessage('Find hotels in Goa')}
            disabled={!isConnected || isLoading}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            Hotels in Goa
          </button>
          <button
            onClick={() => setInputMessage('Show my bookings')}
            disabled={!isConnected || isLoading}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            My Bookings
          </button>
          <button
            onClick={() => setInputMessage('Find restaurants near me')}
            disabled={!isConnected || isLoading}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            Restaurants
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelSaathiChat;
