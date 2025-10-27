// Quick Debug Script for ElevenLabs Voice ID Issue
// Insert this as a Code node right after "Generate Audio" node

const response = $input.item;
const currentData = response.json || {};

console.log('🔍 QUICK ELEVENLABS DEBUG');
console.log('==========================');

// Check if we got binary data (success) or text/json (error)
if (response.binary && response.binary.data) {
  console.log('✅ SUCCESS: Got binary audio data!');
  console.log('📊 Size:', response.binary.data.length, 'bytes');
  return $input.all();
} else {
  console.log('❌ FAILED: No binary data - API returned error');
}

// Show the actual error response
console.log('\n📄 RAW RESPONSE:');
if (typeof response.json === 'string') {
  console.log('Response type: STRING');
  console.log('First 200 chars:', response.json.substring(0, 200));

  // Check for specific error patterns
  if (response.json.includes('voice not found')) {
    console.log('🚨 ERROR: Voice ID not found');
  } else if (response.json.includes('unauthorized') || response.json.includes('401')) {
    console.log('🚨 ERROR: API key authentication failed');
  } else if (response.json.includes('insufficient') || response.json.includes('quota')) {
    console.log('🚨 ERROR: Insufficient credits');
  } else if (response.json.includes('<html>')) {
    console.log('🚨 ERROR: Got HTML response (server error)');
  }
} else if (typeof response.json === 'object') {
  console.log('Response type: OBJECT');
  console.log(JSON.stringify(response.json, null, 2));
}

// Show what was sent to ElevenLabs
console.log('\n📤 REQUEST DETAILS:');
console.log('Voice ID used:', currentData.voiceId || 'MISSING');
console.log('Speaker:', currentData.speaker || 'MISSING');
console.log('File name:', currentData.fileName || 'MISSING');
console.log('Text preview:', currentData.text ? currentData.text.substring(0, 50) + '...' : 'MISSING');

// Show the API URL that was called
console.log('API URL would be:', `https://api.elevenlabs.io/v1/text-to-speech/${currentData.voiceId}`);

// Check payload structure
if (currentData.elevenlabsPayload) {
  console.log('\n🔧 ELEVENLABS PAYLOAD:');
  console.log(JSON.stringify(currentData.elevenlabsPayload, null, 2));
} else {
  console.log('\n❌ NO ELEVENLABS PAYLOAD FOUND');
  console.log('This means the "Build ElevenLabs Payload" node may have failed');
}

// Specific checks for your confirmed voice ID
if (currentData.voiceId === 'T9xTMubBGC4Y9y6oHUza') {
  console.log('\n✅ Using confirmed working Victor voice ID');
} else if (currentData.voiceId === 'WbI4Toj5UDP91WAiEInp') {
  console.log('\n❓ Using Lenny voice ID - may need verification');
} else {
  console.log('\n❌ Using unexpected voice ID:', currentData.voiceId);
}

console.log('\n🎯 NEXT STEPS:');
console.log('1. Check the error message above');
console.log('2. If voice not found: verify Lenny voice ID WbI4Toj5UDP91WAiEInp');
console.log('3. If auth error: check API key in n8n credentials');
console.log('4. If quota error: add credits to ElevenLabs account');
console.log('5. Try switching both voices to Victor ID temporarily');

return $input.all();
