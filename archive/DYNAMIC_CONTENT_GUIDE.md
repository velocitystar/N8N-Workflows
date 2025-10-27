# Dynamic Content Loading Guide

This guide explains how to use the dynamic content loading feature in the "Distortion Check - Auto Loop Complete" workflow.

## Overview

The workflow now supports loading content from remote sources instead of hardcoded script arrays. This makes it much more flexible and allows you to update episode content without modifying the workflow itself.

## Supported Content Sources

### 1. Static Content (Default)
- **Use case**: Testing, development, or when content doesn't change
- **Configuration**: `contentSourceType: "static"`
- **Pros**: Reliable, no external dependencies
- **Cons**: Requires workflow modification to change content

### 2. Remote JSON File
- **Use case**: Structured content with metadata and complex formatting
- **Configuration**: 
  ```
  contentSourceType: "url"
  contentUrl: "https://your-domain.com/episode-02.json"
  contentFormat: "json"
  ```
- **Pros**: Rich metadata support, nested structures, easy programmatic generation
- **Cons**: Requires JSON knowledge

### 3. Remote CSV File
- **Use case**: Simple tabular data, easy to edit in spreadsheets
- **Configuration**:
  ```
  contentSourceType: "url"
  contentUrl: "https://your-domain.com/episode-02.csv"
  contentFormat: "csv"
  ```
- **Pros**: Human-readable, editable in Excel/Google Sheets, simple format
- **Cons**: Limited to flat data structure

## Configuration

### Setting Up Dynamic Content

1. **Open the workflow** in N8N
2. **Edit the "Set Configuration" node**
3. **Update these parameters**:
   - `contentSourceType`: Set to `"url"` for remote content
   - `contentUrl`: Your content file URL
   - `contentFormat`: `"json"` or `"csv"`

### Example Configurations

#### JSON Content
```json
{
  "contentSourceType": "url",
  "contentUrl": "https://cdn.yoursite.com/episodes/episode-02.json",
  "contentFormat": "json"
}
```

#### CSV Content
```json
{
  "contentSourceType": "csv",
  "contentUrl": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv",
  "contentFormat": "csv"
}
```

## Content Format Requirements

### Required Fields
All content items must include:
- `text`: The text to be converted to speech
- `fileName`: Output filename (without extension)
- `speaker`: Speaker identifier for voice mapping

### Optional Fields
- `row`: Row number (auto-generated if missing)
- `voiceId`: Specific ElevenLabs voice ID (overrides speaker mapping)

### JSON Format

#### Simple Array Structure
```json
[
  {
    "row": 1,
    "speaker": "Victor",
    "fileName": "EP02_Victor_Intro_01.wav",
    "text": "Welcome back to Distortion Check..."
  },
  {
    "row": 2,
    "speaker": "Lenny", 
    "fileName": "EP02_Lenny_Intro_02.wav",
    "text": "And I'm Lenny Peppidge..."
  }
]
```

#### Rich Structure with Metadata
```json
{
  "episode": {
    "title": "Episode 02: The First Contact",
    "number": 2,
    "metadata": {
      "created": "2025-01-15",
      "totalItems": 15
    }
  },
  "content": [
    {
      "row": 1,
      "speaker": "Victor",
      "fileName": "EP02_Victor_Intro_01.wav",
      "text": "Welcome back to Distortion Check..."
    }
  ]
}
```

### CSV Format

#### Required Headers
```
row,speaker,fileName,text
```

#### Example CSV
```csv
row,speaker,fileName,text
1,Victor,EP02_Victor_Intro_01.wav,"Welcome back to Distortion Check. I'm Victor Emil..."
2,Lenny,EP02_Lenny_Intro_02.wav,"And I'm Lenny Peppidge. Today we're exploring..."
3,Victor,EP02_Victor_Background_01.wav,"Let's start with some context about the early days..."
```

#### CSV Best Practices
- **Use quotes** around text containing commas or line breaks
- **Include headers** in the first row
- **Use consistent speaker names** for voice mapping
- **Keep filenames unique** to avoid overwriting

## Content Hosting Options

### 1. Static File Hosting
Host JSON/CSV files on any web server:
- **GitHub Pages**: Free, version controlled
- **Netlify/Vercel**: CDN distribution
- **AWS S3**: Scalable, reliable
- **Your own web server**: Full control

### 2. Google Sheets (CSV Export)
Use Google Sheets public export URLs:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=SHEET_GID
```

### 3. Headless CMS
- **Strapi**: Open source, flexible
- **Contentful**: Hosted, user-friendly
- **Sanity**: Real-time, collaborative
- **Ghost**: Simple, markdown-based

### 4. Database APIs
Create custom APIs that return JSON:
- **REST endpoints**: Simple HTTP GET requests
- **GraphQL**: Flexible querying
- **Serverless functions**: AWS Lambda, Vercel Functions

## Error Handling

### Fallback Behavior
If remote content loading fails, the workflow automatically falls back to static content with logging:
```
❌ Failed to load remote content: [error message]
🔄 Falling back to static content...
📝 Using static content...
```

### Common Issues & Solutions

#### Network Issues
- **Problem**: Timeout, DNS resolution, network errors
- **Solution**: Check URL accessibility, use CDN for reliability

#### Content Validation Errors
- **Problem**: Missing required fields (text, fileName, speaker)
- **Solution**: Validate content structure before uploading

#### Format Issues
- **Problem**: Invalid JSON, malformed CSV
- **Solution**: Use JSON/CSV validators before publishing

#### CORS Issues
- **Problem**: Browser blocking cross-origin requests
- **Solution**: Configure proper CORS headers on content server

## Voice Mapping

The workflow maps speaker names to ElevenLabs voice IDs:

### Default Voice Mapping
```javascript
{
  "Victor": "T9xTMubBGC4Y9y6oHUza",
  "Lenny": "WbI4Toj5UDP91WAiEInp"
}
```

### Custom Voice Mapping
To use different voices:

1. **Update voice IDs** in "Set Configuration"
2. **Or specify voiceId** per content item:
```json
{
  "speaker": "Victor",
  "voiceId": "custom-voice-id-here",
  "fileName": "custom_audio.wav",
  "text": "Custom audio with specific voice..."
}
```

### Finding Voice IDs
1. **Log into ElevenLabs**
2. **Go to Voice Library**
3. **Copy the voice ID** from the URL or API response

## Workflow Integration

### Content Updates
1. **Update remote content file**
2. **No workflow changes needed**
3. **Execute workflow** - it will automatically load new content

### Version Control
- **Static content**: Version controlled with workflow
- **Remote content**: Version controlled separately
- **Best practice**: Tag content versions that correspond to workflow versions

### Testing New Content
1. **Test with small batches** first (set `maxItems: 2`)
2. **Verify content format** and required fields
3. **Check voice mapping** works correctly
4. **Scale up** to full processing

## Advanced Use Cases

### Multi-Episode Management
```json
{
  "episodes": {
    "current": 2,
    "episodes": [
      {
        "number": 1,
        "contentUrl": "https://cdn.example.com/episode-01.json"
      },
      {
        "number": 2, 
        "contentUrl": "https://cdn.example.com/episode-02.json"
      }
    ]
  }
}
```

### Dynamic Voice Selection
```json
{
  "content": [
    {
      "speaker": "Victor",
      "mood": "excited",
      "voiceId": "excited-victor-voice-id",
      "text": "This is exciting news!"
    },
    {
      "speaker": "Victor",
      "mood": "serious", 
      "voiceId": "serious-victor-voice-id",
      "text": "But we need to be careful about this."
    }
  ]
}
```

### Conditional Content
```json
{
  "variants": {
    "intro": [
      {
        "condition": "first_time_listener",
        "text": "Welcome to Distortion Check. For new listeners..."
      },
      {
        "condition": "returning_listener", 
        "text": "Welcome back to Distortion Check..."
      }
    ]
  }
}
```

## Security Considerations

### Content Validation
- **Always validate** remote content structure
- **Sanitize text input** to prevent injection
- **Check file sizes** to prevent excessive processing
- **Rate limit** content fetching if needed

### Access Control
- **Use HTTPS** for content URLs
- **Consider authentication** for sensitive content
- **Implement access logs** for content fetching
- **Monitor for abuse** of content endpoints

### API Keys
- **Never expose** ElevenLabs API keys in content files
- **Use N8N credentials** for all authentication
- **Rotate keys** regularly
- **Monitor usage** for unexpected spikes

## Monitoring & Debugging

### Enable Debug Logging
The workflow provides detailed logging:
```
📊 Content source: url
🌐 Content URL: https://example.com/episode-02.json
📄 Content format: json
🌐 Loading content from remote URL...
📝 Parsing JSON content...
✅ Loaded 15 items from remote source
```

### Content Validation Logs
```
❌ Content validation errors:
   Item 3: missing 'text'
   Item 7: missing 'fileName'
```

### Performance Monitoring
- **Track content loading time**
- **Monitor success/failure rates**
- **Log content source reliability**
- **Alert on repeated failures**

## Migration Guide

### From Static to Dynamic Content

1. **Export current static content** to JSON/CSV format
2. **Host the content file** on a reliable server
3. **Update workflow configuration** to point to the URL
4. **Test with a few items** before full deployment
5. **Keep static content** as fallback during transition

### Content Management Workflow
1. **Content Creation**: Write/edit in preferred format
2. **Content Review**: Validate structure and quality  
3. **Content Publishing**: Upload to hosting location
4. **Workflow Testing**: Run with small batch first
5. **Production Deployment**: Execute full workflow

## Best Practices

### Content Organization
- **Use consistent naming** conventions
- **Structure episodes** in logical folders
- **Version your content** files
- **Maintain backup copies**

### Performance Optimization  
- **Use CDNs** for content delivery
- **Compress JSON** files when possible
- **Cache content** when appropriate
- **Monitor load times**

### Quality Assurance
- **Validate content** before publishing
- **Test voice mapping** with sample items
- **Review generated filenames** for uniqueness
- **Check text formatting** (punctuation, spacing)

### Collaboration
- **Use version control** for content files
- **Document content formats** for team members
- **Create content templates** for consistency
- **Establish review processes**

## Troubleshooting

### Content Not Loading
1. **Check URL accessibility** in browser
2. **Verify content format** matches configuration
3. **Check CORS settings** if hosting on different domain
4. **Review N8N execution logs** for specific errors

### Validation Failures
1. **Check required fields** are present
2. **Verify field names** match expected format
3. **Check for empty values** or null fields
4. **Validate JSON/CSV syntax**

### Voice Mapping Issues
1. **Check speaker names** match exactly
2. **Verify voice IDs** are valid in ElevenLabs
3. **Test with default voices** first
4. **Check voice availability** in your plan

### Performance Issues
1. **Reduce batch size** if timeouts occur
2. **Use faster hosting** for content files
3. **Optimize content size** (remove unnecessary fields)
4. **Monitor ElevenLabs rate limits**

## Examples and Templates

See the following sample files:
- `sample-episode-content.json` - Rich JSON structure with metadata
- `sample-episode-content.csv` - Simple CSV format
- `content-examples.js` - JavaScript examples and utilities

## Support

For additional help:
1. **Check workflow execution logs** for specific error messages
2. **Review this guide** for configuration examples
3. **Test with sample content** files provided
4. **Validate content structure** before deployment