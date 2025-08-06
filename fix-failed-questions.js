/**
 * Fix and re-migrate failed questions
 * This script fixes the validation issues in questions 4 and 16
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'https://hitbullseye-quiz-backend-production.up.railway.app';
const ACCESS_KEY = '1222262587654321'; // Suraj's access key

/**
 * Fix validation issues in a question object
 */
function fixQuestionValidation(question) {
    const fixed = { ...question };
    
    // Fix directions - remove extra newlines
    if (fixed.directions) {
        fixed.directions = fixed.directions.trim().replace(/\n+/g, ' ');
    }
    
    // Fix options - convert images arrays to strings
    if (fixed.options && Array.isArray(fixed.options)) {
        fixed.options = fixed.options.map(option => {
            const fixedOption = { ...option };
            
            // Convert images array to string (take first URL)
            if (fixedOption.images && Array.isArray(fixedOption.images)) {
                fixedOption.images = fixedOption.images[0] || null;
            }
            
            return fixedOption;
        });
    }
    
    // Fix CorrectAns - convert images arrays to strings
    if (fixed.CorrectAns && Array.isArray(fixed.CorrectAns)) {
        fixed.CorrectAns = fixed.CorrectAns.map(answer => {
            const fixedAnswer = { ...answer };
            
            // Convert images array to string (take first URL)
            if (fixedAnswer.images && Array.isArray(fixedAnswer.images)) {
                fixedAnswer.images = fixedAnswer.images[0] || null;
            }
            
            return fixedAnswer;
        });
    }
    
    // Remove unsupported fields that might cause validation issues
    delete fixed.questionImages; // This field is not in the schema
    
    return fixed;
}

/**
 * Upload a single question to MongoDB via API
 */
async function uploadQuestion(question, questionIndex) {
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
            console.log(`✅ Question ${questionIndex} uploaded successfully`);
            return { success: true, result };
        } else {
            console.log(`❌ Question ${questionIndex} failed:`, result.message || result.error || 'Unknown error');
            if (result.details) {
                console.log('   Validation details:', result.details);
            }
            return { success: false, error: result };
        }
    } catch (error) {
        console.error(`❌ Question ${questionIndex} error:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Main function to fix and retry failed questions
 */
async function fixAndRetryQuestions() {
    console.log('🔧 Fixing and retrying failed questions...\n');
    
    // Read the original data
    const questionsPath = path.join(__dirname, '../../SmartGrader/data.json');
    const questionsData = fs.readFileSync(questionsPath, 'utf8');
    const questions = JSON.parse(questionsData);
    
    // Get the specific failing questions (indices 3 and 15 for questions 4 and 16)
    const failedQuestions = [
        { index: 3, number: 4 },
        { index: 15, number: 16 }
    ];
    
    console.log('📋 Analyzing failed questions:\n');
    
    for (const { index, number } of failedQuestions) {
        const originalQuestion = questions[index];
        
        console.log(`🔍 Question ${number} (index ${index}):`);
        console.log(`   Text: ${originalQuestion.questionText?.substring(0, 60)}...`);
        
        // Show original issues
        console.log('   Issues found:');
        if (originalQuestion.directions && originalQuestion.directions.includes('\n')) {
            console.log('   - Directions contains newline characters');
        }
        if (originalQuestion.options) {
            const hasArrayImages = originalQuestion.options.some(opt => Array.isArray(opt.images));
            if (hasArrayImages) {
                console.log('   - Options have images as arrays instead of strings');
            }
        }
        if (originalQuestion.CorrectAns) {
            const hasArrayImages = originalQuestion.CorrectAns.some(ans => Array.isArray(ans.images));
            if (hasArrayImages) {
                console.log('   - CorrectAns has images as arrays instead of strings');
            }
        }
        if (originalQuestion.questionImages) {
            console.log('   - Has unsupported questionImages field');
        }
        
        // Fix the question
        const fixedQuestion = fixQuestionValidation(originalQuestion);
        
        console.log('   Fixes applied:');
        console.log('   - Cleaned up directions');
        console.log('   - Converted image arrays to strings');
        console.log('   - Removed unsupported fields');
        
        // Try to upload the fixed question
        console.log(`   Uploading fixed question ${number}...`);
        const result = await uploadQuestion(fixedQuestion, number);
        
        if (result.success) {
            console.log(`   ✅ Question ${number} fixed and uploaded successfully!\n`);
        } else {
            console.log(`   ❌ Question ${number} still failing after fixes`);
            console.log('   Error details:', JSON.stringify(result.error, null, 2));
            
            // Show the fixed question structure for debugging
            console.log('   Fixed question structure:');
            console.log('   - directions:', typeof fixedQuestion.directions, fixedQuestion.directions?.length, 'chars');
            console.log('   - options[0].images:', typeof fixedQuestion.options?.[0]?.images);
            console.log('   - CorrectAns[0].images:', typeof fixedQuestion.CorrectAns?.[0]?.images);
            console.log('');
        }
        
        // Wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('🎯 Fix and retry completed!');
}

// Run the fix
console.log('='.repeat(60));
console.log('     FIXING FAILED QUESTIONS VALIDATION ISSUES');
console.log('='.repeat(60));

fixAndRetryQuestions().catch(error => {
    console.error('\n💥 Fix script error:', error);
    process.exit(1);
});
