# ElevenLabs N8N Workflow Setup Guide

## 🚨 Critical Issues Fixed

Your original workflows had several problems that caused the "too many service requests" error:

### 1. **Rate Limiting Issues**
- **Problem**: Processing all audio requests too quickly
- **Solution**: Added 2-second delays between API calls and proper retry logic

### 2. **Security Vulnerabilities** 
- **Problem**: API keys hardcoded in workflow files
- **Solution**: Moved to environment variables

### 3. **Missing Error Handling**
- **Problem**: Workflow fails completely on any API error
- **Solution**: Added error handling, retries, and detailed logging

## 📁 Files Overview

- `elevenLabs-n8n-script1.json` - ❌ Original (has issues)
- `elevenLabs-n8n-test.json` - ❌ Original (has issues)
- `elevenLabs-n8n-script1-fixed.json` - ✅ Fixed batch workflow
- `elevenLabs-n8n-test-fixed.json` - ✅ Fixed test workflow

## 🔧 Setup Instructions

### Step 1: Set Environment Variables in N8N

You need to set these environment variables in your N8N instance:

```bash
# Required
ELEVENLABS_API_KEY=sk_your_actual_api_key_here

# Optional (will use defaults if not set)
ELEVENLABS_VICTOR_VOICE_ID=T9xTMubBGC4Y9y6oHUza
ELEVENLABS_LENNY_VOICE_ID=WbI4Toj5UDP91WAiEInp
AUDIO_OUTPUT_FOLDER=./audio_output
```

#### How to Set Environment Variables:

**Option A: N8N Environment File**
1. Create/edit your `.env` file in your N8N directory
2. Add the variables above
3. Restart N8N

**Option B: System Environment Variables**
- **Windows**: Set in System Properties > Environment Variables
- **Linux/Mac**: Add to your shell profile (`.bashrc`, `.zshrc`, etc.)

**Option C: Docker**
```bash
docker run -e ELEVENLABS_API_KEY=your_key_here n8nio/n8n
```

### Step 2: Import Fixed Workflows

1. Delete your old workflows or rename them
2. Import the fixed versions:
   - `elevenLabs-n8n-test-fixed.json` - Start with this one
   - `elevenLabs-n8n-script1-fixed.json` - Use this for batch processing

### Step 3: Test Your Setup

1. **Run the test workflow first** (`ElevenLabs Simple Test (Fixed)`)
2. Check the execution log for success/error messages
3. Verify the audio file is generated in your output folder

## 🔍 What Was Fixed

### Rate Limiting Solutions:
- **2-second delays** between API calls (ElevenLabs allows ~2-3 requests/second)
- **Automatic retries** with exponential backoff (3 retries max)
- **Individual processing** instead of batching (better control)
- **Proper timeout settings** (30 seconds per request)

### Security Improvements:
- **Environment variables** for API keys (no more hardcoded secrets)
- **Validation checks** to ensure API key exists before running
- **Fallback values** for voice IDs if environment variables aren't set

### Error Handling:
- **Detailed error logging** with specific suggestions
- **Continue on fail** instead of stopping entire workflow
- **Success/failure branching** to handle both outcomes
- **HTTP status code interpretation** (401=auth, 429=rate limit, etc.)

## 📊 ElevenLabs Rate Limits

| Plan | Requests/Second | Requests/Month |
|------|----------------|----------------|
| Free | 2 req/sec | 10,000 |
| Starter | 3 req/sec | 30,000 |
| Creator | 5 req/sec | 100,000 |
| Pro | 10 req/sec | 500,000 |

## 🐛 Troubleshooting

### "ELEVENLABS_API_KEY environment variable is required"
- Your API key isn't set properly
- Check your environment variable setup
- Restart N8N after setting variables

### "Rate limit exceeded" / "too many service requests"
- Increase wait time between requests (change from 2 to 3+ seconds)
- Check your ElevenLabs plan limits
- Consider processing smaller batches

### "401 Unauthorized" 
- API key is invalid or expired
- Check your ElevenLabs account status
- Regenerate API key if needed

### "422 Unprocessable Entity"
- Voice ID might be invalid
- Text might be too long or contain invalid characters
- Check your voice settings

### Audio files not saving
- Check your `AUDIO_OUTPUT_FOLDER` path exists
- Ensure N8N has write permissions to that folder
- Check available disk space

## 🎯 Best Practices

1. **Always test first** with the simple test workflow
2. **Monitor your usage** in the ElevenLabs dashboard
3. **Use appropriate delays** based on your plan's rate limits
4. **Keep API keys secure** (never commit them to code)
5. **Process in smaller batches** for large scripts (5-10 items max)

## 📈 For Large Batches

If you need to process many audio files:

1. Split your script into smaller chunks (5-10 lines per run)
2. Use the batch workflow multiple times instead of one large run
3. Consider upgrading your ElevenLabs plan for higher rate limits
4. Monitor your monthly usage to avoid overages

## 🔄 Next Steps

1. Test the fixed workflows
2. Verify your audio quality
3. Adjust voice settings if needed (stability, similarity_boost)
4. Scale up to your full script once everything works