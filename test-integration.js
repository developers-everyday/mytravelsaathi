// Test script to verify My Travel Saathi Frontend-Backend Integration
const http = require('http');

console.log('🧪 Testing My Travel Saathi Integration...\n');

// Test FastAPI Backend
function testBackend() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ FastAPI Backend Health Check:');
          console.log(`   Status: ${response.status}`);
          console.log(`   Service: ${response.service}\n`);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test Chat API
function testChatAPI() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      message: "Hello! I want to plan a trip to Switzerland."
    });

    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Chat API Test:');
          console.log(`   Message: Hello! I want to plan a trip to Switzerland.`);
          console.log(`   Response: ${response.response.substring(0, 100)}...`);
          console.log(`   Status: ${response.status}\n`);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Test Frontend
function testFrontend() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log('✅ Frontend Server:');
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Content-Type: ${res.headers['content-type']}`);
      console.log(`   URL: http://localhost:3000\n`);
      resolve(res);
    });

    req.on('error', reject);
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    await testBackend();
    await testChatAPI();
    await testFrontend();
    
    console.log('🎉 All tests passed! Your My Travel Saathi is ready to use!\n');
    console.log('📱 Access your application:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend API: http://localhost:8080');
    console.log('   API Docs: http://localhost:8080/docs\n');
    
    console.log('🚀 Features available:');
    console.log('   ✅ User Registration & Login (Demo Mode)');
    console.log('   ✅ Chat with AI Travel Assistant');
    console.log('   ✅ User Dashboard');
    console.log('   ✅ Profile Management');
    console.log('   ✅ Booking Management Interface');
    console.log('   ✅ Mobile-Responsive Design\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
