// Cloudinary Authentication Test Script
// Use this to verify your API credentials work before using in N8N

const https = require("https");

// Replace these with your actual Cloudinary credentials
const CLOUD_NAME = "dly199qqv";
const API_KEY = "497685786324925";
const API_SECRET = "IIOcT0xjXBOfBvIqjBC0oFod2wg";

// Check if credentials are properly set
console.log("🔍 Checking your credentials...");
console.log("☁️ Cloud Name:", CLOUD_NAME);
console.log(
  "🔑 API Key:",
  API_KEY === "your-api-key-here"
    ? "❌ NOT SET (still placeholder)"
    : "✅ SET (" + API_KEY.substring(0, 8) + "...)",
);
console.log(
  "🔐 API Secret:",
  API_SECRET === "your-api-secret-here"
    ? "❌ NOT SET (still placeholder)"
    : "✅ SET (" + API_SECRET.substring(0, 8) + "...)",
);

if (API_KEY === "your-api-key-here" || API_SECRET === "your-api-secret-here") {
  console.log(
    "\n❌ ERROR: You need to replace the placeholder values with your actual Cloudinary credentials!",
  );
  console.log(
    "📝 Edit lines 7-9 in cloudinary-auth-test.js with your real values from https://cloudinary.com/console",
  );
  console.log("🛑 Exiting...\n");
  return;
}

// Create Base64 authentication string
const authString = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
console.log("🔐 Base64 Auth String:", authString);
console.log("📋 Copy this for N8N Header Value: Basic " + authString);

// Test data - minimal GIF for testing
const testData = JSON.stringify({
  file: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  public_id: "test_auth_" + Date.now(),
  resource_type: "image",
});

// HTTP request options
const options = {
  hostname: "api.cloudinary.com",
  port: 443,
  path: `/v1_1/${CLOUD_NAME}/image/upload`,
  method: "POST",
  headers: {
    Authorization: `Basic ${authString}`,
    "Content-Type": "application/json",
    "Content-Length": testData.length,
  },
};

console.log("\n🧪 Testing Cloudinary Authentication...");
console.log("☁️ Cloud Name:", CLOUD_NAME);
console.log("🔗 URL:", `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  console.log("\n📊 Response Status:", res.statusCode);
  console.log("📋 Response Headers:", res.headers);

  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const response = JSON.parse(data);

      if (res.statusCode === 200) {
        console.log("\n✅ SUCCESS! Authentication working!");
        console.log("🎉 Test file uploaded successfully");
        console.log("🆔 Public ID:", response.public_id);
        console.log("🔗 URL:", response.secure_url);
        console.log("\n💡 Your N8N HTTP Header Auth should be configured as:");
        console.log("   Header Name: Authorization");
        console.log("   Header Value: Basic " + authString);
      } else {
        console.log("\n❌ AUTHENTICATION FAILED!");
        console.log("📝 Error Response:", response);

        // Common error explanations
        if (res.statusCode === 401) {
          console.log("\n🔑 This is an authentication error. Check:");
          console.log("   - API Key and Secret are correct");
          console.log("   - No extra spaces in credentials");
          console.log("   - Base64 encoding is correct");
        } else if (res.statusCode === 400) {
          console.log("\n📝 Bad request. Check:");
          console.log("   - Cloud name is correct and matches your account");
          console.log("   - URL format is correct");
        } else if (res.statusCode === 500) {
          console.log("\n🔧 Server error. This could be:");
          console.log("   - Temporary Cloudinary service issue");
          console.log("   - Account suspension or billing issue");
          console.log("   - Invalid cloud name in URL");
        }
      }
    } catch (error) {
      console.log("\n❌ Failed to parse response:", error.message);
      console.log("📝 Raw response:", data);
    }
  });
});

req.on("error", (error) => {
  console.log("\n💥 Request failed:", error.message);
  console.log("🌐 Check your internet connection");
});

// Send the request
req.write(testData);
req.end();

console.log("\n📝 Instructions:");
console.log(
  "1. Replace CLOUD_NAME, API_KEY, and API_SECRET with your actual values",
);
console.log("2. Run: node cloudinary-auth-test.js");
console.log(
  "3. If successful, copy the Base64 string to your N8N HTTP Header Auth credential",
);
console.log("4. Make sure your N8N workflow uses the correct cloud name");
console.log("\n🔗 Get your credentials from: https://cloudinary.com/console");
