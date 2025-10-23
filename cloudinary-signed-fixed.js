// Cloudinary Signed Upload Test Script - FIXED SIGNATURE CALCULATION
// This uses the correct signature format that Cloudinary expects

const https = require('https');
const crypto = require('crypto');

// YOUR CLOUDINARY CREDENTIALS - Replace these with your actual values
const CLOUD_NAME = 'dly199qqv';
const API_KEY = '497685786324925';
const API_SECRET = 'IIOcT0xjXBOfBvIqjBC0oFod2wg';

console.log('🔍 CLOUDINARY SIGNED UPLOAD TEST - FIXED');
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

// Step 2: Create signed upload parameters - CORRECTED FORMAT
console.log('\n2️⃣ CREATING SIGNED UPLOAD (CORRECTED):');

const timestamp = Math.round((new Date()).getTime() / 1000);
const publicId = 'test_signed_fixed_' + timestamp;

// Parameters to sign (only include what Cloudinary expects)
// Based on error: Cloudinary only wants public_id and timestamp in signature
const paramsToSign = {
    public_id: publicId,
    timestamp: timestamp
    // NOTE: NOT including resource_type in signature calculation
};

// Create signature string - FIXED FORMAT
const paramString = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');

const stringToSign = paramString + API_SECRET;
const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

console.log('⏰ Timestamp:', timestamp);
console.log('🆔 Public ID:', publicId);
console.log('📝 Params for signature:', JSON.stringify(paramsToSign, null, 2));
console.log('📝 String to sign:', stringToSign);
console.log('🔏 Calculated signature:', signature);
console.log('✨ Expected by Cloudinary:', `public_id=${publicId}&timestamp=${timestamp}`);

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

// Step 5: Make the request
console.log('\n4️⃣ TESTING CORRECTED SIGNED UPLOAD...');
console.log('⏳ Sending corrected signed request to Cloudinary...');

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
                console.log('🎉 SUCCESS! Corrected signed authentication is working!');
                console.log('✅ Test image uploaded successfully');
                console.log('🆔 Public ID:', response.public_id);
                console.log('🔗 Secure URL:', response.secure_url);
                console.log('📊 File size:', response.bytes, 'bytes');
                console.log('📝 Format:', response.format);

                console.log('\n7️⃣ N8N WORKFLOW SOLUTION:');
                console.log('🎯 Your Cloudinary account REQUIRES signed uploads!');
                console.log('💡 The HTTP Header Auth method will NOT work.');
                console.log('🔧 You need to modify your N8N workflow to use signed uploads.');

                console.log('\n📋 N8N WORKFLOW CHANGES REQUIRED:');
                console.log('1. Remove the HTTP Header Auth credential completely');
                console.log('2. Add a Code node before upload to calculate signature');
                console.log('3. Change HTTP Request to use multipart/form-data');
                console.log('4. Include these form fields: file, api_key, timestamp, signature, public_id');

                console.log('\n🔑 SIGNATURE CALCULATION FOR N8N:');
                console.log('// In a Code node before upload:');
                console.log('const crypto = require("crypto");');
                console.log('const timestamp = Math.round(Date.now() / 1000);');
                console.log('const publicId = "your-public-id";');
                console.log('const apiSecret = "' + API_SECRET + '";');
                console.log('const stringToSign = `public_id=${publicId}&timestamp=${timestamp}` + apiSecret;');
                console.log('const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");');

                console.log('\n✨ This proves your credentials work with signed uploads!');

            } else {
                console.log('❌ CORRECTED SIGNED UPLOAD STILL FAILED');
                console.log('📝 Error details:', JSON.stringify(response, null, 2));

                if (res.statusCode === 401) {
                    if (response.error && response.error.message.includes('Invalid Signature')) {
                        console.log('\n🔍 DIAGNOSIS: Still Invalid Signature');
                        console.log('❌ Signature calculation is still not matching Cloudinary expectations');
                        console.log('📝 Cloudinary expected string:', response.error.message.match(/'([^']+)'/)?.[1] || 'unknown');
                        console.log('📝 Our calculated string:', paramString);
                        console.log('💡 This suggests there may be additional parameters or different format required');

                        // Let's try with minimal parameters
                        console.log('\n🧪 TRY MANUAL VERIFICATION:');
                        console.log('1. Go to Cloudinary console upload page');
                        console.log('2. Check if your account requires specific upload presets');
                        console.log('3. Verify API access permissions in account settings');

                    } else {
                        console.log('\n🔍 DIAGNOSIS: General 401 Unauthorized');
                        console.log('❌ API Key or Secret may be incorrect');
                        console.log('💡 Double-check credentials from Cloudinary dashboard');
                    }

                } else if (res.statusCode === 400) {
                    console.log('\n🔍 DIAGNOSIS: 400 Bad Request');
                    console.log('❌ Request format issue');
                    console.log('💡 Check parameter format and values');
                }
            }

        } catch (parseError) {
            console.log('💥 Failed to parse JSON response');
            console.log('📝 Raw response:', responseData);
            console.log('❌ Parse error:', parseError.message);
        }
    });
});

req.on('error', (error) => {
    console.log('\n💥 REQUEST FAILED');
    console.log('❌ Error:', error.message);
});

// Send request
console.log('📡 Sending corrected signed request...');
req.write(formData);
req.end();

console.log('\n📚 SIGNATURE CALCULATION EXPLAINED:');
console.log('🔍 Cloudinary signature format:');
console.log('   1. Take only the parameters that need signing (public_id, timestamp)');
console.log('   2. Sort them alphabetically');
console.log('   3. Create string: "key1=value1&key2=value2"');
console.log('   4. Append API secret directly');
console.log('   5. SHA1 hash the result');
console.log('💡 The error message tells us exactly what string Cloudinary expects!');
