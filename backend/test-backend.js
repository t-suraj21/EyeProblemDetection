/**
 * Simple test script for the Eye Problem Detection Backend
 * Run with: node test-backend.js
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing Eye Problem Detection Backend...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Get Upload Stats
    console.log('2. Testing Upload Stats...');
    const statsResponse = await axios.get(`${BASE_URL}/api/upload/stats`);
    console.log('✅ Upload Stats:', statsResponse.data);
    console.log('');

    // Test 3: Get Scan Stats
    console.log('3. Testing Scan Stats...');
    const scanStatsResponse = await axios.get(`${BASE_URL}/api/result/stats/overview`);
    console.log('✅ Scan Stats:', scanStatsResponse.data);
    console.log('');

    // Test 4: Get Doctors (Mumbai)
    console.log('4. Testing Doctor Search...');
    const doctorsResponse = await axios.get(`${BASE_URL}/api/doctors/city/mumbai`);
    console.log('✅ Doctors in Mumbai:', doctorsResponse.data);
    console.log('');

    // Test 5: Get Suggestions
    console.log('5. Testing Suggestions...');
    const suggestionsResponse = await axios.get(`${BASE_URL}/api/suggestions/Diabetic%20Retinopathy`);
    console.log('✅ Suggestions for Diabetic Retinopathy:', suggestionsResponse.data);
    console.log('');

    console.log('🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   npm run dev');
    }
  }
}

// Run the test
testBackend(); 