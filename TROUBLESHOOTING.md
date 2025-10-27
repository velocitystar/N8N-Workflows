# N8N Workflows Troubleshooting Guide

## Common Errors and Solutions

### Error: "Cannot read properties of undefined (reading 'data')" in Prepare for Upload Node

**Error Details:**
- Error occurs at line 15 in "Prepare for Upload" node  
- Full error: `TypeError: Cannot read properties of undefined (reading 'data')`
- Node shows table of characters instead of binary audio data

**Root Cause:**
The ElevenLabs API is returning an error response (HTML/text) instead of binary audio data. This causes `item.binary` to be undefined when the code tries to access `item.binary.data`.

**Common Causes:**
1. **Invalid API Key** - Authentication failure
2. **Invalid Voice ID** - Voice doesn't exist or isn't accessible  
3. **API Quota Exceeded** - No credits remaining
4. **Invalid Request Format** - Payload structure issues
5. **Rate Limiting** - Too many requests too quickly
6. **Model/Voice Compatibility** - Voice doesn't support the requested model

**Fixed Code:**
The "Prepare for Upload" node now includes proper validation:
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

**Debugging Steps:**
1. Check "Generate Audio" node output - if you see character table instead of binary indicator, API failed
2. Verify ElevenLabs API key in n8n credentials
3. Confirm voice IDs are valid and accessible
4. Check ElevenLabs account credits and quota
5. Test with single item and simple text
6. Add debug node after "Generate Audio" to inspect response

**Quick Fixes:**
- Update voice IDs in configuration
- Add credits to ElevenLabs account
- Regenerate and update API key  
- Reduce batch size for testing
- Use different/known-good voice IDs

### Error: "Cannot read properties of undefined (reading 'replace')" in Prepare for Upload Node

**Error Details:**
- Error occurs at line 5 in "Prepare for Upload" node
- Full error: `TypeError: Cannot read properties of undefined (reading 'replace')`
- Stack trace shows error in Code node execution

**Root Cause:**
The error occurs when the `fileName` property is undefined in the input data, but the code tries to call `.replace('.wav', '')` on it without checking if it exists first.

**Problematic Code:**
```javascript
publicId: `${item.json.cloudinaryFolder}/${item.json.fileName.replace('.wav', '')}`,
```

**Fixed Code:**
```javascript
// Safety check for fileName
const fileName = item.json.fileName || 'unknown.wav';
const fileNameWithoutExt = fileName.replace('.wav', '');

return {
  json: {
    ...item.json,
    publicId: `${item.json.cloudinaryFolder}/${fileNameWithoutExt}`,
    uploadReady: true
  },
  // ... rest of the code
};
```

**Why This Happens:**
1. Data structure inconsistencies between workflow nodes
2. Missing or malformed input from previous nodes
3. ElevenLabs API responses not containing expected fileName field
4. Script loading issues that don't populate fileName property
5. Remote JSON content missing fileName fields

**Prevention:**
- Always use defensive programming with optional chaining or fallback values
- Add logging to track data flow between nodes
- Validate input data structure before processing
- Check remote JSON structure before processing

**Files Fixed:**
- `production/Distortion Check - Auto Loop known good.json`
- `production/Distortion Check - JSON URL - Based on Known Good.json`
- `production/Distortion Check - v3 Alpha Remote JSON.json` (both "Prepare for Upload" and "Process Remote Content" nodes)

**Alternative Approaches:**
1. Use optional chaining: `item.json.fileName?.replace('.wav', '') || 'unknown'`
2. Add input validation node before processing
3. Use try-catch blocks around problematic operations

### Workflow-Specific Issues

#### Distortion Check - v3 Alpha Remote JSON
This workflow has TWO nodes that can cause the fileName error:

1. **Process Remote Content (v3 Alpha)** node - Line that creates publicId during content processing
2. **Prepare for Upload** node - Line that processes publicId for Cloudinary upload

Both have been fixed with proper fileName validation.

**Common causes in v3 Alpha workflow:**
- Remote JSON content missing fileName properties
- Inconsistent data structure in external JSON files
- Voice mapping issues affecting data flow

### General Debugging Tips

1. **Add Logging Nodes:** Insert Code nodes with `console.log()` statements to track data flow
2. **Check Node Output:** Use the n8n interface to inspect what each node outputs
3. **Validate Data Structure:** Always verify that expected properties exist before using them
4. **Use Fallback Values:** Provide default values for critical properties
5. **Test with Minimal Data:** Start with single items to isolate issues
6. **Validate Remote JSON:** Check external JSON files have expected structure

### Best Practices for Code Nodes

1. **Always validate inputs:**
```javascript
if (!$input.item.json.fileName) {
  console.error('Missing fileName in input data');
  return [{ json: { error: 'Missing fileName' } }];
}
```

2. **Use defensive programming:**
```javascript
const fileName = $input.item.json.fileName || 'default.wav';
const speaker = $input.item.json.speaker || 'Unknown';
```

3. **Log important operations:**
```javascript
console.log('Processing item:', $input.item.json.fileName || 'NO_FILENAME');
console.log('Current operation: Preparing for upload');
```

4. **Handle edge cases:**
```javascript
if (!$input.all() || $input.all().length === 0) {
  console.log('No items to process');
  return [];
}
```

5. **Validate remote content:**
```javascript
if (!remoteData || !remoteData.content) {
  throw new Error('Invalid remote JSON structure');
}
```

### Workflow-Specific Notes

- **Distortion Check workflows:** These handle podcast episode generation and require specific fileName formats
- **Rich Remote JSON workflows:** These fetch content from external URLs and may have different data structures
- **v3 Alpha workflows:** Support advanced ElevenLabs features and Audio Tags but require more robust error handling
- **Batch processing:** Always preserve batch control data when passing between nodes

### Remote JSON Structure Validation

For v3 Alpha workflows, ensure your remote JSON has this structure:
```json
{
  "content": [
    {
      "fileName": "EP01_Speaker_Section_01.wav",
      "speaker": "Victor",
      "text": "Your text here",
      "voiceId": "optional-voice-id"
    }
  ],
  "defaultSettings": {},
  "voiceMapping": {}
}
```

### Contact and Updates

### ElevenLabs API Troubleshooting

For detailed ElevenLabs API debugging, see `ELEVENLABS_DEBUG.md` which includes:
- Comprehensive error analysis
- Debug node templates
- Configuration validation steps
- Common error patterns and solutions

This document should be updated whenever new issues are discovered or resolved.
Last updated: Added ElevenLabs API error debugging for binary data issues, plus fileName undefined error resolution.