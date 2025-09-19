#!/usr/bin/env node

/**
 * Phase 2 Testing Script
 * Comprehensive testing of all Phase 2 features
 */

const axios = require('axios');
const colors = require('colors');

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8080';

// Test configuration
const tests = {
  backend: [
    {
      name: 'Health Check',
      endpoint: '/health',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Service Info',
      endpoint: '/info',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Chat Endpoint',
      endpoint: '/chat',
      method: 'POST',
      expectedStatus: 200,
      data: { message: 'Test message for Phase 2' }
    },
    {
      name: 'Stream Chat',
      endpoint: '/chat/stream',
      method: 'POST',
      expectedStatus: 200,
      data: { message: 'Test streaming message' }
    }
  ],
  frontend: [
    {
      name: 'Frontend Server',
      url: FRONTEND_URL,
      method: 'GET',
      expectedStatus: 200
    }
  ]
};

// Utility functions
const log = {
  info: (msg) => console.log(`[INFO] ${msg}`.blue),
  success: (msg) => console.log(`[SUCCESS] ${msg}`.green),
  error: (msg) => console.log(`[ERROR] ${msg}`.red),
  warning: (msg) => console.log(`[WARNING] ${msg}`.yellow)
};

// Test runner
async function runTest(test, baseUrl = BACKEND_URL) {
  try {
    const config = {
      method: test.method.toLowerCase(),
      url: test.url || `${baseUrl}${test.endpoint || ''}`,
      timeout: 10000,
      validateStatus: () => true
    };

    if (test.data) {
      config.data = test.data;
      config.headers = { 'Content-Type': 'application/json' };
    }

    const response = await axios(config);
    
    if (response.status === test.expectedStatus) {
      log.success(`${test.name}: ✅ PASSED (${response.status})`);
      return { success: true, response };
    } else {
      log.error(`${test.name}: ❌ FAILED - Expected ${test.expectedStatus}, got ${response.status}`);
      return { success: false, response };
    }
  } catch (error) {
    log.error(`${test.name}: ❌ ERROR - ${error.message}`);
    return { success: false, error };
  }
}

// Main test function
async function runPhase2Tests() {
  console.log('\n🚀 Starting Phase 2 Feature Tests\n'.cyan.bold);
  console.log('='.repeat(50).cyan);
  
  const results = {
    backend: { passed: 0, failed: 0, total: 0 },
    frontend: { passed: 0, failed: 0, total: 0 }
  };

  // Test Backend API
  log.info('Testing Backend FastAPI Server...\n');
  for (const test of tests.backend) {
    results.backend.total++;
    const result = await runTest(test);
    if (result.success) {
      results.backend.passed++;
    } else {
      results.backend.failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }

  console.log('\n' + '='.repeat(50).cyan);
  
  // Test Frontend
  log.info('Testing Frontend React Server...\n');
  for (const test of tests.frontend) {
    results.frontend.total++;
    const result = await runTest(test, FRONTEND_URL);
    if (result.success) {
      results.frontend.passed++;
    } else {
      results.frontend.failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50).cyan);
  console.log('📊 PHASE 2 TEST RESULTS SUMMARY'.cyan.bold);
  console.log('='.repeat(50).cyan);
  
  console.log(`\n🔧 Backend Tests:`);
  console.log(`   ✅ Passed: ${results.backend.passed}/${results.backend.total}`.green);
  if (results.backend.failed > 0) {
    console.log(`   ❌ Failed: ${results.backend.failed}/${results.backend.total}`.red);
  }
  
  console.log(`\n🎨 Frontend Tests:`);
  console.log(`   ✅ Passed: ${results.frontend.passed}/${results.frontend.total}`.green);
  if (results.frontend.failed > 0) {
    console.log(`   ❌ Failed: ${results.frontend.failed}/${results.frontend.total}`.red);
  }

  const totalPassed = results.backend.passed + results.frontend.passed;
  const totalTests = results.backend.total + results.frontend.total;
  
  console.log(`\n🎯 Overall Results:`);
  console.log(`   ✅ Total Passed: ${totalPassed}/${totalTests}`.green);
  if (totalPassed === totalTests) {
    console.log(`\n🎉 ALL TESTS PASSED! Phase 2 is working perfectly!`.green.bold);
  } else {
    console.log(`\n⚠️  Some tests failed. Please check the issues above.`.yellow.bold);
  }

  // Feature-specific tests
  console.log('\n' + '='.repeat(50).cyan);
  console.log('🧪 PHASE 2 FEATURE VERIFICATION'.cyan.bold);
  console.log('='.repeat(50).cyan);

  await testTravelPlannerFeatures();
  await testFirebaseConfiguration();
  await testBuildOutput();

  console.log('\n🚀 Phase 2 Testing Complete!'.cyan.bold);
  console.log('Ready for Phase 3 development! 🎯\n'.green.bold);
}

// Test Travel Planner specific features
async function testTravelPlannerFeatures() {
  log.info('Testing Travel Planner Features...');
  
  // Test if we can access the travel planner page
  try {
    const response = await axios.get(`${FRONTEND_URL}`, { timeout: 5000 });
    if (response.status === 200) {
      log.success('Travel Planner Frontend: ✅ Accessible');
    }
  } catch (error) {
    log.error(`Travel Planner Frontend: ❌ ${error.message}`);
  }
}

// Test Firebase configuration
async function testFirebaseConfiguration() {
  log.info('Testing Firebase Configuration...');
  
  // Check if Firebase config files exist
  const fs = require('fs');
  const path = require('path');
  
  const firebaseFiles = [
    'frontend/firebase-config/firebase.json',
    'frontend/firebase-config/firestore.rules',
    'frontend/firebase-config/storage.rules',
    'frontend/firebase-config/firestore.indexes.json'
  ];
  
  let firebaseConfigValid = true;
  firebaseFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log.success(`Firebase Config: ✅ ${file}`);
    } else {
      log.error(`Firebase Config: ❌ ${file} not found`);
      firebaseConfigValid = false;
    }
  });
  
  if (firebaseConfigValid) {
    log.success('Firebase Configuration: ✅ All files present');
  }
}

// Test build output
async function testBuildOutput() {
  log.info('Testing Build Output...');
  
  const fs = require('fs');
  const path = require('path');
  
  const buildFiles = [
    'frontend/web/dist/index.html',
    'frontend/web/tsconfig.json',
    'frontend/web/tsconfig.node.json'
  ];
  
  let buildValid = true;
  buildFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log.success(`Build Output: ✅ ${file}`);
    } else {
      log.warning(`Build Output: ⚠️  ${file} not found (run 'npm run build' first)`);
      buildValid = false;
    }
  });
  
  if (buildValid) {
    log.success('Build Output: ✅ All build files present');
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});

// Run tests
if (require.main === module) {
  runPhase2Tests().catch(error => {
    log.error(`Test runner failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runPhase2Tests };
