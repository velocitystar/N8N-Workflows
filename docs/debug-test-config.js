/**
 * Debug Configuration for Distortion Check - Auto Loop Complete Workflow
 *
 * Use this configuration to troubleshoot and test the workflow systematically.
 * Copy sections as needed into Code nodes within your N8N workflow.
 */

// ============================================================================
// MINIMAL TEST CONTENT (Use this first)
// ============================================================================

const minimalTestContent = [
  {
    "row": 1,
    "speaker": "narrator",
    "fileName": "debug_test_001",
    "text": "Hello world. This is a minimal test.",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  }
];

// ============================================================================
// FULL TEST CONTENT (Use after minimal test works)
// ============================================================================

const fullTestContent = [
  {
    "row": 1,
    "speaker": "narrator",
    "fileName": "test_intro",
    "text": "Welcome to the automated text-to-speech testing system. This message confirms that the ElevenLabs integration is functioning properly.",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  },
  {
    "row": 2,
    "speaker": "character1",
    "fileName": "test_dialog_01",
    "text": "Greetings! I am the first test character. My voice should sound different from the narrator.",
    "voiceId": "AZnzlk1XvdvUeBnXmlld"
  },
  {
    "row": 3,
    "speaker": "character2",
    "fileName": "test_dialog_02",
    "text": "And I am the second character with yet another distinct voice. The system should handle multiple speakers seamlessly.",
    "voiceId": "EXAVITQu4vr4xnSDxMaL"
  },
  {
    "row": 4,
    "speaker": "narrator",
    "fileName": "test_conclusion",
    "text": "If you can hear all these different voices clearly, the workflow is ready for production use with your actual content.",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  }
];

// ============================================================================
// DEBUG LOGGING FUNCTIONS
// ============================================================================

/**
 * Add this to Code nodes to log execution state
 */
function debugLog(stage, data) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] DEBUG ${stage}:`, JSON.stringify(data, null, 2));
  return data;
}

/**
 * Validate content structure before processing
 */
function validateContentStructure(items) {
  const errors = [];

  if (!Array.isArray(items)) {
    errors.push("Content must be an array");
    return { valid: false, errors };
  }

  items.forEach((item, index) => {
    if (!item.text) errors.push(`Item ${index}: Missing 'text' field`);
    if (!item.fileName) errors.push(`Item ${index}: Missing 'fileName' field`);
    if (!item.speaker) errors.push(`Item ${index}: Missing 'speaker' field`);
    if (typeof item.text !== 'string') errors.push(`Item ${index}: 'text' must be string`);
    if (item.text && item.text.length > 5000) errors.push(`Item ${index}: Text too long (${item.text.length} chars)`);
  });

  return {
    valid: errors.length === 0,
    errors,
    itemCount: items.length,
    totalCharacters: items.reduce((sum, item) => sum + (item.text?.length || 0), 0)
  };
}

/**
 * Test API credentials before workflow execution
 */
async function testCredentials() {
  // This would be used in an HTTP Request node to test ElevenLabs API
  const testPayload = {
    method: 'GET',
    url: 'https://api.elevenlabs.io/v1/voices',
    headers: {
      'xi-api-key': '{{$credentials.ElevenLabs-API.xi-api-key}}'
    }
  };

  return testPayload;
}

// ============================================================================
// BATCH PROCESSING DEBUG
// ============================================================================

/**
 * Calculate and log batch information
 */
function calculateBatchInfo(items, batchSize = 5) {
  const info = {
    totalItems: items.length,
    batchSize: batchSize,
    totalBatches: Math.ceil(items.length / batchSize),
    estimatedDuration: Math.ceil(items.length / batchSize) * 3, // 3 seconds between batches
    batches: []
  };

  // Create batch breakdown
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    info.batches.push({
      batchNumber: Math.floor(i / batchSize) + 1,
      startIndex: i,
      endIndex: Math.min(i + batchSize - 1, items.length - 1),
      itemCount: batch.length,
      items: batch.map(item => ({
        fileName: item.fileName,
        textLength: item.text?.length || 0,
        speaker: item.speaker
      }))
    });
  }

  return info;
}

// ============================================================================
// ERROR HANDLING DEBUG
// ============================================================================

/**
 * Common error patterns and solutions
 */
const commonErrors = {
  authentication: {
    elevenlabs: {
      error: "401 Unauthorized",
      causes: ["Invalid API key", "Expired API key", "Incorrect header format"],
      solutions: [
        "Check API key in ElevenLabs dashboard",
        "Verify N8N credential configuration",
        "Ensure header name is 'xi-api-key'"
      ]
    },
    cloudinary: {
      error: "401 Authentication failed",
      causes: ["Invalid credentials", "Incorrect base64 encoding", "Wrong authorization format"],
      solutions: [
        "Verify API key and secret in Cloudinary dashboard",
        "Check base64 encoding: echo -n 'key:secret' | base64",
        "Ensure Authorization header format: 'Basic {base64}'"
      ]
    }
  },
  rateLimiting: {
    elevenlabs: {
      error: "429 Too Many Requests",
      causes: ["Exceeding plan limits", "Too many concurrent requests", "Insufficient delays"],
      solutions: [
        "Increase delay between batches",
        "Reduce batch size",
        "Check current usage in ElevenLabs dashboard"
      ]
    }
  },
  upload: {
    cloudinary: {
      error: "Upload failed",
      causes: ["File too large", "Invalid resource type", "Network timeout"],
      solutions: [
        "Check file size limits for your plan",
        "Ensure resource_type is 'video' for audio files",
        "Verify network connectivity"
      ]
    }
  }
};

/**
 * Generate error report
 */
function generateErrorReport(error, context) {
  const timestamp = new Date().toISOString();

  return {
    timestamp,
    context,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    troubleshooting: commonErrors,
    nextSteps: [
      "Check the specific error pattern above",
      "Verify all credentials are properly configured",
      "Test with minimal content first",
      "Review N8N execution logs for additional details"
    ]
  };
}

// ============================================================================
// STEP-BY-STEP TESTING PROCEDURE
// ============================================================================

const testingProcedure = {
  step1: {
    name: "Credential Test",
    description: "Verify API credentials are working",
    action: "Use HTTP Request node to call ElevenLabs /v1/voices endpoint",
    expectedResult: "List of available voices",
    troubleshoot: "Check API key format and permissions"
  },

  step2: {
    name: "Single Item Test",
    description: "Process one minimal item",
    content: minimalTestContent[0],
    action: "Execute workflow with single item",
    expectedResult: "One audio file generated and uploaded",
    troubleshoot: "Check text content and voice ID"
  },

  step3: {
    name: "Batch Test",
    description: "Process full test batch",
    content: fullTestContent,
    action: "Execute with full test content",
    expectedResult: "All items processed in batches with proper delays",
    troubleshoot: "Monitor batch processing and timing"
  },

  step4: {
    name: "Production Test",
    description: "Test with actual content",
    action: "Replace test content with production data",
    expectedResult: "Successful processing of real content",
    troubleshoot: "Validate content structure and character limits"
  }
};

// ============================================================================
// MONITORING AND METRICS
// ============================================================================

/**
 * Track workflow performance
 */
function trackMetrics(startTime, processedItems, errors) {
  const endTime = new Date();
  const duration = (endTime - startTime) / 1000; // seconds

  return {
    execution: {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationSeconds: duration,
      durationMinutes: Math.round(duration / 60 * 100) / 100
    },
    processing: {
      totalItems: processedItems.length,
      successfulItems: processedItems.filter(item => item.success).length,
      failedItems: processedItems.filter(item => !item.success).length,
      successRate: Math.round((processedItems.filter(item => item.success).length / processedItems.length) * 100)
    },
    performance: {
      itemsPerMinute: Math.round((processedItems.length / duration) * 60),
      averageTimePerItem: Math.round(duration / processedItems.length * 100) / 100
    },
    errors: errors
  };
}

// ============================================================================
// EXPORT FOR N8N CODE NODES
// ============================================================================

// Use in Content Input node
// return minimalTestContent.map(item => ({json: item}));

// Use in Validation node
// const validation = validateContentStructure($input.all());
// if (!validation.valid) throw new Error('Validation failed: ' + validation.errors.join(', '));
// return $input.all();

// Use in Batch Info node
// const batchInfo = calculateBatchInfo($input.all(), 5);
// console.log('Batch Info:', batchInfo);
// return $input.all();

// Use in Error Handler node
// const errorReport = generateErrorReport(error, 'TTS Generation');
// console.log('Error Report:', errorReport);
// throw error;

module.exports = {
  minimalTestContent,
  fullTestContent,
  debugLog,
  validateContentStructure,
  testCredentials,
  calculateBatchInfo,
  commonErrors,
  generateErrorReport,
  testingProcedure,
  trackMetrics
};
