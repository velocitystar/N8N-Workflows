# Rich Remote JSON ElevenLabs TTS Workflow Guide

## Overview

The **Distortion Check - Rich Remote JSON - Complete** workflow enables dynamic, remote JSON content loading for ElevenLabs Text-to-Speech generation with advanced batching, rich per-item controls, and automatic Cloudinary uploads.

This workflow implements **Option A: Rich ep2-like remote payload** which provides the best audio quality and full access to ElevenLabs advanced features including:

- Per-item voice settings and model selection
- Pronunciation dictionaries for accurate speech
- Request stitching for voice continuity
- Seed control for reproducible results
- Context awareness (previousText/nextText)
- Custom audio formatting options

## Key Features

### 🌐 Remote JSON Content Loading
- Fetches content dynamically from any accessible URL
- Supports both direct arrays and objects with `.content` property
- Handles voice mapping and default settings from remote data
- Robust error handling and validation

### 🔄 Proven 5-Item Batching
- Based on the tested "known good" workflow pattern
- Processes content in manageable 5-item batches
- Automatic batch progression with 3-second delays
- Complete batch tracking and progress logging

### 🎙️ Rich ElevenLabs Integration
- Full support for advanced ElevenLabs features
- Per-item voice ID, model, and voice settings
- Pronunciation dictionary support
- Request stitching for natural voice flow
- Custom seed values for consistent results

### ☁️ Automatic Cloudinary Upload
- Seamless audio file storage and management
- Organized folder structures
- Retry logic for reliable uploads
- Comprehensive error handling

## Workflow Configuration

### Set Configuration Node Parameters

The workflow is configured via the **Set Configuration** node with these parameters:

```json
{
  "contentUrl": "https://your-domain.com/path/to/content.json",
  "cloudinaryFolder": "elevenlabs-audio/your-folder",
  "cloudName": "your-cloudinary-cloud",
  "maxItems": 5,
  "startIndex": 0,
  "defaultVoiceId": "fallback-voice-id"
}
```

#### Parameter Descriptions

- **contentUrl**: URL to your remote JSON content file
- **cloudinaryFolder**: Target folder path in Cloudinary
- **cloudName**: Your Cloudinary cloud name
- **maxItems**: Items per batch (recommended: 5)
- **startIndex**: Starting position (usually 0)
- **defaultVoiceId**: Fallback voice for unmapped speakers

### Required Credentials

1. **ElevenLabs API**: Standard ElevenLabs API credential
2. **Cloudinary API Auth**: HTTP Header Auth with base64 encoded `api_key:api_secret`

## Remote JSON Format

### Rich Format Structure

Your remote JSON should follow this structure for maximum compatibility:

```json
{
  "episode": {
    "title": "Your Episode Title",
    "number": 1,
    "description": "Episode description"
  },
  "voiceMapping": {
    "Speaker1": "voice-id-1",
    "Speaker2": "voice-id-2"
  },
  "defaultSettings": {
    "modelId": "eleven_turbo_v2_5",
    "voiceSettings": {
      "stability": 0.5,
      "similarityBoost": 0.5,
      "style": 0.0,
      "useSpeakerBoost": true
    }
  },
  "content": [
    {
      "row": 1,
      "speaker": "Speaker1",
      "fileName": "file_name.wav",
      "text": "Your text content here",
      "voiceId": "optional-override-voice-id",
      "modelId": "optional-override-model",
      "voiceSettings": {
        "stability": 0.6,
        "similarityBoost": 0.7
      },
      "pronunciationDictionary": {
        "locators": [
          {
            "text": "word",
            "pronunciation": "phonetic-spelling"
          }
        ]
      },
      "seed": 12345,
      "previousText": "context from previous item",
      "nextText": "context for next item",
      "responseFormat": "mp3_44100_128",
      "direction": {
        "emotion": "happy",
        "pace": "normal",
        "tone": "conversational"
      }
    }
  ]
}
```

### Simplified Format Support

The workflow also supports simpler formats:

```json
[
  {
    "row": 1,
    "speaker": "Speaker1",
    "fileName": "file_name.wav",
    "text": "Your text content"
  }
]
```

### Field Mapping to ElevenLabs API

The workflow automatically maps rich JSON fields to ElevenLabs API format:

| Remote JSON Field | ElevenLabs API Field | Purpose |
|------------------|---------------------|---------|
| `text` | `text` | Content to synthesize |
| `modelId` | `model_id` | TTS model selection |
| `voiceSettings` | `voice_settings` | Voice parameter control |
| `pronunciationDictionary.locators` | `pronunciation_dictionary_locators` | Custom pronunciations |
| `seed` | `seed` | Reproducible results |
| `previousText` | `previous_text` | Voice continuity |
| `nextText` | `next_text` | Voice continuity |
| `previousRequestIds` | `previous_request_ids` | Request stitching |
| `responseFormat` | `output_format` | Audio format control |

## Usage Instructions

### 1. Prepare Your Content

Create your remote JSON file with rich content following the format above. Host it at an accessible URL (GitHub Raw, S3, CDN, etc.).

### 2. Configure the Workflow

Update the **Set Configuration** node with your:
- Content URL
- Cloudinary settings
- Default voice preferences

### 3. Test with Small Content

Start with a small test file (3-5 items) to validate the workflow before processing larger datasets.

### 4. Execute the Workflow

The workflow will:
1. Fetch your remote JSON
2. Process items in 5-item batches
3. Generate audio with ElevenLabs
4. Upload to Cloudinary
5. Continue until all content is processed

### 5. Monitor Progress

Watch the execution logs for:
- Batch progression indicators
- Individual item processing status
- Upload success confirmations
- Error messages and troubleshooting info

## Sample Content URLs

### Test Content (3 items)
```
https://raw.githubusercontent.com/velocitystar/N8N-Workflows/main/docs/distortion-check-test-3-items.json
```

### Full Episode Content (15 items)
```
https://raw.githubusercontent.com/velocitystar/N8N-Workflows/main/docs/distortion-check-ep2.json
```

## Advanced Features

### Voice Continuity & Request Stitching

The workflow supports ElevenLabs' advanced voice continuity features:

- **previousText**: Provides context from the previous item for natural flow
- **nextText**: Gives context about upcoming content for appropriate pacing
- **previousRequestIds**: Links requests for consistent voice characteristics

### Pronunciation Control

Use pronunciation dictionaries for accurate speech:

```json
"pronunciationDictionary": {
  "locators": [
    {
      "text": "Ra",
      "pronunciation": "RAH"
    },
    {
      "text": "1981",
      "pronunciation": "nineteen eighty-one"
    }
  ]
}
```

### Per-Item Voice Customization

Override default settings per item:

```json
"voiceSettings": {
  "stability": 0.8,
  "similarityBoost": 0.6,
  "style": 0.1,
  "useSpeakerBoost": true
}
```

## Troubleshooting

### Common Issues

#### "Failed to fetch remote content"
- Verify URL is accessible and returns valid JSON
- Check for CORS issues if hosting on restricted domains
- Ensure JSON format is valid

#### "No content array found"
- Verify JSON has either direct array format or `.content` property
- Check for typos in property names

#### "ElevenLabs API errors"
- Verify API credentials are correct
- Check voice IDs exist in your ElevenLabs account
- Ensure sufficient API credits

#### "Cloudinary upload failures"
- Verify Cloudinary credentials (base64 encoded API key:secret)
- Check cloud name is correct
- Ensure sufficient storage quota

### Debugging Tips

1. **Start Small**: Test with 1-3 items first
2. **Check Logs**: Monitor execution logs for detailed progress
3. **Validate JSON**: Use online JSON validators for your content
4. **Test URLs**: Verify remote URLs return expected content

## Performance Considerations

### Batch Size
- Default 5 items per batch balances throughput and reliability
- Reduce for complex content or API limits
- Increase cautiously for simple content

### Request Timing
- 3-second delays between batches prevent API rate limiting
- ElevenLabs requests have 60-second timeout
- Cloudinary uploads have 30-second timeout

### Content Optimization
- Keep text segments under 2500 characters for best results
- Use appropriate models for content type
- Consider pronunciation dictionaries for technical terms

## Migration from Hardcoded Content

To convert existing hardcoded workflows:

1. Extract your content array to a JSON file
2. Add voice mapping and default settings
3. Update configuration to use remote URL
4. Test with small subset first
5. Deploy full content

## Best Practices

### Content Organization
- Use descriptive file names
- Include episode/batch metadata
- Maintain consistent speaker naming
- Document voice ID mappings

### Quality Control
- Test pronunciation dictionaries
- Validate voice settings produce desired results
- Monitor output quality across batches
- Use request stitching for narrative content

### Production Deployment
- Use reliable hosting for JSON content
- Implement content versioning
- Monitor API usage and costs
- Set up error alerting

## Support & Development

For issues, improvements, or questions:
- Review execution logs for specific error messages
- Test with provided sample content first
- Verify all credentials and configurations
- Check ElevenLabs and Cloudinary service status

This workflow represents the culmination of extensive testing and refinement to provide a robust, feature-rich solution for dynamic TTS content generation at scale.