# Episode Format Summary and Recommendations

## Available Episode Formats

### ✅ **v3 Alpha Format (RECOMMENDED)**
**Files:**
- `distortion-check-v3-alpha-test.json` - 8 items (testing)
- `distortion-check-ep1-v3.json` - 27 items (full episode)
- `distortion-check-ep2-v3.json` - 15 items (full episode)

**Features:**
- ✅ Advanced ElevenLabs v3 features
- ✅ Voice settings optimization (stability, similarity boost, style)
- ✅ Audio Tags support (previousText, nextText, seed)
- ✅ Pronunciation dictionary support
- ✅ Context-aware voice generation
- ✅ Proper response format configuration
- ✅ Compatible with current workflow fixes

### ❌ **Legacy Format (NOT RECOMMENDED)**
**Files:**
- `distortion-check-ep1.json` - Basic format, missing v3 features
- `distortion-check-ep2.json` - Partially updated, inconsistent

## Current Workflow Configuration

**Production Workflow:** `Distortion Check - v3 Alpha Remote JSON.json`
**Current URL:** `https://raw.githubusercontent.com/velocitystar/N8N-Workflows/main/docs/distortion-check-v3-alpha-test.json`
**Current Settings:**
- Batch size: 1 item per batch (credit-safe)
- Response format: "file" (FIXED - working)
- Voice IDs: Confirmed working
- Error handling: Enhanced

## Recommendations by Use Case

### 🧪 **For Testing (Current State)**
**Use:** `distortion-check-v3-alpha-test.json`
**Reason:** 
- Small (8 items)
- Credit-safe 
- Full v3 features
- Perfect for validating fixes

### 🎯 **For Production - Episode 2 (RECOMMENDED NEXT)**
**Use:** `distortion-check-ep2-v3.json`
**Reason:**
- Moderate size (15 items)
- Full v3 Alpha features
- Rich voice settings
- Pronunciation dictionary examples
- Manageable credit cost (~15-30 credits)

### 📚 **For Production - Episode 1 (LATER)**
**Use:** `distortion-check-ep1-v3.json` 
**Reason:**
- Larger (27 items)
- Full episode content
- Higher credit cost (~50-80 credits)
- Best after confirming EP2 works

## Voice Settings Optimization

### Victor (T9xTMubBGC4Y9y6oHUza)
```json
{
  "stability": 0.6,
  "similarityBoost": 0.7,
  "style": 0.1-0.3,
  "useSpeakerBoost": true
}
```

### Lenny (WbI4Toj5UDP91WAiEInp)
```json
{
  "stability": 0.5,
  "similarityBoost": 0.8,
  "style": 0.1-0.4,
  "useSpeakerBoost": true
}
```

## Advanced Features in v3 Format

### Context Awareness
- `previousText`: Provides context from previous audio
- `nextText`: Helps with natural transitions
- Improves speech flow and coherence

### Pronunciation Dictionary
- Custom pronunciations for names like "Hatonn", "Latwii"
- Ensures consistent pronunciation across episodes
- Improves audio quality for specialized terms

### Voice Style Variations
- Different `style` values for emotional range
- 0.0 = Neutral/professional
- 0.4 = More expressive/dramatic
- Enhances storytelling dynamics

## URL Configuration Guide

### To Switch Episodes in Workflow:

1. **Go to:** "Set Configuration" node
2. **Find:** `contentUrl` parameter
3. **Change to one of:**
   - Test: `https://raw.githubusercontent.com/velocitystar/N8N-Workflows/main/docs/distortion-check-v3-alpha-test.json`
   - EP2: `https://raw.githubusercontent.com/velocitystar/N8N-Workflows/main/docs/distortion-check-ep2-v3.json`
   - EP1: `https://raw.githubusercontent.com/velocitystar/N8N-Workflows/main/docs/distortion-check-ep1-v3.json`

## Batch Size Recommendations

### Testing Phase
- **Batch size:** 1 item
- **Purpose:** Validate audio generation fix
- **Credit usage:** ~2 credits per test

### Production Phase (EP2)
- **Batch size:** 3-5 items
- **Purpose:** Efficient processing
- **Credit usage:** ~15-30 credits total

### Production Phase (EP1)
- **Batch size:** 5 items
- **Purpose:** Full episode processing
- **Credit usage:** ~50-80 credits total

## Quality Improvements in v3 Format

1. **Better Voice Consistency:** Context-aware generation
2. **Natural Transitions:** previousText/nextText linking
3. **Proper Pronunciations:** Dictionary-based corrections
4. **Emotional Range:** Style variations per content
5. **Reduced Artifacts:** Optimized voice settings

## Next Steps

1. ✅ **Current:** Test with v3-alpha-test.json (8 items)
2. 🎯 **Next:** Switch to distortion-check-ep2-v3.json (15 items)
3. 📈 **Later:** Increase batch size to 3-5 items
4. 🚀 **Future:** Process distortion-check-ep1-v3.json (27 items)

## File Locations

All episode files are in the `docs/` directory:
- Testing: `docs/distortion-check-v3-alpha-test.json`
- Episode 1: `docs/distortion-check-ep1-v3.json`
- Episode 2: `docs/distortion-check-ep2-v3.json`

The v3 format represents the current best practice for ElevenLabs integration with advanced features and optimized voice settings.