#!/usr/bin/env node

// Simple integration test for Travel Saathi ADK API
const https = require('https');
const http = require('http');

const API_BASE_URL = 'http://localhost:8081';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testIntegration() {
  console.log('🧪 Testing Travel Saathi ADK Integration');
  console.log('==========================================');

  try {
    // Test 1: Health Check
    console.log('\n1. Testing health check...');
    const healthResponse = await makeRequest(`${API_BASE_URL}/list-apps`);
    if (healthResponse.status === 200) {
      console.log('✅ Health check passed');
      console.log(`   Available apps: ${JSON.stringify(healthResponse.data)}`);
    } else {
      console.log('❌ Health check failed');
      return;
    }

    // Test 2: Create Session
    console.log('\n2. Creating session...');
    const sessionResponse = await makeRequest(`${API_BASE_URL}/apps/main_agent/users/test_user/sessions`, {
      method: 'POST',
      body: {}
    });
    
    if (sessionResponse.status === 200) {
      console.log('✅ Session created successfully');
      const sessionId = sessionResponse.data.id;
      console.log(`   Session ID: ${sessionId}`);

      // Test 3: Send Message
      console.log('\n3. Sending test message...');
      const messageResponse = await makeRequest(`${API_BASE_URL}/run_sse`, {
        method: 'POST',
        body: {
          appName: 'main_agent',
          userId: 'test_user',
          sessionId: sessionId,
          newMessage: {
            parts: [{ text: 'Hello! Can you help me find hotels in Goa?' }],
            role: 'user'
          },
          streaming: true
        }
      });

      if (messageResponse.status === 200) {
        console.log('✅ Message sent successfully');
        console.log('   Response received (streaming data)');
        
        // Parse streaming response
        const responseText = messageResponse.data;
        if (typeof responseText === 'string' && responseText.includes('data:')) {
          console.log('✅ Streaming response format detected');
          const lines = responseText.split('\n');
          let hasContent = false;
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content?.parts?.[0]?.text) {
                  hasContent = true;
                  console.log(`   Agent response: "${data.content.parts[0].text}"`);
                  break;
                }
              } catch (e) {
                // Ignore parsing errors for non-JSON lines
              }
            }
          }
          if (!hasContent) {
            console.log('⚠️  No text content found in streaming response');
          }
        }
      } else {
        console.log('❌ Message sending failed');
        console.log(`   Status: ${messageResponse.status}`);
        console.log(`   Response: ${JSON.stringify(messageResponse.data)}`);
      }
    } else {
      console.log('❌ Session creation failed');
      console.log(`   Status: ${sessionResponse.status}`);
      console.log(`   Response: ${JSON.stringify(sessionResponse.data)}`);
    }

  } catch (error) {
    console.log('❌ Integration test failed');
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n==========================================');
  console.log('🎯 Integration test completed');
  console.log('\n📱 Frontend URLs:');
  console.log('   Main App: http://localhost:3000');
  console.log('   Test Chat: http://localhost:3000/test-chat');
  console.log('   Standalone: file://' + process.cwd() + '/frontend/web/test-adk-integration.html');
}

// Run the test
testIntegration().catch(console.error);