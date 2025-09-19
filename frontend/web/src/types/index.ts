// TypeScript types for My Travel Saathi Frontend

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  travelPreferences: TravelPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelPreferences {
  preferredDestinations: string[];
  budgetRange: 'budget' | 'mid-range' | 'luxury';
  travelStyle: 'solo' | 'couple' | 'family' | 'business';
  interests: string[];
  accommodationTypes: string[];
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  userId: string;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: number;
  hotelName: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface AgentResponse {
  response: string;
  status: string;
}

export interface AgentInfo {
  name: string;
  description: string;
  model: string;
  tools_count: number;
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app',
  ENDPOINTS: {
    HEALTH: '/health',
    INFO: '/info',
    CHAT: '/chat',
    CHAT_STREAM: '/chat/stream',
    DOCS: '/docs'
  }
} as const;
