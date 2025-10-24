// Cloudinary Signed Upload Test Script
// This uses proper signature-based authentication instead of Basic Auth

const https = require('https');
const crypto = require('crypto');

// YOUR CLOUDINARY CREDENTIALS - Replace these with your actual values
const CLOUD_NAME = 'dly199qqv';
const API_KEY = '497685786324925';
const API_SECRET = 'IIOcT0xjXBOfBvIqjBC0oFod2wg';

console.log('🔍 CLOUDINARY SIGNED UPLOAD TEST');
console.log('=' .repeat(50));

// Step 1: Verify credentials
console.log('\n1️⃣ CHECKING CREDENTIALS:');
console.log('☁️ Cloud Name:', CLOUD_NAME);
console.log('🔑 API Key:', API_KEY ? `✅ SET (${API_KEY.substring(0, 8)}...)` : '❌ NOT SET');
console.log('🔐 API Secret:', API_SECRET ? `✅ SET (${API_SECRET.substring(0, 8)}...)` : '❌ NOT SET');

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.log('\n❌ ERROR: Missing credentials!');
    process.exit(1);
}

// Step 2: Create signed upload parameters
console.log('\n2️⃣ CREATING SIGNED UPLOAD:');

const timestamp = Math.round((new Date()).getTime() / 1000);
const publicId = 'test_signed_' + timestamp;

// Parameters to sign (alphabetical order)
const paramsToSign = {
    public_id: publicId,
    resource_type: 'image',
    timestamp: timestamp
};

// Create signature string
const paramString = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');

const stringToSign = paramString + API_SECRET;
const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

console.log('⏰ Timestamp:', timestamp);
console.log('🆔 Public ID:', publicId);
console.log('📝 String to sign:', stringToSign);
console.log('🔏 Signature:', signature);

// Step 3: Prepare form data for signed upload
const boundary = '----formdata-n8n-' + Math.random().toString(36);
const testImageB64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const formData = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="file"',
    '',
    `data:image/gif;base64,${testImageB64}`,
    `--${boundary}`,
    'Content-Disposition: form-data; name="api_key"',
    '',
    API_KEY,
    `--${boundary}`,
    'Content-Disposition: form-data; name="timestamp"',
    '',
    timestamp.toString(),
    `--${boundary}`,
    'Content-Disposition: form-data; name="signature"',
    '',
    signature,
    `--${boundary}`,
    'Content-Disposition: form-data; name="public_id"',
    '',
    publicId,
    `--${boundary}`,
    'Content-Disposition: form-data; name="resource_type"',
    '',
    'image',
    `--${boundary}--`,
    ''
].join('\r\n');

// Step 4: Configure request
const options = {
    hostname: 'api.cloudinary.com',
    port: 443,
    path: `/v1_1/${CLOUD_NAME}/image/upload`,
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formData)
    }
};

console.log('\n3️⃣ REQUEST DETAILS:');
console.log('🔗 Target URL:', `https://${options.hostname}${options.path}`);
console.log('📦 Form data size:', Buffer.byteLength(formData), 'bytes');
console.log('📋 Content-Type:', options.headers['Content-Type']);

// Step 5: Make the request
console.log('\n4️⃣ TESTING SIGNED UPLOAD...');
console.log('⏳ Sending signed request to Cloudinary...');

const req = https.request(options, (res) => {
    console.log('\n5️⃣ RESPONSE RECEIVED:');
    console.log('📊 Status Code:', res.statusCode);
    console.log('📝 Status Message:', res.statusMessage);

    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('\n6️⃣ RESULT ANALYSIS:');

        try {
            const response = JSON.parse(responseData);

            if (res.statusCode === 200) {
                console.log('🎉 SUCCESS! Signed authentication is working!');
                console.log('✅ Test image uploaded successfully');
                console.log('🆔 Public ID:', response.public_id);
                console.log('🔗 Secure URL:', response.secure_url);
                console.log('📊 File size:', response.bytes, 'bytes');

                console.log('\n7️⃣ FOR YOUR N8N WORKFLOW:');
                console.log('📝 The issue is that N8N workflows should use SIGNED uploads, not Basic Auth!');
                console.log('💡 You need to modify your N8N workflow to:');
                console.log('   1. Remove the HTTP Header Auth credential');
                console.log('   2. Use form-data instead of JSON');
                console.log('   3. Include api_key, timestamp, and signature in the form data');
                console.log('   4. Calculate the signature in a Code node before the upload');

                console.log('\n🔧 N8N WORKFLOW CHANGES NEEDED:');
                console.log('   - Change Content-Type to multipart/form-data');
                console.log('   - Include these form fields: file, api_key, timestamp, signature, public_id');
                console.log('   - Calculate signature using: SHA1(param_string + api_secret)');

            } else {
                console.log('❌ SIGNED UPLOAD FAILED');
                console.log('📝 Error details:', JSON.stringify(response, null, 2));

                if (res.statusCode === 401) {
                    console.log('\n🔍 DIAGNOSIS: 401 Unauthorized');
                    console.log('❌ Signature is invalid or API credentials are wrong');
                    console.log('💡 Check:');
                    console.log('   - API Key and Secret are exactly correct');
                    console.log('   - No extra spaces in credentials');
                    console.log('   - Signature calculation is correct');

                } else if (res.statusCode === 400) {
                    console.log('\n🔍 DIAGNOSIS: 400 Bad Request');
                    console.log('❌ Request format or parameter issue');
                    console.log('📝 Common causes:');
                    console.log('   - Missing required parameters');
                    console.log('   - Invalid timestamp (too old/future)');
                    console.log('   - Malformed signature');
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
});

// Send request
console.log('📡 Sending signed request...');
req.write(formData);
req.end();

console.log('\n📚 ABOUT CLOUDINARY AUTHENTICATION:');
console.log('🔍 There are two ways to authenticate with Cloudinary:');
console.log('   1. Basic Auth (api_key:api_secret) - Often has restrictions');
console.log('   2. Signed uploads - More secure and reliable');
console.log('💡 Your 500 error in N8N is likely because the workflow uses Basic Auth');
console.log('   but your account requires signed uploads for security.');
