# Cloudinary Integration Setup Guide

## 🚀 Overview

This guide shows you how to set up Cloudinary integration with your ElevenLabs N8N workflows. Cloudinary is perfect for managing your audio files in the cloud with automatic optimization, transformations, and global CDN delivery.

## ✅ Why Cloudinary is Perfect for Audio Files

- **☁️ Cloud Storage** - Files stored in the cloud with global CDN
- **🔄 Auto Transformations** - Automatic MP3 conversion from WAV
- **📊 Optimization** - File compression and quality optimization
- **🔗 Direct URLs** - Get instant shareable URLs
- **📱 Cross-Device Access** - Access from anywhere
- **🏷️ Tagging & Organization** - Organize files with tags and folders
- **📈 Analytics** - Track usage and performance
- **💾 No Local Storage** - Perfect for systems that can't store files

## 🔧 Step-by-Step Setup

### Step 1: Get Your Cloudinary Credentials

1. **Go to Cloudinary Dashboard**
   - Visit [Cloudinary.com](https://cloudinary.com/)
   - Sign in to your existing account

2. **Find Your API Credentials**
   - Go to your **Dashboard** (main page after login)
   - In the "Product Environment Credentials" section, you'll see:
     - **Cloud Name**: `your-cloud-name`
     - **API Key**: `123456789012345`
     - **API Secret**: `your-api-secret-here`
   - Copy these values (you'll need them for N8N)

### Step 2: Create Cloudinary Credential in N8N

1. **Open N8N** in your browser
2. **Go to Credentials** (left sidebar)
3. **Click "Add Credential"** (+ button)
4. **Search for "Cloudinary API"** and select it
5. **Fill in the credential details:**

```
Credential Name: Cloudinary API
Cloud Name: your-cloud-name
API Key: 123456789012345
API Secret: your-api-secret-here
```

6. **Click "Save"**

### Step 3: Configure Your Folder Structure (Optional)

You can organize your files in Cloudinary folders. The workflows use these default folder structures:

- **Test files**: `elevenlabs-audio/tests/`
- **Episode files**: `elevenlabs-audio/episode-01/`

To customize, edit the folder paths in the workflow's "Set Variables/Configuration" node.

### Step 4: Import and Configure Workflows

#### For Test Workflow:
1. **Import** `elevenLabs-n8n-test-cloudinary.json`
2. **Open the workflow** and edit the "Set Variables" node
3. **Customize the Cloudinary folder** (optional):
   ```
   cloudinaryFolder: elevenlabs-audio/tests
   ```
4. **Check the Cloudinary upload node** has your credential selected
5. **Save** the workflow

#### For Batch Workflow:
1. **Import** `elevenLabs-n8n-script1-cloudinary.json`
2. **Open the workflow** and edit the "Set Configuration" node
3. **Customize the Cloudinary folder** (optional):
   ```
   cloudinaryFolder: elevenlabs-audio/episode-01
   ```
4. **Check the Cloudinary upload node** has your credential selected
5. **Save** the workflow

## 📁 Workflow Files

### ✅ Cloudinary Integration Workflows:
- `elevenLabs-n8n-test-cloudinary.json` - Test workflow with Cloudinary upload
- `elevenLabs-n8n-script1-cloudinary.json` - Batch processing with Cloudinary upload

### ❌ Previous Versions (don't use these for cloud storage):
- All other versions save files locally or use other cloud providers

## 🎯 How It Works

### Workflow Process:
1. **Audio Generation**: ElevenLabs generates audio file
2. **Prepare Upload**: File is converted to base64 and prepared
3. **Cloudinary Upload**: File is uploaded with automatic optimizations
4. **Success Logging**: Upload confirmation with Cloudinary URLs

### File Organization:
```
📁 elevenlabs-audio/
├── 📁 tests/
│   └── test_audio_2024-01-15_14-30-25.wav (+ .mp3)
└── 📁 episode-01/
    ├── EP01_Victor_ColdOpen_01.wav (+ .mp3)
    ├── EP01_Lenny_ColdOpen_02.wav (+ .mp3)
    └── ... (all episode files)
```

### Automatic Features:
- **WAV + MP3**: Each upload creates both WAV (original) and MP3 (compressed)
- **Tags**: Files are tagged with `elevenlabs`, `episode-01`, `victor`/`lenny`
- **CDN URLs**: Get instant global CDN URLs for fast access
- **Optimized Delivery**: Cloudinary serves the best format for each device

## 🔍 Testing Your Setup

### Quick Test:
1. **Run the test workflow** (`ElevenLabs Test with Cloudinary Upload`)
2. **Check the execution log** for success messages
3. **Verify in Cloudinary Dashboard** that the audio file appears
4. **Test the URLs** to ensure files are accessible

### Expected Test Output:
```
🎉 SUCCESS! Audio file uploaded to Cloudinary!
📄 Original file name: test_audio_2024-01-15_14-30-25.wav
🆔 Cloudinary public ID: elevenlabs-audio/tests/test_audio_2024-01-15_14-30-25
🔗 Secure URL: https://res.cloudinary.com/your-cloud/video/upload/elevenlabs-audio/tests/test_audio_2024-01-15_14-30-25.wav
📊 File size: 245 KB
⏱️ Duration: 12 seconds
🔄 Available formats:
   - mp3: https://res.cloudinary.com/your-cloud/video/upload/f_mp3/elevenlabs-audio/tests/test_audio_2024-01-15_14-30-25.mp3
```

### Batch Test:
1. **Run a small batch** first (modify script to include only 2-3 lines)
2. **Monitor progress** in execution logs
3. **Check Cloudinary Media Library** for all uploaded files
4. **Verify file names and tags** match expectations

## 🎛️ Advanced Configuration

### Custom Transformations:
You can modify the upload settings in the "Upload to Cloudinary" node:

```json
{
  "file": "data:audio/wav;base64,..base64data..",
  "public_id": "elevenlabs-audio/episode-01/filename",
  "resource_type": "video",
  "format": "wav",
  "overwrite": true,
  "eager": [
    {
      "format": "mp3",
      "quality": "auto"
    },
    {
      "format": "ogg",
      "quality": "auto"
    }
  ],
  "tags": ["elevenlabs", "episode-01", "victor"]
}
```

### Folder Organization Strategies:

#### By Episode:
```
elevenlabs-audio/
├── episode-01/
├── episode-02/
└── tests/
```

#### By Speaker:
```
elevenlabs-audio/
├── victor/
├── lenny/
└── tests/
```

#### By Section:
```
elevenlabs-audio/
├── cold-opens/
├── intros/
├── act-one/
└── tests/
```

### Quality Settings:
- **WAV**: Original quality (larger files, best quality)
- **MP3**: `quality: "auto"` (Cloudinary optimizes automatically)
- **Custom**: You can set specific bitrates like `"192"` or `"320"`

## 🛠️ Troubleshooting

### "401 Unauthorized" Error
- **Problem**: Cloudinary credential not working
- **Solutions**:
  1. Double-check Cloud Name, API Key, and API Secret
  2. Verify credentials are copied exactly (no extra spaces)
  3. Check your Cloudinary account is active
  4. Try regenerating API credentials in Cloudinary dashboard

### "400 Bad Request" Error
- **Problem**: Invalid request format
- **Solutions**:
  1. Check that the base64 data is properly formatted
  2. Verify the public_id doesn't contain invalid characters
  3. Ensure resource_type is set to "video" for audio files
  4. Check that the folder name is valid (no special characters)

### "420 Rate Limit" Error
- **Problem**: Too many requests too quickly
- **Solutions**:
  1. Increase the wait time between requests (change from 2 to 3+ seconds)
  2. Check your Cloudinary plan limits
  3. Process smaller batches
  4. Monitor usage in Cloudinary dashboard

### Files Not Appearing in Media Library
- **Problem**: Files uploaded but not visible
- **Solutions**:
  1. Check the correct folder in Cloudinary Media Library
  2. Use search function with tags (`elevenlabs`, `episode-01`)
  3. Refresh the Media Library page
  4. Check if files are in root folder instead of subfolder

### Upload Timeout Errors
- **Problem**: Large files taking too long to upload
- **Solutions**:
  1. This is normal for audio files (1-10MB)
  2. Increase timeout in HTTP Request node (set to 60000ms)
  3. Check your internet connection
  4. Try uploading during off-peak hours

## 📊 Cloudinary Limits & Pricing

### Free Plan Limits:
| Resource | Limit |
|----------|-------|
| Storage | 25GB |
| Bandwidth | 25GB/month |
| Transformations | 25,000/month |
| API Requests | No limit |

### File Limits:
| Type | Limit |
|------|-------|
| Video/Audio File Size | 100MB |
| Upload API Request Size | 10MB |
| Transformation Time | 120 seconds |

## 💡 Pro Tips

### Organization:
- **Use consistent naming** for easy searching
- **Tag everything** - tags make files easy to find
- **Create folder templates** for different projects
- **Use descriptive public_ids** instead of random names

### Performance:
- **Enable eager transformations** to pre-generate MP3s
- **Use auto quality** for optimal file sizes
- **Leverage CDN** - Cloudinary serves files globally
- **Monitor bandwidth** to avoid overages

### Workflow Optimization:
- **Test with small batches** first
- **Monitor upload progress** in logs
- **Use appropriate wait times** based on file sizes
- **Handle errors gracefully** with retry logic

### Security:
- **Keep API secrets secure** in N8N credentials only
- **Use signed URLs** for sensitive content (if needed)
- **Monitor API usage** regularly
- **Set up usage alerts** in Cloudinary dashboard

## 🔄 Maintenance

### Regular Tasks:
- **Check usage** monthly in Cloudinary dashboard
- **Review uploaded files** and clean up tests
- **Monitor bandwidth usage** to avoid overages
- **Update folder organization** as needed

### File Management:
- **Delete test files** regularly to save storage
- **Archive old episodes** to cheaper storage if needed
- **Use bulk operations** in Media Library for organization
- **Backup critical files** outside Cloudinary if required

### Performance Monitoring:
- **Check upload speeds** and adjust timeouts if needed
- **Monitor transformation usage** 
- **Review error logs** for recurring issues
- **Test workflows** periodically to ensure they're working

## 🎧 URL Formats & Usage

### Direct File URLs:
```
WAV: https://res.cloudinary.com/your-cloud/video/upload/folder/filename.wav
MP3: https://res.cloudinary.com/your-cloud/video/upload/f_mp3/folder/filename.mp3
```

### Transformation URLs:
```
Quality: https://res.cloudinary.com/your-cloud/video/upload/q_80/folder/filename.mp3
Bitrate: https://res.cloudinary.com/your-cloud/video/upload/br_192k/folder/filename.mp3
```

### Use Cases:
- **Podcast hosting**: Direct MP3 URLs for RSS feeds
- **Website embedding**: Optimized URLs for web players
- **Download links**: Original WAV URLs for high quality
- **Streaming**: Cloudinary handles range requests automatically

---

✨ **You're all set!** Your workflows will now automatically upload all generated audio files to Cloudinary, where they'll be optimized, organized, and delivered via global CDN. This gives you professional media management with zero local storage requirements.