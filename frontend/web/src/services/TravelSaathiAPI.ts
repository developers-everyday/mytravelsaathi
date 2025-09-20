export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: Date;
}

export interface SessionData {
  id: string;
  userId: string;
  createdAt: string;
}

export interface StreamingResponse {
  content?: {
    parts: Array<{ text: string }>;
    role: string;
  };
  partial?: boolean;
  finishReason?: string;
  usageMetadata?: {
    candidatesTokenCount?: number;
    promptTokenCount?: number;
    totalTokenCount?: number;
  };
  id: string;
  timestamp: number;
}

export class TravelSaathiAPI {
  private baseURL: string;
  private userId: string;
  private sessionId: string | null = null;

  constructor(baseURL: string = 'http://localhost:8082', userId: string = 'user123') {
    this.baseURL = baseURL;
    this.userId = userId;
  }

  /**
   * Create a new session for the user
   */
  async createSession(): Promise<SessionData> {
    try {
      const response = await fetch(`${this.baseURL}/apps/main_agent/users/${this.userId}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      const sessionData = await response.json();
      this.sessionId = sessionData.id;
      return sessionData;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Send a message to the agent and get streaming response
   */
  async sendMessage(
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (!this.sessionId) {
      try {
        await this.createSession();
      } catch (error) {
        onError(error as Error);
        return;
      }
    }

    try {
      const response = await fetch(`${this.baseURL}/run_sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appName: 'main_agent',
          userId: this.userId,
          sessionId: this.sessionId,
          newMessage: {
            parts: [{ text: message }],
            role: 'user'
          },
          streaming: true
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamingResponse = JSON.parse(line.slice(6));
              
              if (data.content?.parts?.[0]?.text) {
                const textChunk = data.content.parts[0].text;
                fullResponse += textChunk;
                onChunk(textChunk);
              }

              if (data.finishReason === 'STOP') {
                onComplete(fullResponse);
                return;
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
      }

      onComplete(fullResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      onError(error as Error);
    }
  }

  /**
   * Get session info
   */
  async getSessionInfo(): Promise<SessionData | null> {
    if (!this.sessionId) return null;

    try {
      const response = await fetch(`${this.baseURL}/apps/main_agent/users/${this.userId}/sessions/${this.sessionId}`);
      if (!response.ok) {
        throw new Error(`Failed to get session info: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting session info:', error);
      return null;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/list-apps`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
    this.sessionId = null; // Reset session when user changes
  }
}
