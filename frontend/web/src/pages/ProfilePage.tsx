import React from 'react';
import { useAuth } from '../services/AuthContext';
import { User, MapPin, Settings } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-travel rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your travel preferences and account information</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={currentUser?.displayName || ''}
                  className="input-field"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  className="input-field"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userProfile?.phone || ''}
                  className="input-field"
                  placeholder="Add your phone number"
                />
              </div>
            </div>
          </div>

          {/* Travel Preferences */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Travel Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range
                </label>
                <select className="input-field">
                  <option value="budget">Budget</option>
                  <option value="mid-range" selected>Mid-Range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Style
                </label>
                <select className="input-field">
                  <option value="solo">Solo</option>
                  <option value="couple">Couple</option>
                  <option value="family" selected>Family</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="btn-primary">
            <Settings className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
