# ElevenLabs API Debugging Guide

## Current Issue: "Cannot read properties of undefined (reading 'data')"

### Problem Description
The "Prepare for Upload" node is failing because the ElevenLabs API is returning text/HTML instead of binary audio data. This causes `item.binary` to be undefined when the code tries to access `item.binary.data`.

### Root Cause Analysis
When ElevenLabs API returns an error, n8n treats it as JSON/text data instead of binary data. Common causes:

1. **Invalid API Key** - Authentication failure
2. **Invalid Voice ID** - Voice doesn't exist or isn't accessible
3. **API Quota Exceeded** - No credits remaining
4. **Invalid Request Format** - Payload structure issues
5. **Rate Limiting** - Too many requests too quickly
6. **Model/Voice Compatibility** - Voice doesn't support the requested model

### Debugging Steps

#### Step 1: Inspect Generate Audio Node Output
1. Run workflow and let it fail at "Prepare for Upload"
2. Go to "Generate Audio" node execution
3. Look at the output - if you see a table of characters instead of binary data indicator, the API returned an error

#### Step 2: Check API Response Content
Add this debug node after "Generate Audio" to see what's actually returned:

```javascript
// Debug ElevenLabs API Response
const response = $input.item;

console.log('=== ELEVENLABS API DEBUG ===');
console.log('Response type:', typeof response);
console.log('Has binary data:', !!response.binary);
console.log('Has json data:', !!response.json);

if (response.binary) {
  console.log('✅ Binary data present - SUCCESS');
  console.log('Binary data keys:', Object.keys(response.binary));
} else {
  console.log('❌ No binary data - API ERROR');
}

if (response.json) {
  console.log('JSON response:', JSON.stringify(response.json, null, 2));
}

// Check if response looks like HTML error page
if (typeof response.json === 'string' && response.json.includes('<html>')) {
  console.log('🚨 API returned HTML error page!');
}

// Check for common ElevenLabs error patterns
if (response.json && typeof response.json === 'object') {
  if (response.json.error) {
    console.log('🚨 ElevenLabs API Error:', response.json.error);
  }
  if (response.json.detail) {
    console.log('🚨 Error Detail:', response.json.detail);
  }
}

return $input.all();
```

#### Step 3: Validate Configuration
Check these in your "Set Configuration" or equivalent node:

```javascript
// Validate ElevenLabs Configuration
const config = $input.item.json;

console.log('=== CONFIGURATION VALIDATION ===');
console.log('Voice IDs:', {
  victor: config.victorVoiceId,
  lenny: config.lennyVoiceId
});

// Common voice ID validation
const voiceIdPattern = /^[a-zA-Z0-9]{20,}$/;
if (!voiceIdPattern.test(config.victorVoiceId)) {
  console.log('⚠️ Victor Voice ID looks invalid:', config.victorVoiceId);
}
if (!voiceIdPattern.test(config.lennyVoiceId)) {
  console.log('⚠️ Lenny Voice ID looks invalid:', config.lennyVoiceId);
}

return $input.all();
```

#### Step 4: Test API Credentials
Create a simple test node to verify your ElevenLabs credentials:

```javascript
// Test ElevenLabs API Access
// (Insert this as an HTTP Request node or modify Generate Audio temporarily)

// URL: https://api.elevenlabs.io/v1/voices
// Method: GET
// Headers: Use your ElevenLabs credentials
// This should return a list of available voices
```

### Common Error Messages and Solutions

#### "Invalid voice ID"
- **Cause**: Voice ID doesn't exist or you don't have access
- **Solution**: Check voice IDs in ElevenLabs dashboard, ensure they're from your account
- **Debug**: Test with a different voice ID

#### "Insufficient quota"
- **Cause**: No credits left in ElevenLabs account
- **Solution**: Check billing in ElevenLabs dashboard, add credits
- **Debug**: Check account status at elevenlabs.io

#### "Authentication failed"
- **Cause**: Invalid or expired API key
- **Solution**: Regenerate API key in ElevenLabs dashboard, update n8n credentials
- **Debug**: Test credentials with simple API call

#### "Model not supported for voice"
- **Cause**: Trying to use incompatible model/voice combination
- **Solution**: Use supported model (eleven_turbo_v2_5 is most compatible)
- **Debug**: Check voice capabilities in ElevenLabs dashboard

### Fixed "Prepare for Upload" Node
The node has been updated to handle missing binary data gracefully:

```javascript
// Check if we have valid binary data
if (!item.binary || !item.binary.data) {
  console.error(`❌ No binary audio data found for ${fileName}`);
  console.error('This usually means ElevenLabs API returned an error instead of audio');
  console.error('Check: API key, voice ID, quota, and request format');
  
  return {
    json: {
      ...item.json,
      error: 'No binary audio data - ElevenLabs API may have failed',
      fileName: fileName,
      uploadReady: false
    }
  };
}
```

### Workflow Recovery Steps

1. **Identify the failing item** - Which script line caused the error?
2. **Check the specific voice ID** - Is it valid for that speaker?
3. **Verify text content** - Any special characters or excessive length?
4. **Test with simpler content** - Try with basic text first
5. **Check account status** - Credits, rate limits, etc.

### Prevention Best Practices

1. **Always validate voice IDs** before processing
2. **Add retry logic** for transient failures  
3. **Monitor credit usage** proactively
4. **Test with single items** before batch processing
5. **Log all API responses** for debugging
6. **Use consistent model/voice combinations**

### Quick Fixes

#### Immediate Fix (if you know the issue):
- Update voice IDs in configuration
- Add credits to ElevenLabs account  
- Regenerate and update API key

#### Testing Fix:
- Reduce batch size to 1 item for testing
- Use known-good voice IDs
- Test with simple text content

#### Emergency Bypass:
- Temporarily disable the failing items
- Use local audio files instead
- Switch to different voice IDs

### Contact Support
If none of these steps resolve the issue:
1. ElevenLabs Support: Check their status page and documentation
2. n8n Community: Share the specific error output
3. Workflow Repository: Create an issue with full error details

Remember: The table of characters you saw is the smoking gun - it means ElevenLabs returned an error response instead of audio data. Focus on the API configuration and account status first.