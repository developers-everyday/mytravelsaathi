import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Plane, MessageSquare, Calendar, User, TrendingUp, Clock } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();

  const quickActions = [
    {
      title: 'Start Chatting',
      description: 'Chat with your Travel Saathi AI assistant',
      icon: MessageSquare,
      link: '/chat',
      color: 'bg-blue-500'
    },
    {
      title: 'View Bookings',
      description: 'Manage your current and past bookings',
      icon: Calendar,
      link: '/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'Update Profile',
      description: 'Manage your travel preferences',
      icon: User,
      link: '/profile',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    { label: 'Trips Planned', value: '3', icon: Plane, color: 'text-blue-600' },
    { label: 'Hotels Booked', value: '2', icon: Calendar, color: 'text-green-600' },
    { label: 'Chat Sessions', value: '12', icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Days Traveling', value: '15', icon: TrendingUp, color: 'text-orange-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.displayName || 'Traveler'}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to plan your next adventure? Your Travel Saathi is here to help.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${action.color}`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Chats */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Chats</h2>
            <Link to="/chat" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { message: "Help me find hotels in Goa", time: "2 hours ago" },
              { message: "What's the weather like in Switzerland?", time: "1 day ago" },
              { message: "Plan a family trip for 4 people", time: "3 days ago" }
            ].map((chat, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{chat.message}</p>
                  <p className="text-xs text-gray-500">{chat.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Travel Preferences</h2>
            <Link to="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Edit
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Budget Range</span>
              <span className="text-sm font-medium text-gray-900">
                {userProfile?.travelPreferences.budgetRange || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Travel Style</span>
              <span className="text-sm font-medium text-gray-900">
                {userProfile?.travelPreferences.travelStyle || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Preferred Destinations</span>
              <span className="text-sm font-medium text-gray-900">
                {userProfile?.travelPreferences.preferredDestinations.length || 0} set
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mt-8 card bg-gradient-travel text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Ready to start planning?</h2>
            <p className="opacity-90">Chat with your Travel Saathi to begin planning your next trip.</p>
          </div>
          <Link
            to="/chat"
            className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Start Chatting
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
