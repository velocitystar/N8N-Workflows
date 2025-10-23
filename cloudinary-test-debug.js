// Cloudinary Authentication Debug Test Script
// This script will help diagnose authentication issues with Cloudinary

const https = require('https');

// YOUR CLOUDINARY CREDENTIALS - Replace these with your actual values
const CLOUD_NAME = 'dly199qqv';
const API_KEY = '497685786324925';
const API_SECRET = 'IIOcT0xjXBOfBvIqjBC0oFod2wg';

console.log('🔍 CLOUDINARY AUTHENTICATION DEBUG TEST');
console.log('=' .repeat(50));

// Step 1: Verify credentials are set
console.log('\n1️⃣ CHECKING CREDENTIALS:');
console.log('☁️ Cloud Name:', CLOUD_NAME);
console.log('🔑 API Key:', API_KEY ? `✅ SET (${API_KEY.substring(0, 8)}...)` : '❌ NOT SET');
console.log('🔐 API Secret:', API_SECRET ? `✅ SET (${API_SECRET.substring(0, 8)}...)` : '❌ NOT SET');

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.log('\n❌ ERROR: Missing credentials! Please set all three values.');
    process.exit(1);
}

// Step 2: Create and display authentication string
console.log('\n2️⃣ CREATING AUTHENTICATION:');
const authString = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
console.log('🔐 Raw auth string:', `${API_KEY}:${API_SECRET}`);
console.log('📦 Base64 encoded:', authString);
console.log('🎯 N8N Header Value:', `Basic ${authString}`);

// Step 3: Test URL construction
const testUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
console.log('\n3️⃣ REQUEST DETAILS:');
console.log('🔗 Target URL:', testUrl);

// Step 4: Prepare test data
const testData = JSON.stringify({
    file: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    public_id: 'test_debug_' + Date.now(),
    resource_type: 'image'
});

console.log('📦 Request payload size:', testData.length, 'bytes');

// Step 5: Configure request
const options = {
    hostname: 'api.cloudinary.com',
    port: 443,
    path: `/v1_1/${CLOUD_NAME}/image/upload`,
    method: 'POST',
    headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Content-Length': testData.length
    }
};

console.log('📋 Request headers:');
Object.entries(options.headers).forEach(([key, value]) => {
    if (key === 'Authorization') {
        console.log(`   ${key}: Basic [base64-encoded-credentials]`);
    } else {
        console.log(`   ${key}: ${value}`);
    }
});

// Step 6: Make the request
console.log('\n4️⃣ TESTING AUTHENTICATION...');
console.log('⏳ Sending request to Cloudinary...');

const req = https.request(options, (res) => {
    console.log('\n5️⃣ RESPONSE RECEIVED:');
    console.log('📊 Status Code:', res.statusCode);
    console.log('📝 Status Message:', res.statusMessage);

    // Show important headers
    const importantHeaders = ['x-cld-error', 'content-type', 'x-request-id'];
    console.log('📋 Response Headers:');
    importantHeaders.forEach(header => {
        if (res.headers[header]) {
            console.log(`   ${header}: ${res.headers[header]}`);
        }
    });

    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('\n6️⃣ RESULT ANALYSIS:');

        try {
            const response = JSON.parse(responseData);

            if (res.statusCode === 200) {
                console.log('🎉 SUCCESS! Authentication is working perfectly!');
                console.log('✅ Test image uploaded successfully');
                console.log('🆔 Public ID:', response.public_id);
                console.log('🔗 Secure URL:', response.secure_url);

                console.log('\n7️⃣ N8N SETUP INSTRUCTIONS:');
                console.log('📝 Create HTTP Header Auth credential in N8N:');
                console.log('   Credential Name: Cloudinary API Auth');
                console.log('   Header Name: Authorization');
                console.log('   Header Value: Basic ' + authString);
                console.log('\n✨ Your authentication is working - the 500 error in N8N is likely a different issue!');

            } else {
                console.log('❌ AUTHENTICATION FAILED');
                console.log('📝 Error details:', JSON.stringify(response, null, 2));

                // Specific error analysis
                if (res.statusCode === 401) {
                    console.log('\n🔍 DIAGNOSIS: 401 Unauthorized');
                    console.log('❌ Your API credentials are incorrect or invalid');
                    console.log('💡 Solutions:');
                    console.log('   - Double-check API Key and Secret from Cloudinary dashboard');
                    console.log('   - Ensure no extra spaces or characters in credentials');
                    console.log('   - Verify your Cloudinary account is active');

                } else if (res.statusCode === 400) {
                    if (response.error && response.error.message.includes('Upload preset')) {
                        console.log('\n🔍 DIAGNOSIS: 400 Bad Request - Upload Preset Error');
                        console.log('❌ Cloudinary is not recognizing your authentication');
                        console.log('💡 This usually means:');
                        console.log('   - Base64 encoding of credentials is wrong');
                        console.log('   - Authorization header format is incorrect');
                        console.log('   - API credentials are invalid');

                        console.log('\n🧪 MANUAL VERIFICATION:');
                        console.log('Try decoding your base64 string:');
                        console.log('Expected:', `${API_KEY}:${API_SECRET}`);
                        console.log('Actual:', Buffer.from(authString, 'base64').toString());

                    } else {
                        console.log('\n🔍 DIAGNOSIS: 400 Bad Request - Other');
                        console.log('❌ Request format or cloud name issue');
                        console.log('💡 Check that cloud name matches exactly:', CLOUD_NAME);
                    }

                } else if (res.statusCode === 500) {
                    console.log('\n🔍 DIAGNOSIS: 500 Server Error');
                    console.log('❌ Cloudinary server error or account issue');
                    console.log('💡 Possible causes:');
                    console.log('   - Temporary Cloudinary service issue');
                    console.log('   - Account suspended or billing problem');
                    console.log('   - Invalid cloud name in URL');
                }
            }

        } catch (parseError) {
            console.log('💥 Failed to parse JSON response');
            console.log('📝 Raw response:', responseData);
        }
    });
});

req.on('error', (error) => {
    console.log('\n💥 REQUEST FAILED');
    console.log('❌ Error:', error.message);
    console.log('🌐 Check your internet connection');
});

// Send request
console.log('📡 Sending request...');
req.write(testData);
req.end();
