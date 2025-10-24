# N8N Workflows - ElevenLabs TTS Project

A collection of N8N workflows for automated text-to-speech generation using ElevenLabs API with batch processing, rate limiting, and cloud storage integration.

## Project Overview

This project provides robust N8N workflows for:
- Converting text content to speech using ElevenLabs API
- Batch processing with proper rate limiting
- Secure credential management
- Cloud storage integration (Cloudinary)
- Dynamic content loading from external sources

## Features

- **Secure Authentication**: Uses N8N credential system (no hardcoded API keys)
- **Rate Limiting**: Built-in delays and batch processing to respect API limits
- **Cloud Storage**: Integrated Cloudinary upload for generated audio files
- **Batch Processing**: Processes content in configurable batches (default: 5 items)
- **Error Handling**: Retry logic and graceful failure handling
- **Dynamic Content**: Support for loading content from JSON APIs, Google Sheets, or CSV files

## Setup Requirements

### 1. N8N Credentials Setup

Create the following credentials in your N8N instance:

#### ElevenLabs API Credential
- **Type**: HTTP Header Auth
- **Name**: `ElevenLabs-API`
- **Header Name**: `xi-api-key`
- **Header Value**: `your-elevenlabs-api-key`

#### Cloudinary Credential  
- **Type**: HTTP Header Auth
- **Name**: `Cloudinary-Auth`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer your-cloudinary-api-key`

### 2. Environment Variables (Optional)
For additional security, you can also use environment variables:
```
ELEVENLABS_API_KEY=your-api-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Workflow Descriptions

### Production Workflows

#### 1. `production/Distortion Check - Auto Loop Complete.json` ⭐ **RECOMMENDED**
- **Purpose**: Full automation with dynamic content loading and batch processing
- **Features**: 
  - Automatic batch processing (5 items at a time)
  - Built-in rate limiting (3-second delays)
  - Cloudinary upload integration
  - Dynamic content loading support
  - Complete error handling and retry logic
- **Best For**: Production use with external content sources

#### 2. `production/Distortion Check - Manual Batches.json`
- **Purpose**: Manual batch processing for controlled operations
- **Features**:
  - User-triggered batch processing
  - Manual oversight at each step
  - Simplified error handling
- **Best For**: Testing, debugging, or when full automation isn't needed

#### 3. `production/Distortion Check - Sequential Auto.json`
- **Purpose**: Sequential processing without batching
- **Features**:
  - Processes all items in sequence
  - Built-in delays between requests
  - Simpler logic than batch processing
- **Best For**: Smaller datasets or when batch complexity isn't needed

### Development/Testing Workflows

Located in `development/` folder:

#### 4. `Distortion Check - Simple All Items.json`
- **Purpose**: Basic workflow for testing and development
- **Features**: Minimal complexity, good for understanding the core flow

#### 5. `Distortion Check - Rate Limited.json` / `Rate Limited Complete.json`
- **Purpose**: Focus on rate limiting implementation
- **Features**: Different approaches to handling API rate limits

#### 6. Additional development workflows for experimentation and testing

## Usage Instructions

### Quick Start

1. **Import Workflow**: Import `production/Distortion Check - Auto Loop Complete.json`
2. **Configure Credentials**: Set up the ElevenLabs and Cloudinary credentials as described above
3. **Test with Sample Data**: Start with a small batch to verify everything works
4. **Scale Up**: Process larger datasets with confidence

### Additional Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)**: Detailed step-by-step configuration instructions
- **[Quick Reference](docs/QUICK_REFERENCE.md)**: Common configurations and troubleshooting
- **[Changelog](docs/CHANGELOG.md)**: Version history and migration notes
- **[Content Examples](docs/content-examples.js)**: Sample data structures and configurations

### Content Format

Your content should be structured as an array of objects:
```json
[
  {
    "row": 1,
    "speaker": "narrator",
    "fileName": "intro_001",
    "text": "Welcome to our story..."
  },
  {
    "row": 2,
    "speaker": "character1", 
    "fileName": "dialog_001",
    "text": "Hello, how are you today?"
  }
]
```

### Dynamic Content Loading

The workflows support loading content from:
- **JSON API**: Direct HTTP requests to your content API
- **Google Sheets**: Via Google Sheets API integration
- **CSV Files**: Hosted CSV files that can be fetched and parsed

## Configuration Options

### Batch Size
- Default: 5 items per batch
- Configurable in the workflow settings
- Recommended range: 3-10 items (depends on your ElevenLabs plan)

### Rate Limiting
- Default delay: 3 seconds between batches
- Adjustable based on your API rate limits
- Additional per-request delays can be added if needed

### Voice Settings
Configure in the ElevenLabs node:
- `voice_id`: ElevenLabs voice identifier
- `model_id`: TTS model to use
- `voice_settings`: Stability, similarity boost, etc.

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify N8N credentials are properly configured
   - Check API key validity and permissions

2. **Rate Limiting**
   - Increase delay between batches
   - Reduce batch size
   - Check your ElevenLabs plan limits

3. **Upload Failures**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file format (MP3)

4. **Loop/Batch Issues**
   - Check the batch size configuration
   - Verify content array format
   - Monitor workflow execution logs

### Debugging Tips

1. **Start Small**: Test with 1-2 items first
2. **Check Logs**: Monitor N8N execution logs for errors
3. **Verify Credentials**: Test API connections separately
4. **Use Manual Mode**: Switch to manual batches for debugging

## File Organization

```
├── README.md                              # This file
├── production/                            # Production-ready workflows
│   ├── Distortion Check - Auto Loop Complete.json    # ⭐ Recommended
│   ├── Distortion Check - Manual Batches.json        # Manual processing
│   └── Distortion Check - Sequential Auto.json       # Sequential processing
├── development/                           # Development & testing workflows
│   ├── Distortion Check - Auto Loop.json
│   ├── Distortion Check - Rate Limited.json
│   ├── Distortion Check - Rate Limited Complete.json
│   ├── Distortion Check - Batch with Cloudinary Upload (Fixed Auth).json
│   └── Distortion Check - Simple All Items.json
├── docs/                                  # Documentation & guides
│   ├── SETUP_GUIDE.md                     # Detailed setup instructions
│   ├── CHANGELOG.md                       # Version history
│   ├── QUICK_REFERENCE.md                 # Quick reference guide
│   └── content-examples.js                # Sample content structure
└── archive/                               # Historical versions and tests
    ├── Setup guides/
    ├── Test workflows/
    └── Experimental versions/
```

## Version History

- **v3.0**: Auto Loop Complete - Production ready with full automation
- **v2.5**: Manual Batches - Stable manual processing
- **v2.0**: Rate Limited Complete - Advanced rate limiting
- **v1.x**: Various experimental versions (see archive/)

## Project Status

- **Current Version**: v3.0.0 (Production Ready)
- **Recommended Workflow**: `production/Distortion Check - Auto Loop Complete.json`
- **Last Major Update**: January 2025
- **N8N Compatibility**: v1.0+

## Contributing

When making changes:
1. Test thoroughly with small datasets first
2. Document any new features or configuration options
3. Update this README and relevant documentation
4. Archive old versions rather than deleting them
5. Follow the established directory structure

## License

This project is for internal use. Ensure compliance with ElevenLabs and Cloudinary terms of service.

---

**Last Updated**: January 2025
**Recommended Workflow**: `Distortion Check - Auto Loop Complete.json`
**N8N Version**: Compatible with N8N 1.0+