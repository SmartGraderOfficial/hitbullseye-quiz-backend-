/**
 * Test script to specifically migrate Ms. Kashish Pratap after validation fix
 */

import fs from 'fs/promises';

const RAILWAY_API_URL = 'https://hitbullseye-quiz-backend-production.up.railway.app';

async function testKashishMigration() {
  try {
    console.log('🧪 Testing Ms. Kashish Pratap migration after validation fix...\n');
    
    // Read users.json
    const usersData = await fs.readFile('../../SmartGrader/users.json', 'utf8');
    const users = JSON.parse(usersData);
    
    // Find Ms. Kashish Pratap
    const kashishUser = users.find(user => user.NameOfStu === 'Ms. Kashish Pratap');
    
    if (!kashishUser) {
      console.log('❌ Ms. Kashish Pratap not found in users.json');
      return;
    }
    
    console.log('👤 Found user:', kashishUser.NameOfStu);
    console.log('🔑 Access Key:', kashishUser.AccessKey);
    console.log('🆔 Student ID:', kashishUser.StuID);
    
    // Test registration
    const response = await fetch(`${RAILWAY_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kashishUser)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! Ms. Kashish Pratap migrated successfully');
      console.log('📊 Response:', result);
    } else {
      console.log('\n❌ FAILED! Migration still failing');
      console.log('📊 Error:', result);
      console.log('🔍 Status:', response.status);
    }
    
  } catch (error) {
    console.error('💥 Error during test:', error.message);
  }
}

// Run the test
testKashishMigration();
