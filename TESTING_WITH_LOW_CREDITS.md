# Testing Workflow with Low ElevenLabs Credits

## Configuration Changes Made

Your "Distortion Check - v3 Alpha Remote JSON.json" workflow has been optimized for testing with low credits:

### Batch Size Reduced
- **Before**: 5 items per batch
- **After**: 1 item per batch
- **Credits saved**: 80% reduction in API calls

### Expected Behavior
- **Batch 1**: Process 1 audio file, then wait 3 seconds
- **Batch 2**: Process 1 more audio file, then complete
- **Total API calls**: Only 2 (instead of 10+ for full processing)

## Testing Steps

### Step 1: Run the First Batch
1. Execute the workflow
2. Watch the console output for:
   ```
   📊 Processing v3 Alpha batch 1/[total]: lines 1 to 1
   🔄 Will automatically continue to next batch
   ```
3. Verify you see successful audio generation (no character table)
4. Check that Cloudinary upload completes

### Step 2: Automatic Second Batch
1. After 3-second wait, batch 2 should start automatically
2. Look for:
   ```
   📊 Processing v3 Alpha batch 2/[total]: lines 2 to 2
   ```
3. This completes your 2-batch test

### Step 3: Manual Stop (Optional)
If you want to stop after 2 batches instead of continuing:
1. Go to "Set Configuration" node
2. Temporarily change `startIndex` from 0 to 2
3. This will make the workflow think it's already processed the first 2 items

## What to Watch For

### Success Indicators
- ✅ Console shows "Binary audio data found for [filename]"
- ✅ No "table of characters" in Generate Audio output
- ✅ Cloudinary upload completes with secure_url
- ✅ 3-second delay between batches

### Failure Indicators
- ❌ "No binary audio data found" error
- ❌ Table of characters in Generate Audio node
- ❌ ElevenLabs API error messages
- ❌ Upload failures

## Credit Usage Estimate

### Per Successful Audio Generation
- **Turbo v2.5 model**: ~1-2 credits per ~30 seconds of audio
- **Your test**: 2 audio files = ~2-4 credits total
- **Safe for low credit accounts**

### If Credits Run Out
The workflow will fail gracefully with the error handling we added:
```
❌ No binary audio data found for [filename]
This usually means ElevenLabs API returned an error instead of audio
Check: API key, voice ID, quota, and request format
```

## Troubleshooting

### If First Batch Fails
1. **Check Voice IDs**: Ensure Victor and Lenny voice IDs are valid
2. **Verify API Key**: Test in ElevenLabs dashboard
3. **Check Credits**: Even 1-2 credits should be enough for testing
4. **Simplify Text**: Use shorter text content if available

### If Second Batch Fails
1. **Rate Limiting**: ElevenLabs may be rate limiting requests
2. **Credit Depletion**: First batch used remaining credits
3. **API Issues**: Temporary ElevenLabs service issues

## Recovery Options

### Add More Credits
- Go to elevenlabs.io billing
- Add minimum credits ($1-5 should be plenty for testing)
- Resume workflow execution

### Switch to Free Tier Limits
- Use different voice IDs that work with free tier
- Reduce text length to minimum
- Test with single words or short phrases

### Alternative Testing
- Use local audio files instead of ElevenLabs
- Test Cloudinary upload separately
- Focus on workflow logic without API calls

## Current Configuration Summary

```javascript
{
  "contentUrl": "https://raw.githubusercontent.com/velocitystar/N8N-Workflows/main/docs/distortion-check-v3-alpha-test.json",
  "victorVoiceId": "T9xTMubBGC4Y9y6oHUza",
  "lennyVoiceId": "WbI4Toj5UDP91WAiEInp",
  "cloudinaryFolder": "elevenlabs-audio/v3-alpha-test",
  "cloudName": "dly199qqv",
  "maxItems": 1,  // ← Reduced for testing
  "startIndex": 0
}
```

## Next Steps After Testing

Once you confirm the workflow works with 2 batches:

1. **Add credits** to your ElevenLabs account
2. **Increase batch size** back to 3-5 items
3. **Run full episode processing**
4. **Monitor credit usage** during production runs

## Emergency Stop

If you need to stop the workflow immediately:
- Click the "Stop Execution" button in n8n
- The workflow will halt gracefully
- No partial charges for incomplete audio generation

Remember: This configuration uses minimal credits while testing all workflow components. Perfect for validating your setup before larger runs!