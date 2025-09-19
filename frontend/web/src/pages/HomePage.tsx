import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Plane, MessageSquare, Shield, Zap, Users, Globe } from 'lucide-react';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: MessageSquare,
      title: 'AI-Powered Chat',
      description: 'Chat with your personal travel assistant powered by Google Gemini'
    },
    {
      icon: Plane,
      title: 'Trip Planning',
      description: 'Get personalized recommendations for destinations, hotels, and activities'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Book hotels and manage your travel plans with confidence'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications and updates about your travel plans'
    }
  ];

  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '1000+' },
    { icon: Globe, label: 'Destinations', value: '50+' },
    { icon: Plane, label: 'Trips Planned', value: '5000+' },
    { icon: Shield, label: 'Secure Bookings', value: '100%' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Personal{' '}
            <span 
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Travel Saathi
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered travel assistant that helps you plan, book, and manage your perfect trip.
            From dream destinations to memorable experiences.
          </p>
          
          {currentUser ? (
            <div className="flex justify-center space-x-4">
              <Link to="/chat" className="btn-primary text-lg px-8 py-3">
                Start Chatting
              </Link>
              <Link to="/dashboard" className="btn-secondary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white rounded-2xl shadow-lg">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Travel Saathi?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-travel rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Travelers Worldwide
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-travel rounded-2xl text-white text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who trust Travel Saathi for their trip planning needs.
          </p>
          
          {currentUser ? (
            <Link to="/chat" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg transition-colors">
              Start Planning Now
            </Link>
          ) : (
            <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg transition-colors">
              Get Started Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
