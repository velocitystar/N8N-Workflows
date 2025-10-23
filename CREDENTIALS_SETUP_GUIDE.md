# ElevenLabs N8N Credential Setup Guide

## 🔐 Why Use N8N Credentials Instead of Environment Variables?

N8N's credential system is **much better** than hardcoded API keys or environment variables because:

- ✅ **Built into N8N UI** - Easy to manage through the web interface
- ✅ **Encrypted storage** - Credentials are encrypted in N8N's database
- ✅ **Team sharing** - Can be shared across team members securely
- ✅ **Version control safe** - No secrets in your workflow JSON files
- ✅ **Audit trail** - N8N logs credential usage
- ✅ **Easy rotation** - Change API keys without updating workflows

## 📋 Step-by-Step Setup

### Step 1: Create ElevenLabs API Credential in N8N

1. **Open N8N** in your browser
2. **Click on "Credentials"** in the left sidebar
3. **Click "Add Credential"** (+ button)
4. **Search for "HTTP Header Auth"** and select it
5. **Fill in the credential details:**

```
Credential Name: ElevenLabs API Key
Header Name: xi-api-key
Header Value: sk_your_actual_elevenlabs_api_key_here
```

6. **Click "Save"**

### Step 2: Get Your ElevenLabs API Key

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/)
2. Sign in to your account
3. Click on your profile (top right)
4. Select **"Profile"**
5. Copy your **API Key** from the "API Key" section
6. Paste this into the "Header Value" field in N8N

### Step 3: Import the Updated Workflows

Import these credential-based workflows:
- `elevenLabs-n8n-test-credentials.json` - For testing
- `elevenLabs-n8n-script1-credentials.json` - For batch processing

### Step 4: Link Credentials to Workflows

After importing:

1. **Open each workflow**
2. **Click on the HTTP Request node** ("Generate Audio")
3. **In the "Authentication" section:**
   - Set to: `Generic Credential Type`
   - Set "Generic Auth Type" to: `HTTP Header Auth`
   - Select your credential: `ElevenLabs API Key`
4. **Save the workflow**

## 🎯 Testing Your Setup

### Quick Test:
1. Run the **"ElevenLabs Simple Test (Credentials)"** workflow
2. Check the execution log for success messages
3. Verify audio file is created

### Batch Test:
1. Run the **"Distortion Check - Batched Generation (Credentials)"** workflow
2. Monitor progress in the execution log
3. Check that all audio files are generated successfully

## 📁 Updated File Structure

```
N8N Workflows/
├── README.md
├── SETUP_GUIDE.md (old environment variable method)
├── CREDENTIALS_SETUP_GUIDE.md (this file - recommended method)
├── 
├── ❌ OLD FILES (don't use these):
├── elevenLabs-n8n-script1.json (has hardcoded API key)
├── elevenLabs-n8n-test.json (has hardcoded API key)
├── elevenLabs-n8n-script1-fixed.json (uses env vars)
├── elevenLabs-n8n-test-fixed.json (uses env vars)
├── 
└── ✅ NEW FILES (use these):
    ├── elevenLabs-n8n-test-credentials.json (uses N8N credentials)
    └── elevenLabs-n8n-script1-credentials.json (uses N8N credentials)
```

## 🔧 HTTP Header Auth Configuration

When setting up the HTTP Header Auth credential:

| Field | Value |
|-------|--------|
| **Credential Name** | `ElevenLabs API Key` (or any name you prefer) |
| **Header Name** | `xi-api-key` |
| **Header Value** | `sk_your_actual_api_key_from_elevenlabs` |

## 🎤 Voice ID Configuration

The workflows come with these default voice IDs:
- **Victor Voice ID**: `T9xTMubBGC4Y9y6oHUza`
- **Lenny Voice ID**: `WbI4Toj5UDP91WAiEInp`

### To Use Different Voices:
1. Go to [ElevenLabs Voice Lab](https://elevenlabs.io/voice-lab)
2. Find or create the voices you want
3. Copy their Voice IDs
4. Edit the "Set Configuration" node in your workflows
5. Update the `victorVoiceId` and `lennyVoiceId` values

## 🔍 Troubleshooting Credentials

### "401 Unauthorized" Error
- ❌ **Problem**: API key is invalid or not set
- ✅ **Solution**: 
  1. Check your ElevenLabs account is active
  2. Regenerate API key if needed
  3. Update the credential in N8N
  4. Make sure the credential is selected in HTTP Request nodes

### "Credential not found" Error
- ❌ **Problem**: Workflow can't find the credential
- ✅ **Solution**:
  1. Check credential name matches exactly
  2. Ensure credential is saved
  3. Re-select credential in HTTP Request node

### "Header not sent" Error
- ❌ **Problem**: Authentication not configured properly
- ✅ **Solution**:
  1. Verify "Authentication" is set to "Generic Credential Type"
  2. Ensure "Generic Auth Type" is "HTTP Header Auth"
  3. Check header name is exactly `xi-api-key`

## 🎛️ Advanced Configuration

### Custom Voice Settings

You can modify voice settings in the HTTP Request JSON body:

```json
{
  "text": "Your text here",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.5,        // 0.0 to 1.0 (lower = more variable)
    "similarity_boost": 0.5, // 0.0 to 1.0 (higher = more like original)
    "style": 0.0,           // 0.0 to 1.0 (style exaggeration)
    "use_speaker_boost": true // Enhance speaker characteristics
  }
}
```

### Rate Limiting Adjustments

Based on your ElevenLabs plan:

| Plan | Max Requests/Second | Recommended Wait Time |
|------|-------------------|----------------------|
| Free | 2 | 3 seconds |
| Starter | 3 | 2 seconds |
| Creator | 5 | 1 second |
| Pro | 10 | 0.5 seconds |

To adjust: Edit the "Wait X Seconds" node in your workflow.

## 🔄 Credential Management Best Practices

### Security:
- 🔐 Never share credentials outside your N8N instance
- 🔄 Rotate API keys regularly
- 👥 Use team credentials for shared workflows
- 📝 Document which credentials are used where

### Organization:
- 📛 Use descriptive credential names (`ElevenLabs API Key`, not `API_KEY_1`)
- 📁 Group related credentials
- 🏷️ Tag credentials with project names
- 📋 Keep a list of what each credential is used for

### Maintenance:
- 🔍 Regularly audit unused credentials
- 🗑️ Delete expired or unused credentials
- ✅ Test credentials periodically
- 📊 Monitor usage in ElevenLabs dashboard

## 🚀 Next Steps

1. **Delete old workflows** that use hardcoded keys or environment variables
2. **Set up the credential** following this guide
3. **Test with the simple workflow** first
4. **Run the batch workflow** for your full script
5. **Monitor usage** in your ElevenLabs dashboard
6. **Scale up** once everything works perfectly

## 💡 Pro Tips

- **Start with test workflow** - Always verify credentials work before running large batches
- **Monitor your usage** - Check ElevenLabs dashboard to avoid hitting limits
- **Use descriptive names** - Name your audio files clearly for organization
- **Backup credentials** - Document your API keys securely outside N8N
- **Test voice quality** - Generate a few samples to ensure voices sound right

---

✨ **You're all set!** This credential-based approach is much more secure and manageable than the previous methods. Your API keys are now safely stored in N8N's encrypted credential system.