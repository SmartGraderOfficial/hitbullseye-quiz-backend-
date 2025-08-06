/**
 * Data Migration Script - Upload users.json to MongoDB Atlas
 * 
 * This script uploads all users from the local users.json file
 * to your MongoDB Atlas database via the Railway API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Replace with your actual Railway URL
const API_BASE_URL = 'https://hitbullseye-quiz-backend-production.up.railway.app';

/**
 * Read users from local JSON file
 */
function readUsersFromJSON() {
    try {
        const usersPath = path.join(__dirname, '../../SmartGrader/users.json');
        console.log('Looking for users.json at:', usersPath);
        
        const usersData = fs.readFileSync(usersPath, 'utf8');
        return JSON.parse(usersData);
    } catch (error) {
        console.error('Error reading users.json:', error);
        console.error('Make sure users.json exists in the SmartGrader folder');
        return [];
    }
}

/**
 * Upload a single user to MongoDB via API
 */
async function uploadUser(user) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                NameOfStu: user.NameOfStu,
                StuID: user.StuID,
                AccessKey: user.AccessKey
            })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            console.log(`✅ User uploaded: ${user.NameOfStu} (${user.StuID})`);
            return true;
        } else {
            console.log(`❌ Failed to upload ${user.NameOfStu}: ${result.message || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error uploading ${user.NameOfStu}:`, error.message);
        return false;
    }
}

/**
 * Test API connection
 */
async function testAPIConnection() {
    try {
        console.log('🔍 Testing API connection...');
        const response = await fetch(`${API_BASE_URL}/health`);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ API connection successful:', result.message);
            return true;
        } else {
            console.log('❌ API connection failed. Status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Cannot connect to API:', error.message);
        console.error('Make sure your Railway URL is correct and the API is running');
        return false;
    }
}

/**
 * Main migration function
 */
async function migrateUsers() {
    console.log('🚀 Starting user migration to MongoDB Atlas...\n');
    
    // Test API connection first
    const apiConnected = await testAPIConnection();
    if (!apiConnected) {
        console.log('\n❌ Migration aborted due to API connection issues');
        console.log('Please check your Railway URL and try again');
        return;
    }
    
    const users = readUsersFromJSON();
    
    if (users.length === 0) {
        console.log('❌ No users found to migrate');
        return;
    }
    
    console.log(`\n📋 Found ${users.length} users in users.json`);
    console.log('Users to migrate:');
    users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.NameOfStu} (${user.StuID}) - AccessKey: ${user.AccessKey}`);
    });
    console.log('\n🔄 Starting upload...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const user of users) {
        const success = await uploadUser(user);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully uploaded: ${successCount} users`);
    console.log(`❌ Failed to upload: ${failCount} users`);
    console.log(`📈 Success rate: ${((successCount / users.length) * 100).toFixed(1)}%`);
    
    if (successCount === users.length) {
        console.log('\n🎉 All users migrated successfully!');
        console.log('Your users.json data is now in MongoDB Atlas');
    } else if (successCount > 0) {
        console.log('\n⚠️  Partial migration completed');
        console.log('Some users may already exist in the database');
    } else {
        console.log('\n❌ Migration failed');
        console.log('Please check your Railway API and try again');
    }
}

// Run the migration
console.log('='.repeat(60));
console.log('       USERS MIGRATION TO MONGODB ATLAS');
console.log('='.repeat(60));

migrateUsers().catch(error => {
    console.error('\n💥 Migration script error:', error);
    process.exit(1);
});
