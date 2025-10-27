// ElevenLabs API Response Debug Script
// Insert this code into a new Code node after "Generate Audio" to see what error is returned

const response = $input.item;

console.log('=== ELEVENLABS API DEBUG ANALYSIS ===');
console.log('');

// Basic response analysis
console.log('📊 RESPONSE STRUCTURE:');
console.log('Response type:', typeof response);
console.log('Has binary data:', !!response.binary);
console.log('Has json data:', !!response.json);
console.log('');

// Check for binary data (success case)
if (response.binary && response.binary.data) {
  console.log('✅ SUCCESS: Binary audio data found!');
  console.log('Binary data size:', response.binary.data.length, 'bytes');
  console.log('Binary data type:', typeof response.binary.data);
  return $input.all(); // Pass through if successful
}

// If no binary data, analyze the error response
console.log('❌ NO BINARY DATA - ANALYZING ERROR:');
console.log('');

// Check JSON response for errors
if (response.json) {
  console.log('📄 JSON Response Content:');

  // Handle different response types
  if (typeof response.json === 'string') {
    console.log('Response is string:', response.json.substring(0, 200) + '...');

    // Check for HTML error page
    if (response.json.includes('<html>') || response.json.includes('<!DOCTYPE')) {
      console.log('🚨 DETECTED: HTML ERROR PAGE');
      console.log('This usually means:');
      console.log('  - Invalid API endpoint URL');
      console.log('  - Server-side error (500, 502, etc.)');
      console.log('  - Cloudflare or proxy error');
    }

    // Check for common error patterns
    if (response.json.toLowerCase().includes('unauthorized')) {
      console.log('🚨 DETECTED: AUTHENTICATION ERROR');
      console.log('Fix: Check your ElevenLabs API key in n8n credentials');
    }

    if (response.json.toLowerCase().includes('quota') || response.json.toLowerCase().includes('credit')) {
      console.log('🚨 DETECTED: QUOTA/CREDITS ERROR');
      console.log('Fix: Add more credits to your ElevenLabs account');
    }

  } else if (typeof response.json === 'object') {
    console.log('Response is object:', JSON.stringify(response.json, null, 2));

    // Check for standard ElevenLabs error structure
    if (response.json.error) {
      console.log('🚨 ELEVENLABS ERROR DETECTED:');
      console.log('Error message:', response.json.error);

      // Common ElevenLabs errors and solutions
      if (response.json.error.includes('voice not found')) {
        console.log('');
        console.log('💡 SOLUTION: Invalid Voice ID');
        console.log('  - Check voice IDs in your ElevenLabs dashboard');
        console.log('  - Current Victor ID: T9xTMubBGC4Y9y6oHUza');
        console.log('  - Current Lenny ID: WbI4Toj5UDP91WAiEInp');
        console.log('  - Make sure these voices exist in your account');
      }

      if (response.json.error.includes('insufficient') || response.json.error.includes('quota')) {
        console.log('');
        console.log('💡 SOLUTION: Insufficient Credits');
        console.log('  - Add credits at elevenlabs.io/billing');
        console.log('  - Even $1-2 should be enough for testing');
      }

      if (response.json.error.includes('unauthorized') || response.json.error.includes('authentication')) {
        console.log('');
        console.log('💡 SOLUTION: API Key Issue');
        console.log('  - Regenerate API key in ElevenLabs dashboard');
        console.log('  - Update n8n credentials with new key');
      }
    }

    if (response.json.detail) {
      console.log('🚨 ERROR DETAILS:', response.json.detail);
    }

    if (response.json.message) {
      console.log('🚨 ERROR MESSAGE:', response.json.message);
    }
  }
}

// Check HTTP status if available
if (response.json && response.json.status) {
  console.log('');
  console.log('🌐 HTTP STATUS:', response.json.status);

  switch(response.json.status) {
    case 401:
      console.log('💡 401 Unauthorized - Check API key');
      break;
    case 402:
      console.log('💡 402 Payment Required - Add credits');
      break;
    case 404:
      console.log('💡 404 Not Found - Check voice ID or URL');
      break;
    case 422:
      console.log('💡 422 Unprocessable Entity - Check request payload');
      break;
    case 429:
      console.log('💡 429 Rate Limited - Wait and retry');
      break;
    case 500:
      console.log('💡 500 Server Error - ElevenLabs service issue');
      break;
  }
}

// Analyze the request that was sent
console.log('');
console.log('📤 REQUEST ANALYSIS:');
const currentItem = response.json || {};
console.log('Voice ID used:', currentItem.voiceId || 'NOT FOUND');
console.log('Text length:', currentItem.text ? currentItem.text.length : 'NO TEXT');
console.log('Model ID:', currentItem.modelId || 'NOT FOUND');

// Check if voice settings are valid
if (currentItem.elevenlabsPayload) {
  console.log('ElevenLabs payload:', JSON.stringify(currentItem.elevenlabsPayload, null, 2));
}

console.log('');
console.log('🔍 NEXT DEBUGGING STEPS:');
console.log('1. Check the specific error message above');
console.log('2. Verify voice IDs in ElevenLabs dashboard');
console.log('3. Confirm API key is valid and active');
console.log('4. Check account credits and quota');
console.log('5. Try with a different voice ID');

console.log('');
console.log('=== END DEBUG ANALYSIS ===');

// Return the response for further inspection
return $input.all();
