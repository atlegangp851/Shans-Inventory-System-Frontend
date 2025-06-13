// Test script to debug Cloudinary search API issues
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary from environment variables
require('dotenv').config();

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Missing Cloudinary environment variables!');
    console.error('Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your .env file');
    process.exit(1);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinarySearch() {
    console.log('🔍 Testing Cloudinary Search API...\n');
    
    try {
        console.log('1. Testing basic search...');
        
        // Test 1: Basic search without sort
        try {
            const basicResult = await cloudinary.search
                .expression('folder:sales_backups')
                .max_results(10)
                .execute();
            
            console.log(`   ✅ Basic search successful: Found ${basicResult.resources.length} files`);
        } catch (error) {
            console.log(`   ❌ Basic search failed:`, error.message);
        }
        
        console.log('\n2. Testing search with different sort formats...');
        
        // Test 2: Try different sort formats
        const sortFormats = [
            { name: 'Object format', value: [{created_at: 'desc'}] },
            { name: 'Array format', value: [['created_at', 'desc']] },
            { name: 'String format', value: 'created_at:desc' }
        ];
        
        for (const format of sortFormats) {
            try {
                console.log(`   Testing ${format.name}...`);
                const result = await cloudinary.search
                    .expression('folder:sales_backups')
                    .sort_by(format.value)
                    .max_results(5)
                    .execute();
                
                console.log(`   ✅ ${format.name} successful: Found ${result.resources.length} files`);
            } catch (error) {
                console.log(`   ❌ ${format.name} failed:`, error.message);
            }
        }
        
        console.log('\n3. Testing admin API as fallback...');
        
        // Test 3: Admin API fallback
        try {
            const adminResult = await cloudinary.api.resources({
                type: 'upload',
                resource_type: 'raw',
                prefix: 'sales_backups/',
                max_results: 10,
                tags: true,
                context: true
            });
            
            console.log(`   ✅ Admin API successful: Found ${adminResult.resources.length} files`);
            
            if (adminResult.resources.length > 0) {
                const sample = adminResult.resources[0];
                console.log(`   Sample file:`, {
                    public_id: sample.public_id,
                    created_at: sample.created_at,
                    size: sample.bytes,
                    tags: sample.tags,
                    context: sample.context
                });
            }
        } catch (error) {
            console.log(`   ❌ Admin API failed:`, error.message);
        }
        
        console.log('\n4. Testing with tags filter...');
        
        // Test 4: Search with tags
        try {
            const tagResult = await cloudinary.search
                .expression('tags:sales_backup')
                .max_results(10)
                .execute();
            
            console.log(`   ✅ Tag search successful: Found ${tagResult.resources.length} files`);
        } catch (error) {
            console.log(`   ❌ Tag search failed:`, error.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
if (require.main === module) {
    testCloudinarySearch().catch(console.error);
}

module.exports = { testCloudinarySearch };
