// ElevenLabs Voice ID Validation Script
// Use this to test if your voice IDs are valid before running the full workflow

const voiceIds = {
  victor: "T9xTMubBGC4Y9y6oHUza",
  lenny: "WbI4Toj5UDP91WAiEInp"
};

console.log('🔍 VALIDATING ELEVENLABS VOICE IDs');
console.log('=====================================');

// Function to validate voice ID format
function isValidVoiceIdFormat(voiceId) {
  // ElevenLabs voice IDs are typically 20+ characters, alphanumeric
  const pattern = /^[a-zA-Z0-9]{20,}$/;
  return pattern.test(voiceId);
}

// Test each voice ID
Object.entries(voiceIds).forEach(([speaker, voiceId]) => {
  console.log(`\n👤 Testing ${speaker.toUpperCase()} voice ID:`);
  console.log(`ID: ${voiceId}`);
  console.log(`Length: ${voiceId.length} characters`);

  if (isValidVoiceIdFormat(voiceId)) {
    console.log('✅ Format looks correct');
  } else {
    console.log('❌ Format looks invalid');
    console.log('  Expected: 20+ alphanumeric characters');
  }
});

console.log('\n🧪 VOICE ID TEST RECOMMENDATIONS:');
console.log('=================================');

console.log('\n1. MANUAL TEST - Try these URLs in your browser:');
Object.entries(voiceIds).forEach(([speaker, voiceId]) => {
  console.log(`   ${speaker}: https://api.elevenlabs.io/v1/voices/${voiceId}`);
});
console.log('   (Add your API key as Authorization: Bearer YOUR_KEY header)');

console.log('\n2. N8N TEST - Create simple HTTP Request node:');
console.log('   URL: https://api.elevenlabs.io/v1/voices/{{voice_id}}');
console.log('   Method: GET');
console.log('   Headers: Authorization: Bearer {{your_api_key}}');

console.log('\n3. COMMON VOICE ID ISSUES:');
console.log('   ❌ Using voice name instead of ID');
console.log('   ❌ Voice belongs to different account');
console.log('   ❌ Voice was deleted or disabled');
console.log('   ❌ Copy/paste error with extra characters');

console.log('\n4. HOW TO GET CORRECT VOICE IDs:');
console.log('   📱 Go to elevenlabs.io/speech-synthesis');
console.log('   🎙️ Select your voice');
console.log('   📋 Copy the voice ID from the URL or settings');
console.log('   🔑 Or use API: GET https://api.elevenlabs.io/v1/voices');

console.log('\n5. QUICK TEST VOICE IDs (if yours don\'t work):');
console.log('   Rachel (default): 21m00Tcm4TlvDq8ikWAM');
console.log('   Drew (default): 29vD33N1CtxCmqQRPOHJ');
console.log('   Clyde (default): 2EiwWnXFnvU5JabPnv8n');

console.log('\n🚀 NEXT STEPS:');
console.log('==============');
console.log('1. Verify these voice IDs work with your API key');
console.log('2. If they don\'t work, get correct IDs from your account');
console.log('3. Update the Set Configuration node in your workflow');
console.log('4. Test with single audio generation before batch processing');

// Return current configuration for easy copying
return [{
  json: {
    message: "Voice ID validation complete - check console output",
    currentVoiceIds: voiceIds,
    testUrls: Object.fromEntries(
      Object.entries(voiceIds).map(([speaker, id]) => [
        speaker,
        `https://api.elevenlabs.io/v1/voices/${id}`
      ])
    )
  }
}];
