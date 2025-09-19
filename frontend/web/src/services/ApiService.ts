import axios from 'axios';
import { AgentResponse, AgentInfo, API_CONFIG } from '../types';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || error.response.data?.message || 'Server error';
      toast.error(`API Error: ${message}`);
    } else if (error.request) {
      // Network error
      toast.error('Network error: Unable to connect to Travel Saathi');
    } else {
      // Other error
      toast.error('Unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export class ApiService {
  // Health check
  static async checkHealth(): Promise<{ status: string; service: string }> {
    const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH);
    return response.data;
  }

  // Get agent information
  static async getAgentInfo(): Promise<AgentInfo> {
    const response = await api.get(API_CONFIG.ENDPOINTS.INFO);
    return response.data;
  }

  // Chat with agent
  static async chatWithAgent(message: string, userId?: string): Promise<AgentResponse> {
    const payload = {
      message,
      ...(userId && { userId })
    };

    const response = await api.post(API_CONFIG.ENDPOINTS.CHAT, payload);
    return response.data;
  }

  // Stream chat with agent
  static async *streamChatWithAgent(message: string, userId?: string): AsyncGenerator<string, void, unknown> {
    const payload = {
      message,
      ...(userId && { userId })
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_STREAM}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          // Keep the last incomplete line in buffer
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'response') {
                  yield data.content;
                } else if (data.type === 'error') {
                  throw new Error(data.content);
                } else if (data.type === 'end') {
                  return;
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }

  // Test connection
  static async testConnection(): Promise<boolean> {
    try {
      await this.checkHealth();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export the axios instance for direct use if needed
export default api;
