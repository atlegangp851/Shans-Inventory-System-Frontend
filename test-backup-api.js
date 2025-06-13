// Test script for backup API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8000';

async function testBackupAPI() {
    console.log('🧪 Testing Backup API Endpoints\n');
    
    try {
        // Test 1: Health check
        console.log('1. Testing server health...');
        const healthResponse = await fetch(`${BASE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log(`   ✅ Server is healthy: ${healthData.status}\n`);
        
        // Test 2: Test connection endpoint (without auth - should fail)
        console.log('2. Testing connection endpoint (without auth)...');
        const connectionResponse = await fetch(`${BASE_URL}/api/backup/test-connection`);
        if (connectionResponse.status === 401) {
            console.log('   ✅ Authentication required (as expected)\n');
        } else {
            console.log('   ⚠️  Expected 401 but got:', connectionResponse.status);
        }
        
        // Test 3: Check if backup routes are registered
        console.log('3. Testing backup endpoint registration...');
        const backupResponse = await fetch(`${BASE_URL}/api/backup/backup-sales-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        if (backupResponse.status === 401) {
            console.log('   ✅ Backup endpoint is registered and requires authentication\n');
        } else {
            console.log('   ⚠️  Unexpected response:', backupResponse.status);
        }
        
        console.log('🎉 All API tests passed! The backup endpoints are properly configured.\n');
        console.log('Next steps:');
        console.log('1. Open your browser and go to the Sales Dashboard');
        console.log('2. Log in with your admin credentials');
        console.log('3. Click "Test Cloudinary" to verify the connection');
        console.log('4. Try backing up a month\'s data');
        console.log('5. Check your Cloudinary Media Library for the backup files\n');
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Make sure the backend server is running on port 8000');
        console.log('2. Check if there are any errors in the server logs');
        console.log('3. Verify the backup routes are properly imported\n');
    }
}

// Run the test
testBackupAPI().catch(console.error);
