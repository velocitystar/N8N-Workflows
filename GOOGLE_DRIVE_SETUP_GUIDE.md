# Google Drive Integration Setup Guide

## 🚀 Overview

This guide shows you how to set up Google Drive integration with your ElevenLabs N8N workflows, so your audio files are automatically uploaded to Google Drive instead of being stored locally.

## ✅ Benefits of Google Drive Integration

- **☁️ Cloud Storage** - Files are safely stored in the cloud
- **📱 Cross-Device Access** - Access files from anywhere
- **🔗 Easy Sharing** - Get shareable links automatically
- **💾 No Local Storage** - Perfect for systems that can't store files
- **🔄 Automatic Backup** - Google Drive handles backups
- **👥 Team Collaboration** - Share folders with team members

## 🔧 Step-by-Step Setup

### Step 1: Set Up Google Drive API Access

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click "Select a project" at the top
   - Either create a new project or select an existing one
   - Project name example: "N8N ElevenLabs Integration"

3. **Enable Google Drive API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External (for personal use) or Internal (for organization)
     - Fill in required fields (App name, User support email, etc.)
     - Add your domain if required
   - Application type: "Web application"
   - Name: "N8N Google Drive Integration"
   - Authorized redirect URIs: Add your N8N URL + `/rest/oauth2-credential/callback`
     - Example: `https://your-n8n-domain.com/rest/oauth2-credential/callback`
     - For local: `http://localhost:5678/rest/oauth2-credential/callback`

5. **Download Credentials**
   - Download the JSON file with your client credentials
   - Note the Client ID and Client Secret

### Step 2: Create Google Drive Credential in N8N

1. **Open N8N** in your browser
2. **Go to Credentials** (left sidebar)
3. **Click "Add Credential"** (+ button)
4. **Search for "Google Drive OAuth2 API"** and select it
5. **Fill in the credential details:**

```
Credential Name: Google Drive
Client ID: [Your Client ID from step 1]
Client Secret: [Your Client Secret from step 1]
Scope: https://www.googleapis.com/auth/drive.file
```

6. **Click "Connect my account"**
7. **Authorize** the application in the popup window
8. **Save** the credential

### Step 3: Set Up Google Drive Folder (Optional)

1. **Open Google Drive** in your browser
2. **Create a folder** for your audio files (e.g., "ElevenLabs Audio Files")
3. **Get the Folder ID**:
   - Open the folder
   - Copy the folder ID from the URL
   - Example URL: `https://drive.google.com/drive/folders/1ABC123DEF456GHI789`
   - Folder ID: `1ABC123DEF456GHI789`

### Step 4: Configure Workflows

#### For Test Workflow:
1. **Import** `elevenLabs-n8n-test-gdrive.json`
2. **Open the workflow** and edit the "Set Variables" node
3. **Set the Google Drive Folder ID** (optional):
   ```
   gdriveFolderId: 1ABC123DEF456GHI789
   ```
   - Leave empty to upload to Drive root
4. **Check the Google Drive node** has your credential selected
5. **Save** the workflow

#### For Batch Workflow:
1. **Import** `elevenLabs-n8n-script1-gdrive.json`
2. **Open the workflow** and edit the "Set Configuration" node
3. **Set the Google Drive Folder ID** (optional)
4. **Check the Google Drive node** has your credential selected
5. **Save** the workflow

## 📁 Workflow Files

### ✅ Google Drive Integration Workflows:
- `elevenLabs-n8n-test-gdrive.json` - Test workflow with Google Drive upload
- `elevenLabs-n8n-script1-gdrive.json` - Batch processing with Google Drive upload

### ❌ Previous Versions (don't use these):
- `elevenLabs-n8n-test-credentials.json` - Local file storage only
- `elevenLabs-n8n-script1-credentials.json` - Local file storage only

## 🎯 How It Works

1. **Audio Generation**: ElevenLabs generates audio file
2. **Prepare Upload**: File is prepared with proper filename
3. **Google Drive Upload**: File is uploaded to your Drive folder
4. **Success Logging**: Upload confirmation with Drive links

### File Organization:
- **Test files**: `test_audio_YYYY-MM-DD_HH-mm-ss.wav`
- **Script files**: `EP01_Speaker_Section_##.wav`

## 🔍 Testing Your Setup

### Quick Test:
1. **Run the test workflow** (`ElevenLabs Test with Google Drive Upload`)
2. **Check the execution log** for success messages
3. **Verify in Google Drive** that the audio file appears
4. **Test the download link** to ensure file is accessible

### Batch Test:
1. **Run a small batch** first (modify script to include only 2-3 lines)
2. **Monitor progress** in execution logs
3. **Check Google Drive** for all uploaded files
4. **Verify file names** match your expectations

## 🔧 Advanced Configuration

### Custom Folder Structure:
You can organize files into subfolders by creating folders in Google Drive and using their IDs:

```
📁 ElevenLabs Audio Files (main folder)
├── 📁 Episode 01 (subfolder for episode files)
├── 📁 Tests (subfolder for test files)
└── 📁 Archive (subfolder for old files)
```

### Automatic Folder Creation:
To automatically create folders, you can add a Google Drive "Create Folder" node before the upload node.

### File Permissions:
By default, uploaded files are private to your account. To make them shareable:
1. Add a "Google Drive" node after upload
2. Set operation to "Update"
3. Configure sharing permissions

## 🛠️ Troubleshooting

### "401 Unauthorized" Error
- **Problem**: Google Drive credential not working
- **Solutions**:
  1. Re-authorize your Google account in N8N credentials
  2. Check OAuth consent screen is approved (if using custom app)
  3. Verify redirect URI matches exactly
  4. Ensure Google Drive API is enabled in Google Cloud Console

### "403 Forbidden" Error
- **Problem**: Permission denied
- **Solutions**:
  1. Check Google Drive storage quota (account might be full)
  2. Verify API quotas in Google Cloud Console
  3. Ensure you have write permissions to the target folder
  4. Check if folder ID exists and is accessible

### "404 Not Found" Error
- **Problem**: Folder not found
- **Solutions**:
  1. Verify the folder ID is correct
  2. Ensure the folder exists in your Google Drive
  3. Check that the folder is in your personal Drive (not shared)
  4. Leave folder ID empty to upload to Drive root

### Files Upload to Wrong Location
- **Problem**: Files appear in unexpected location
- **Solutions**:
  1. Double-check the folder ID
  2. Make sure folder ID is set correctly in workflow
  3. Verify you have the right Google account connected
  4. Check that folder hasn't been moved or deleted

### Slow Upload Speeds
- **Problem**: Files take long time to upload
- **Solutions**:
  1. This is normal for audio files (they can be 1-10MB each)
  2. Check your internet connection
  3. Consider processing smaller batches
  4. Monitor Google Drive API quotas

## 📊 Google Drive API Limits

| Limit Type | Default Limit |
|------------|---------------|
| Requests per 100 seconds per user | 1,000 |
| Requests per 100 seconds | 100,000,000 |
| Upload file size | 5TB |
| Storage quota | 15GB (free), varies by plan |

## 💡 Pro Tips

### Organization:
- **Use descriptive folder names** for different projects
- **Create separate folders** for tests vs. production files
- **Use consistent naming** for easy file management
- **Set up folder templates** for recurring projects

### Security:
- **Use separate Google account** for automation if preferred
- **Regularly review** API access in Google Account settings
- **Monitor usage** in Google Cloud Console
- **Set up alerts** for unusual API activity

### Efficiency:
- **Process in batches** of 5-10 files to avoid overwhelming Drive
- **Use folder IDs** instead of folder names for better performance
- **Monitor your quotas** to avoid hitting limits
- **Clean up test files** regularly to save storage space

## 🔄 Maintenance

### Regular Tasks:
- **Check API quotas** monthly in Google Cloud Console
- **Review uploaded files** for organization
- **Clean up test files** to save storage
- **Update credentials** if they expire
- **Monitor workflow performance** and adjust wait times if needed

### Annual Tasks:
- **Review Google Cloud project** settings
- **Audit OAuth app permissions** 
- **Update any hardcoded folder IDs** if folder structure changes
- **Check for N8N or Google Drive API updates**

---

✨ **You're all set!** Your workflows will now automatically upload all generated audio files to Google Drive, making them accessible from anywhere and freeing up local storage space.