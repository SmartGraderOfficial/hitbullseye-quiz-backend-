/**
 * Complete Migration Script - Upload both users.json and data.json to MongoDB Atlas
 * 
 * This script runs both migrations in the correct order:
 * 1. Migrate users first (needed for authentication)
 * 2. Migrate questions second (requires authentication)
 */

import { spawn } from 'child_process';
import path from 'path';

/**
 * Run a migration script and wait for completion
 */
function runMigrationScript(scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`\n🚀 Starting ${scriptName}...\n`);
        
        const child = spawn('node', [scriptName], {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅ ${scriptName} completed successfully\n`);
                resolve();
            } else {
                console.log(`\n❌ ${scriptName} failed with exit code ${code}\n`);
                reject(new Error(`${scriptName} failed`));
            }
        });
        
        child.on('error', (error) => {
            console.error(`\n❌ Error running ${scriptName}:`, error.message);
            reject(error);
        });
    });
}

/**
 * Main migration function
 */
async function runCompleteDataMigration() {
    console.log('='.repeat(70));
    console.log('         COMPLETE DATA MIGRATION TO MONGODB ATLAS');
    console.log('='.repeat(70));
    console.log('\nThis will migrate:');
    console.log('1. users.json → MongoDB Atlas (via Railway API)');
    console.log('2. data.json → MongoDB Atlas (via Railway API)');
    console.log('\nMake sure you have:');
    console.log('✓ Updated the Railway URL in both migration scripts');
    console.log('✓ Railway API is running and accessible');
    console.log('✓ MongoDB Atlas is connected to Railway');
    console.log('\nStarting migration in 3 seconds...\n');
    
    // Give user time to read
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
        // Step 1: Migrate users first
        await runMigrationScript('migrate-users.js');
        
        // Wait a bit between migrations
        console.log('⏳ Waiting 5 seconds before starting questions migration...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Step 2: Migrate questions
        await runMigrationScript('migrate-questions.js');
        
        // Success summary
        console.log('='.repeat(70));
        console.log('🎉 COMPLETE MIGRATION SUCCESSFUL!');
        console.log('='.repeat(70));
        console.log('\n✅ All data migrated to MongoDB Atlas:');
        console.log('   • Users from users.json');
        console.log('   • Questions from data.json');
        console.log('\n🔧 Next steps:');
        console.log('   1. Update your Chrome extension with the Railway URL');
        console.log('   2. Test the extension with live MongoDB data');
        console.log('   3. Your system is now fully cloud-based!');
        console.log('\n🌐 Your SmartGrader system is production-ready!');
        
    } catch (error) {
        console.log('='.repeat(70));
        console.log('❌ MIGRATION FAILED');
        console.log('='.repeat(70));
        console.error('\n💥 Migration error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check your Railway URL is correct');
        console.log('   2. Ensure Railway API is running');
        console.log('   3. Verify MongoDB Atlas connection');
        console.log('   4. Check file paths for users.json and data.json');
        console.log('\n📖 Check MIGRATION_GUIDE.md for detailed instructions');
        process.exit(1);
    }
}

// Run the complete migration
runCompleteDataMigration();
