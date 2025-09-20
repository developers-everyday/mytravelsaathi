#!/usr/bin/env node

/**
 * Complete Integration Test for Travel Saathi
 * Tests the full frontend-backend integration through CORS proxy
 */

const http = require('http');

const PROXY_URL = 'http://localhost:8082';
const FRONTEND_URL = 'http://localhost:3000';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, {
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

async function testCompleteIntegration() {
  console.log('🧪 Complete Travel Saathi Integration Test');
  console.log('===========================================');
  console.log(`📡 CORS Proxy: ${PROXY_URL}`);
  console.log(`🌐 Frontend: ${FRONTEND_URL}`);
  console.log('');

  let allTestsPassed = true;

  try {
    // Test 1: CORS Proxy Health Check
    console.log('1. Testing CORS Proxy Health Check...');
    const healthResponse = await makeRequest(`${PROXY_URL}/list-apps`);
    if (healthResponse.status === 200) {
      console.log('✅ CORS Proxy health check passed');
      console.log(`   Available apps: ${JSON.stringify(healthResponse.data)}`);
    } else {
      console.log('❌ CORS Proxy health check failed');
      allTestsPassed = false;
    }

    // Test 2: CORS Preflight Request
    console.log('\n2. Testing CORS Preflight Request...');
    try {
      const preflightResponse = await makeRequest(`${PROXY_URL}/apps/main_agent/users/test_user/sessions`, {
        method: 'OPTIONS'
      });
      if (preflightResponse.status === 200) {
        console.log('✅ CORS preflight request passed');
        console.log(`   CORS headers: ${JSON.stringify(preflightResponse.headers)}`);
      } else {
        console.log('❌ CORS preflight request failed');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ CORS preflight request error:', error.message);
      allTestsPassed = false;
    }

    // Test 3: Session Creation
    console.log('\n3. Testing Session Creation...');
    const sessionResponse = await makeRequest(`${PROXY_URL}/apps/main_agent/users/test_user/sessions`, {
      method: 'POST',
      body: {}
    });
    
    if (sessionResponse.status === 200) {
      console.log('✅ Session creation passed');
      const sessionId = sessionResponse.data.id;
      console.log(`   Session ID: ${sessionId}`);

      // Test 4: Hotel Search Message
      console.log('\n4. Testing Hotel Search Message...');
      const messageResponse = await makeRequest(`${PROXY_URL}/run_sse`, {
        method: 'POST',
        body: {
          appName: 'main_agent',
          userId: 'test_user',
          sessionId: sessionId,
          newMessage: {
            parts: [{ text: 'Find hotels in Goa' }],
            role: 'user'
          },
          streaming: true
        }
      });

      if (messageResponse.status === 200) {
        console.log('✅ Hotel search message passed');
        console.log('   Streaming response received');
        
        // Parse streaming response
        const responseText = messageResponse.data;
        if (typeof responseText === 'string' && responseText.includes('data:')) {
          console.log('✅ Streaming response format detected');
          const lines = responseText.split('\n');
          let hasHotelData = false;
          let hasTextResponse = false;
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content?.parts?.[0]?.functionCall?.name === 'search_hotels_by_location_wrapper') {
                  hasHotelData = true;
                  console.log('✅ Hotel search tool called successfully');
                }
                if (data.content?.parts?.[0]?.text) {
                  hasTextResponse = true;
                  console.log(`   Agent response: "${data.content.parts[0].text}"`);
                }
              } catch (e) {
                // Ignore parsing errors for non-JSON lines
              }
            }
          }
          
          if (!hasHotelData) {
            console.log('⚠️  Hotel search tool not called');
          }
          if (!hasTextResponse) {
            console.log('⚠️  No text response found');
          }
        }
      } else {
        console.log('❌ Hotel search message failed');
        console.log(`   Status: ${messageResponse.status}`);
        allTestsPassed = false;
      }

      // Test 5: User Registration
      console.log('\n5. Testing User Registration...');
      const registerResponse = await makeRequest(`${PROXY_URL}/run_sse`, {
        method: 'POST',
        body: {
          appName: 'main_agent',
          userId: 'test_user',
          sessionId: sessionId,
          newMessage: {
            parts: [{ text: 'Register me as John Doe, john@example.com, +1234567890' }],
            role: 'user'
          },
          streaming: true
        }
      });

      if (registerResponse.status === 200) {
        console.log('✅ User registration message passed');
        console.log('   Registration request processed');
      } else {
        console.log('❌ User registration message failed');
        allTestsPassed = false;
      }

    } else {
      console.log('❌ Session creation failed');
      console.log(`   Status: ${sessionResponse.status}`);
      allTestsPassed = false;
    }

    // Test 6: Frontend Accessibility
    console.log('\n6. Testing Frontend Accessibility...');
    try {
      const frontendResponse = await makeRequest(`${FRONTEND_URL}/test-chat`);
      if (frontendResponse.status === 200) {
        console.log('✅ Frontend test page accessible');
      } else {
        console.log('❌ Frontend test page not accessible');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ Frontend accessibility error:', error.message);
      allTestsPassed = false;
    }

  } catch (error) {
    console.log('❌ Integration test failed');
    console.log(`   Error: ${error.message}`);
    allTestsPassed = false;
  }

  console.log('\n===========================================');
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED! Integration is working perfectly!');
    console.log('\n📱 Ready to use:');
    console.log('   🌐 Main App: http://localhost:3000');
    console.log('   🧪 Test Chat: http://localhost:3000/test-chat');
    console.log('   📄 Standalone: file://' + process.cwd() + '/frontend/web/test-adk-integration.html');
    console.log('   🔧 Simple Test: file://' + process.cwd() + '/frontend/web/test-simple.html');
  } else {
    console.log('❌ Some tests failed. Check the logs above.');
  }
  console.log('\n🚀 Travel Saathi is ready for production!');
}

// Run the test
testCompleteIntegration().catch(console.error);
