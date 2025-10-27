# Setup Guide - N8N ElevenLabs TTS Workflows

This guide will walk you through setting up the N8N workflows for automated text-to-speech generation using ElevenLabs API.

## Prerequisites

- N8N instance (self-hosted or cloud)
- ElevenLabs account with API access
- Cloudinary account for audio storage
- Basic understanding of N8N workflows

## Step 1: Account Setup

### ElevenLabs Account
1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Navigate to your profile settings
3. Generate an API key
4. Note your character/request limits based on your plan
5. Test available voices and note their IDs

### Cloudinary Account
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard → Settings → Security
3. Note your Cloud Name, API Key, and API Secret
4. Create an upload preset (optional but recommended):
   - Go to Settings → Upload
   - Create a new upload preset
   - Set folder structure and access permissions

## Step 2: N8N Credential Configuration

### Method 1: N8N Credentials (Recommended)

#### ElevenLabs Credential
1. In N8N, go to Settings → Credentials
2. Click "Create New Credential"
3. Search for "HTTP Header Auth"
4. Configure:
   - **Credential Name**: `ElevenLabs-API`
   - **Header Name**: `xi-api-key`
   - **Header Value**: `your-elevenlabs-api-key`
5. Save the credential

#### Cloudinary Credential (Option A - Simple Auth)
1. Create another "HTTP Header Auth" credential
2. Configure:
   - **Credential Name**: `Cloudinary-Auth`
   - **Header Name**: `Authorization`
   - **Header Value**: `Basic {base64(api_key:api_secret)}`

To generate the base64 value:
```bash
# Replace with your actual API key and secret
echo -n "your_api_key:your_api_secret" | base64
```

#### Cloudinary Credential (Option B - Full API Access)
1. Create a "Generic Credential"
2. Add the following fields:
   - `cloud_name`: Your Cloudinary cloud name
   - `api_key`: Your Cloudinary API key
   - `api_secret`: Your Cloudinary API secret

### Method 2: Environment Variables (Alternative)

Add to your N8N environment:
```env
ELEVENLABS_API_KEY=your-api-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 3: Import Workflows

1. Download the workflow JSON files from the `production/` folder
2. In N8N, click "Import from File" or "Import from URL"
3. Select the workflow file
4. The workflow will be imported with all nodes configured

### Recommended Import Order:
1. Start with `Distortion Check - Simple All Items.json` for testing
2. Move to `Distortion Check - Manual Batches.json` for controlled processing
3. Finally use `Distortion Check - Auto Loop Complete.json` for production

## Step 4: Configure Workflow Settings

### Basic Configuration
Open the imported workflow and update these key settings:

#### 1. Content Input Node
- Update the sample content array
- Or configure dynamic content loading (API/Sheets/CSV)

#### 2. ElevenLabs TTS Node
```json
{
  "voice_id": "21m00Tcm4TlvDq8ikWAM",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.5,
    "style": 0.0,
    "use_speaker_boost": true
  }
}
```

#### 3. Batch Settings (in SplitInBatches node)
- **Batch Size**: 5 (adjust based on your rate limits)

#### 4. Rate Limiting (in Wait nodes)
- **Between Batches**: 3000ms (3 seconds)
- **Between Requests**: 1000ms (1 second)

#### 5. Cloudinary Upload Node
- **Cloud Name**: Your Cloudinary cloud name
- **Upload Preset**: Your preset name (if using)
- **Folder**: Target folder for audio files
- **Resource Type**: `video` (for audio files)

## Step 5: Testing

### Initial Test (Small Batch)
1. Create a test content array with 2-3 items:
```json
[
  {
    "row": 1,
    "speaker": "narrator",
    "fileName": "test_001",
    "text": "This is a test of the text-to-speech system."
  },
  {
    "row": 2,
    "speaker": "narrator", 
    "fileName": "test_002",
    "text": "If you can hear this, the setup is working correctly."
  }
]
```

2. Execute the workflow manually
3. Check the execution log for errors
4. Verify audio files are generated and uploaded to Cloudinary

### Credential Test
If you encounter authentication errors:

1. Test ElevenLabs API directly:
```bash
curl -X POST \
  -H "xi-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}}' \
  https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM
```

2. Test Cloudinary upload:
```bash
curl -X POST \
  -F "file=@test.mp3" \
  -F "upload_preset=your_preset" \
  https://api.cloudinary.com/v1_1/your-cloud-name/video/upload
```

## Step 6: Production Setup

### Content Management
Choose your content source:

#### Option A: Static JSON Array
- Edit the workflow's input node directly
- Good for fixed content that doesn't change often

#### Option B: External API
- Configure HTTP Request node to fetch content
- Update the API endpoint and authentication
- Ensure the API returns data in the expected format

#### Option C: Google Sheets
- Use Google Sheets node
- Configure OAuth2 credentials for Google
- Set up sheet with columns: row, speaker, fileName, text, voiceId

#### Option D: CSV File
- Use HTTP Request node to fetch CSV
- Add CSV parsing logic
- Ensure CSV has proper headers

### Voice Mapping
Create a consistent voice mapping for your speakers:

```javascript
const voiceMapping = {
  "narrator": "21m00Tcm4TlvDq8ikWAM",    // Rachel
  "character1": "AZnzlk1XvdvUeBnXmlld",  // Adam
  "character2": "EXAVITQu4vr4xnSDxMaL",  // Bella
  // Add more as needed
};
```

### Rate Limiting Optimization
Adjust based on your ElevenLabs plan:

- **Starter**: 10,000 characters/month, 3 concurrent requests
  - Batch size: 3
  - Delay: 5 seconds between batches

- **Creator**: 100,000 characters/month, 10 concurrent requests
  - Batch size: 5
  - Delay: 3 seconds between batches

- **Pro**: 500,000 characters/month, 15 concurrent requests
  - Batch size: 10
  - Delay: 2 seconds between batches

## Step 7: Monitoring & Maintenance

### Logging Setup
Enable detailed logging in the workflow:
1. Add logging nodes at key points
2. Log batch progress and completion status
3. Track success/failure rates
4. Monitor API usage and rate limits

### Error Handling
The workflows include error handling for:
- API rate limit exceeded
- Network timeouts
- Invalid audio generation
- Upload failures

### Regular Maintenance
- Monitor ElevenLabs usage vs. plan limits
- Clean up old audio files in Cloudinary if needed
- Update voice IDs if voices are changed/removed
- Review and update rate limiting settings

## Troubleshooting

### Common Issues

#### Authentication Errors
- **ElevenLabs**: Verify API key is active and has sufficient quota
- **Cloudinary**: Check API credentials and permissions
- **N8N Credentials**: Ensure credentials are saved and selected in nodes

#### Rate Limiting Issues
- Increase delay between requests/batches
- Reduce batch size
- Check your current API usage in ElevenLabs dashboard

#### Audio Generation Failures
- Verify voice ID exists and is available
- Check text length (max ~5000 characters per request)
- Ensure voice settings are valid ranges (0-1)

#### Upload Failures
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper resource type (video for audio)
- Verify folder permissions

### Debug Mode
To debug issues:
1. Enable "Save Execution Progress" in workflow settings
2. Add "Stop and Error" nodes after critical steps
3. Use "Code" nodes to log intermediate data
4. Test with single items before batch processing

## Performance Optimization

### For Large Datasets
- Use smaller batch sizes to reduce memory usage
- Implement checkpointing to resume from failures
- Consider splitting very large jobs across multiple workflows
- Monitor system resources during execution

### Cost Optimization
- Use appropriate voice models (monolingual vs multilingual)
- Optimize text length while maintaining quality
- Cache generated audio to avoid re-processing
- Monitor usage patterns and adjust batch timing

## Security Best Practices

1. **Never hardcode API keys** in workflow JSON
2. **Use N8N credentials** for all sensitive data
3. **Limit Cloudinary permissions** to only required operations
4. **Regularly rotate API keys**
5. **Monitor API usage** for unusual activity
6. **Use HTTPS** for all external requests
7. **Validate input data** to prevent injection attacks

## Support & Resources

### Documentation
- [ElevenLabs API Docs](https://docs.elevenlabs.io)
- [Cloudinary API Docs](https://cloudinary.com/documentation)
- [N8N Documentation](https://docs.n8n.io)

### Community Resources
- N8N Community Forum
- ElevenLabs Discord
- GitHub Issues (this project)

### Getting Help
If you encounter issues:
1. Check the troubleshooting section above
2. Review N8N execution logs
3. Test individual API endpoints outside N8N
4. Create minimal reproduction case
5. Consult community resources

---

**Last Updated**: January 2025  
**Version**: 3.0  
**Compatibility**: N8N 1.0+, ElevenLabs API v1, Cloudinary API v1.1