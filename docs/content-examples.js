/**
 * Sample Content Structure for N8N ElevenLabs TTS Workflows
 *
 * This file provides examples of content structures and configuration
 * that work with the N8N workflows in this project.
 */

// ============================================================================
// SAMPLE CONTENT ARRAY
// ============================================================================

/**
 * Standard content format expected by the workflows
 * Each item represents one text-to-speech conversion
 */
const sampleContent = [
  {
    row: 1,
    speaker: "narrator",
    fileName: "intro_001",
    text: "Welcome to our story. This is the beginning of an incredible journey.",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Optional: specific voice per item
  },
  {
    row: 2,
    speaker: "character1",
    fileName: "dialog_001",
    text: "Hello there! How are you doing today?",
    voiceId: "AZnzlk1XvdvUeBnXmlld",
  },
  {
    row: 3,
    speaker: "character2",
    fileName: "dialog_002",
    text: "I'm doing wonderful, thank you for asking. What brings you here?",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
  },
  {
    row: 4,
    speaker: "narrator",
    fileName: "description_001",
    text: "The two characters stood in the middle of a bustling marketplace, surrounded by the sounds of merchants calling out their wares.",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
  },
  {
    row: 5,
    speaker: "character1",
    fileName: "dialog_003",
    text: "I'm looking for something special. Something that will change everything.",
    voiceId: "AZnzlk1XvdvUeBnXmlld",
  },
];

// ============================================================================
// CONFIGURATION EXAMPLES
// ============================================================================

/**
 * Workflow Configuration Options
 * These can be set in the N8N workflow nodes
 */
const workflowConfig = {
  // Batch Processing
  batchSize: 5, // Items to process per batch
  delayBetweenBatches: 3000, // Milliseconds between batches
  delayBetweenRequests: 1000, // Milliseconds between individual requests

  // ElevenLabs Settings
  defaultVoiceId: "21m00Tcm4TlvDq8ikWAM", // Default voice if not specified per item
  modelId: "eleven_monolingual_v1", // TTS model to use
  voiceSettings: {
    stability: 0.5, // 0-1, higher = more stable
    similarityBoost: 0.5, // 0-1, higher = more similar to original
    style: 0.0, // 0-1, style exaggeration (v2 models only)
    useSpeakerBoost: true, // Enhance speaker similarity
  },

  // Output Settings
  outputFormat: "mp3_44100_128", // Audio format and quality
  cloudinaryFolder: "tts-audio", // Cloudinary folder for uploads
  filenamePrefix: "episode_01", // Prefix for generated filenames

  // Error Handling
  maxRetries: 3, // Max retry attempts for failed requests
  retryDelay: 5000, // Delay between retries (ms)
  continueOnError: true, // Whether to continue if individual items fail
};

// ============================================================================
// DYNAMIC CONTENT LOADING EXAMPLES
// ============================================================================

/**
 * Example: Loading content from a Google Sheet
 * The sheet should have columns: row, speaker, fileName, text, voiceId (optional)
 */
const googleSheetsConfig = {
  spreadsheetId: "your-spreadsheet-id-here",
  range: "Sheet1!A:E", // Adjust range as needed
  apiKey: "your-google-api-key", // Or use N8N credentials
};

/**
 * Example: Loading content from a JSON API
 * The API should return an array in the format shown above
 */
const jsonApiConfig = {
  url: "https://your-api.com/scripts/episode-01",
  method: "GET",
  headers: {
    Authorization: "Bearer your-token",
    "Content-Type": "application/json",
  },
};

/**
 * Example: Loading content from a CSV file
 * CSV should have headers: row,speaker,fileName,text,voiceId
 */
const csvConfig = {
  url: "https://your-domain.com/content/episode-01.csv",
  delimiter: ",",
  hasHeaders: true,
};

// ============================================================================
// VOICE MAPPING
// ============================================================================

/**
 * Map speaker names to ElevenLabs voice IDs
 * This helps maintain consistency across episodes
 */
const voiceMapping = {
  narrator: "21m00Tcm4TlvDq8ikWAM", // Rachel
  character1: "AZnzlk1XvdvUeBnXmlld", // Adam
  character2: "EXAVITQu4vr4xnSDxMaL", // Bella
  character3: "ErXwobaYiN019PkySvjV", // Antoni
  character4: "MF3mGyEYCl7XYWbV9V6O", // Elli
  character5: "TxGEqnHWrfWFTfGW9XjX", // Josh
  oldman: "VR6AewLTigWG4xSOukaG", // Arnold
  woman: "jsCqWAovK2LkecY7zXl4", // Freya
  child: "jBpfuIE2acCO8z3wKNLl", // Gigi
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert content array to the format expected by N8N workflows
 */
function prepareContentForN8N(content) {
  return content.map((item, index) => ({
    ...item,
    voiceId:
      item.voiceId ||
      voiceMapping[item.speaker] ||
      workflowConfig.defaultVoiceId,
    batchIndex: Math.floor(index / workflowConfig.batchSize),
    itemIndex: index,
    totalItems: content.length,
  }));
}

/**
 * Validate content structure
 */
function validateContent(content) {
  const errors = [];

  if (!Array.isArray(content)) {
    errors.push("Content must be an array");
    return errors;
  }

  content.forEach((item, index) => {
    if (!item.text || typeof item.text !== "string") {
      errors.push(`Item ${index}: text is required and must be a string`);
    }

    if (!item.fileName || typeof item.fileName !== "string") {
      errors.push(`Item ${index}: fileName is required and must be a string`);
    }

    if (!item.speaker || typeof item.speaker !== "string") {
      errors.push(`Item ${index}: speaker is required and must be a string`);
    }

    if (item.text && item.text.length > 5000) {
      errors.push(`Item ${index}: text is too long (max 5000 characters)`);
    }
  });

  return errors;
}

/**
 * Calculate batch information
 */
function calculateBatchInfo(totalItems, batchSize = 5) {
  return {
    totalItems,
    batchSize,
    totalBatches: Math.ceil(totalItems / batchSize),
    estimatedDuration:
      Math.ceil(totalItems / batchSize) * workflowConfig.delayBetweenBatches,
  };
}

// ============================================================================
// EXPORT FOR N8N (if using in Code nodes)
// ============================================================================

// For use in N8N Code nodes, you can access these via:
// const config = workflowConfig;
// const voices = voiceMapping;
// const sample = sampleContent;

module.exports = {
  sampleContent,
  workflowConfig,
  voiceMapping,
  googleSheetsConfig,
  jsonApiConfig,
  csvConfig,
  prepareContentForN8N,
  validateContent,
  calculateBatchInfo,
};

// ============================================================================
// NOTES FOR IMPLEMENTATION
// ============================================================================

/*
WORKFLOW IMPLEMENTATION NOTES:

1. Content Loading:
   - Use HTTP Request node to fetch from API/CSV
   - Use Google Sheets node for spreadsheet data
   - Always validate content structure before processing

2. Batch Processing:
   - Use SplitInBatches node with batchSize setting
   - Add Wait node between batches (delayBetweenBatches)
   - Track batch progress in workflow context

3. Voice Selection:
   - Check item.voiceId first
   - Fall back to voiceMapping[item.speaker]
   - Use defaultVoiceId as final fallback

4. Error Handling:
   - Wrap TTS requests in try/catch
   - Implement retry logic with exponential backoff
   - Log failures but continue processing if continueOnError is true

5. Output Management:
   - Generate consistent filenames: {prefix}_{fileName}.mp3
   - Upload to Cloudinary with proper folder structure
   - Store metadata for tracking and retrieval

6. Rate Limiting:
   - Respect ElevenLabs rate limits (varies by plan)
   - Monitor API response headers for rate limit info
   - Adjust delays dynamically if needed

7. Monitoring:
   - Log batch progress and completion status
   - Track success/failure rates
   - Generate summary reports after completion
*/
