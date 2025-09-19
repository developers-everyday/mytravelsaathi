import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { ApiService } from '../services/ApiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Add welcome message
  useEffect(() => {
    if (messages.length === 0 && currentUser) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        message: "Hello! I'm your Travel Saathi 🧳. I can help you plan trips, search for hotels, make bookings, and answer any travel-related questions. How can I assist you today?",
        sender: 'agent',
        timestamp: new Date(),
        userId: currentUser.uid
      };
      setMessages([welcomeMessage]);
    }
  }, [currentUser, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      userId: currentUser?.uid || ''
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);

    try {
      // Add loading message
      const loadingMessage: ChatMessage = {
        id: `loading-${Date.now()}`,
        message: '',
        sender: 'agent',
        timestamp: new Date(),
        userId: currentUser?.uid || ''
      };
      setMessages(prev => [...prev, loadingMessage]);

      // Stream response
      let agentResponse = '';
      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        message: '',
        sender: 'agent',
        timestamp: new Date(),
        userId: currentUser?.uid || ''
      };

      try {
        for await (const chunk of ApiService.streamChatWithAgent(inputMessage, currentUser?.uid)) {
          agentResponse += chunk;
          agentMessage.message = agentResponse;
          
          // Update the last message (loading message becomes agent message)
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { ...agentMessage };
            return newMessages;
          });
        }
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        
        // Fallback to regular chat
        const response = await ApiService.chatWithAgent(inputMessage, currentUser?.uid);
        agentMessage.message = response.response;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...agentMessage };
          return newMessages;
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from Travel Saathi');
      
      // Remove loading message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickMessage = (message: string) => {
    setInputMessage(message);
    inputRef.current?.focus();
  };

  const quickMessages = [
    "Help me plan a trip to Goa",
    "Show me hotels in Switzerland",
    "I need family-friendly accommodations",
    "What's my budget range for luxury hotels?",
    "Book a hotel for 2 people"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-travel rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Travel Saathi Chat</h1>
            <p className="text-gray-600">Your AI travel assistant</p>
          </div>
        </div>

        {/* Quick Messages */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Quick start:</p>
            <div className="flex flex-wrap gap-2">
              {quickMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickMessage(message)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 mb-4 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-travel'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                <div className={`px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  {message.message || (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Travel Saathi is thinking...</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about travel planning..."
            className="flex-1 input-field"
            disabled={isLoading || isStreaming}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || isStreaming}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Send</span>
          </button>
        </div>

        {isStreaming && (
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Travel Saathi is responding...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
