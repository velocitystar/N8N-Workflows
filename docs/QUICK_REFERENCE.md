# Quick Reference Guide - N8N ElevenLabs TTS Workflows

A quick reference for common tasks, configurations, and troubleshooting.

## 🚀 Quick Start

### 1. Import & Configure (5 minutes)
```
1. Import: production/Distortion Check - Auto Loop Complete.json
2. Set credentials: ElevenLabs-API, Cloudinary-Auth
3. Test with 2-item sample content
4. Execute workflow
```

### 2. Content Format
```json
[
  {
    "row": 1,
    "speaker": "narrator",
    "fileName": "intro_001",
    "text": "Your text here...",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  }
]
```

## ⚙️ Common Configurations

### Batch Sizes by Plan
| Plan | Batch Size | Delay | Max Concurrent |
|------|------------|-------|----------------|
| Starter | 3 | 5s | 3 |
| Creator | 5 | 3s | 10 |
| Pro | 10 | 2s | 15 |

### Popular Voice IDs
```javascript
"21m00Tcm4TlvDq8ikWAM" // Rachel (narrator)
"AZnzlk1XvdvUeBnXmlld" // Adam (male)
"EXAVITQu4vr4xnSDxMaL" // Bella (female)
"ErXwobaYiN019PkySvjV" // Antoni (male)
"MF3mGyEYCl7XYWbV9V6O" // Elli (female)
"TxGEqnHWrfWFTfGW9XjX" // Josh (male)
```

### Voice Settings
```json
{
  "stability": 0.5,        // 0-1 (higher = more stable)
  "similarity_boost": 0.5, // 0-1 (higher = more similar)
  "style": 0.0,           // 0-1 (v2 models only)
  "use_speaker_boost": true
}
```

## 🔧 Quick Fixes

### Authentication Issues
```
ElevenLabs Error: Check xi-api-key header
Cloudinary Error: Verify base64 encoding of api_key:api_secret
N8N Credentials: Ensure credentials are saved and selected
```

### Rate Limiting
```
Error 429: Increase batch delays (3s → 5s)
Quota exceeded: Check ElevenLabs dashboard usage
Too fast: Reduce batch size or add per-request delays
```

### Upload Failures
```
Cloudinary 401: Check Authorization header format
File too large: Check Cloudinary plan limits
Invalid format: Use resource_type: "video" for audio
```

## 📝 Node Quick Config

### HTTP Request (ElevenLabs TTS)
```
Method: POST
URL: https://api.elevenlabs.io/v1/text-to-speech/{{$json.voiceId}}
Headers: 
  - xi-api-key: [ElevenLabs-API credential]
  - Content-Type: application/json
Body: {
  "text": "{{$json.text}}",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {...}
}
```

### HTTP Request (Cloudinary Upload)
```
Method: POST
URL: https://api.cloudinary.com/v1_1/{{$json.cloudName}}/video/upload
Headers:
  - Authorization: [Cloudinary-Auth credential]
Body (form-data):
  - file: [binary audio data]
  - public_id: {{$json.fileName}}
  - folder: tts-audio
  - resource_type: video
```

### SplitInBatches Configuration
```
Batch Size: 5
Input Data: {{$json.items}}
Reset: false (for continuous processing)
```

### Wait Node
```
Amount: 3 (seconds)
Unit: seconds
Resume On: "Interval"
```

## 🐛 Debugging Checklist

### Before Execution
- [ ] Credentials configured and saved
- [ ] Content format validated
- [ ] Batch size appropriate for plan
- [ ] Voice IDs exist and accessible
- [ ] Text length < 5000 characters per item

### During Execution
- [ ] Check execution logs for errors
- [ ] Monitor API rate limit headers
- [ ] Verify file generation before upload
- [ ] Track batch progress in logs

### After Execution
- [ ] Verify all files uploaded to Cloudinary
- [ ] Check audio quality and duration
- [ ] Review error logs for failed items
- [ ] Confirm total usage vs. plan limits

## 📊 Monitoring & Metrics

### Key Metrics to Track
```
Success Rate: (Successful items / Total items) × 100
Processing Time: Total execution duration
API Usage: Characters processed vs. plan limit
Upload Success: Files uploaded vs. generated
Error Rate: Failed items / Total items
```

### Log Analysis
```bash
# Search for common errors in N8N logs
grep -i "rate limit" n8n.log
grep -i "authentication" n8n.log
grep -i "cloudinary" n8n.log
grep -i "elevenlabs" n8n.log
```

## 🔄 Content Loading Patterns

### Static Array (Simple)
```javascript
// In Code node
const content = [
  { row: 1, speaker: "narrator", fileName: "001", text: "..." },
  // ... more items
];
return content.map((item, index) => ({ json: item, index }));
```

### CSV Loading
```javascript
// HTTP Request → CSV Parse → Code node
const rows = $input.all();
return rows.map((row, index) => ({
  json: {
    row: row.json.row,
    speaker: row.json.speaker,
    fileName: row.json.fileName,
    text: row.json.text,
    voiceId: row.json.voiceId || "21m00Tcm4TlvDq8ikWAM"
  },
  index
}));
```

### Google Sheets
```javascript
// Google Sheets node → Code node
const sheets = $input.all();
return sheets.map((row, index) => ({
  json: {
    row: row.json.row,
    speaker: row.json.speaker,
    fileName: row.json.fileName,
    text: row.json.text,
    voiceId: row.json.voiceId
  },
  index
}));
```

## 🎯 Performance Tips

### Large Datasets (>100 items)
1. **Use smaller batches** (3-5 items)
2. **Add progress tracking** (log every 10th batch)
3. **Implement checkpoints** (save progress state)
4. **Monitor memory usage** (split very large jobs)
5. **Use sequential processing** if batching is unstable

### Cost Optimization
1. **Optimize text length** (remove unnecessary words)
2. **Choose efficient models** (monolingual vs multilingual)
3. **Cache common phrases** (avoid re-generation)
4. **Monitor usage patterns** (peak vs off-peak processing)

### Quality Optimization
1. **Test voices with sample text** before bulk processing
2. **Adjust voice settings** per speaker type
3. **Use consistent punctuation** for natural pauses
4. **Review generated samples** before large batches

## 🚨 Emergency Procedures

### Workflow Stuck/Hanging
1. **Stop execution** in N8N interface
2. **Check running processes** for resource usage
3. **Review last successful node** in execution log
4. **Restart with smaller batch** size
5. **Use manual processing** if auto-loop fails

### API Quota Exhausted
1. **Stop all running workflows**
2. **Check usage in ElevenLabs dashboard**
3. **Wait for quota reset** (monthly/daily depending on plan)
4. **Reduce batch sizes** for remaining processing
5. **Consider upgrading plan** if needed regularly

### Mass Upload Failures
1. **Check Cloudinary dashboard** for error patterns
2. **Verify credential expiration**
3. **Test with single file** upload
4. **Switch to local storage** temporarily
5. **Contact Cloudinary support** if persistent

## 📞 Support Resources

### Documentation
- [Setup Guide](SETUP_GUIDE.md) - Detailed configuration instructions
- [Content Examples](content-examples.js) - Sample data structures
- [Changelog](CHANGELOG.md) - Version history and migration notes

### API References
- [ElevenLabs API Docs](https://docs.elevenlabs.io)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [N8N Node Reference](https://docs.n8n.io/integrations/)

### Community
- N8N Community Forum
- ElevenLabs Discord Server
- GitHub Issues (this repository)

---

**💡 Pro Tip**: Always test with 1-2 items before processing large batches!

**Last Updated**: January 2025  
**Version**: 3.0