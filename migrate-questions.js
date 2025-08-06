/**
 * Data Migration Script - Upload data.json to MongoDB Atlas
 * 
 * This script uploads all questions from the local data.json file
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

// You'll need one of your access keys for authentication
const ACCESS_KEY = '1222262587654321'; // Suraj's access key from users.json

/**
 * Read questions from local JSON file
 */
function readQuestionsFromJSON() {
    try {
        const questionsPath = path.join(__dirname, '../../SmartGrader/data.json');
        console.log('Looking for data.json at:', questionsPath);
        
        const questionsData = fs.readFileSync(questionsPath, 'utf8');
        return JSON.parse(questionsData);
    } catch (error) {
        console.error('Error reading data.json:', error);
        console.error('Make sure data.json exists in the SmartGrader folder');
        return [];
    }
}

/**
 * Upload a single question to MongoDB via API
 */
async function uploadQuestion(question, index) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/quiz/create`, {
            method: 'POST',
            headers: {
                'Authorization': `AccessKey ${ACCESS_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            const questionText = question.questionText || question.question || 'Unknown question';
            console.log(`✅ Question ${index + 1} uploaded: ${questionText.substring(0, 50)}...`);
            return true;
        } else {
            console.log(`❌ Failed to upload question ${index + 1}: ${result.message || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error uploading question ${index + 1}:`, error.message);
        return false;
    }
}

/**
 * Test API connection and authentication
 */
async function testAPIConnection() {
    try {
        console.log('🔍 Testing API connection...');
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        
        if (!healthResponse.ok) {
            console.log('❌ API health check failed. Status:', healthResponse.status);
            return false;
        }
        
        console.log('✅ API health check passed');
        
        // Test authentication
        console.log('🔐 Testing authentication...');
        const authResponse = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                AccessKey: ACCESS_KEY
            })
        });
        
        if (authResponse.ok) {
            const authResult = await authResponse.json();
            if (authResult.success) {
                console.log('✅ Authentication successful');
                return true;
            }
        }
        
        console.log('❌ Authentication failed');
        return false;
        
    } catch (error) {
        console.error('❌ Cannot connect to API:', error.message);
        console.error('Make sure your Railway URL is correct and the API is running');
        return false;
    }
}

/**
 * Main migration function
 */
async function migrateQuestions() {
    console.log('🚀 Starting questions migration to MongoDB Atlas...\n');
    
    // Test API connection first
    const apiConnected = await testAPIConnection();
    if (!apiConnected) {
        console.log('\n❌ Migration aborted due to API connection or authentication issues');
        console.log('Please check:');
        console.log('1. Your Railway URL is correct');
        console.log('2. The API is running');
        console.log('3. Users have been migrated first (for authentication)');
        return;
    }
    
    const questions = readQuestionsFromJSON();
    
    if (questions.length === 0) {
        console.log('❌ No questions found to migrate');
        return;
    }
    
    console.log(`\n📋 Found ${questions.length} questions in data.json`);
    console.log('Sample questions:');
    questions.slice(0, 3).forEach((question, index) => {
        const questionText = question.questionText || question.question || 'Unknown question';
        console.log(`  ${index + 1}. ${questionText.substring(0, 80)}...`);
    });
    console.log(`  ... and ${questions.length - 3} more questions\n`);
    
    console.log('🔄 Starting upload (this may take several minutes)...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const success = await uploadQuestion(question, i);
        
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Progress indicator
        if ((i + 1) % 50 === 0) {
            console.log(`📊 Progress: ${i + 1}/${questions.length} questions processed (${successCount} successful, ${failCount} failed)`);
        }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully uploaded: ${successCount} questions`);
    console.log(`❌ Failed to upload: ${failCount} questions`);
    console.log(`📈 Success rate: ${((successCount / questions.length) * 100).toFixed(1)}%`);
    
    if (successCount === questions.length) {
        console.log('\n🎉 All questions migrated successfully!');
        console.log('Your data.json is now in MongoDB Atlas');
    } else if (successCount > 0) {
        console.log('\n⚠️  Partial migration completed');
        console.log('Some questions may have failed due to validation or duplicate data');
    } else {
        console.log('\n❌ Migration failed');
        console.log('Please check your Railway API and try again');
    }
}

// Run the migration
console.log('='.repeat(60));
console.log('      QUESTIONS MIGRATION TO MONGODB ATLAS');
console.log('='.repeat(60));

migrateQuestions().catch(error => {
    console.error('\n💥 Migration script error:', error);
    process.exit(1);
});
