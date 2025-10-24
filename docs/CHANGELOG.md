# Changelog - N8N ElevenLabs TTS Workflows

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-01-15 - **CURRENT VERSION**

### Major Release: Production-Ready Workflows
This release represents a complete cleanup and organization of the project with production-ready workflows.

### Added
- **Project Organization**: Restructured into `production/`, `development/`, `docs/`, and `archive/` folders
- **Comprehensive Documentation**: Complete README, setup guide, and configuration examples
- **Production Workflows**: Three stable, production-ready workflow variants
- **Content Management**: Structured content format with validation and examples
- **Voice Mapping System**: Consistent speaker-to-voice mapping across episodes
- **Error Handling**: Robust retry logic and graceful failure handling
- **Rate Limiting**: Intelligent batching with configurable delays
- **Security**: Complete migration to N8N credential system

### Changed
- **File Organization**: Moved all workflows to appropriate directories
- **Naming Convention**: Standardized file names and descriptions
- **Documentation**: Rewrote all documentation for clarity and completeness

### Production Workflows
- `Distortion Check - Auto Loop Complete.json` ⭐ **RECOMMENDED**
  - Full automation with dynamic content loading
  - Robust batch processing with state management
  - Complete error handling and recovery
  - Cloudinary integration with proper authentication

- `Distortion Check - Manual Batches.json`
  - Manual batch control for testing and debugging
  - Simplified workflow logic
  - Good for controlled processing environments

- `Distortion Check - Sequential Auto.json`
  - Sequential processing without complex batching
  - Suitable for smaller datasets
  - Reduced complexity for easier maintenance

### Security Improvements
- Eliminated all hardcoded API keys
- Implemented N8N credential system throughout
- Added security best practices documentation
- Created secure authentication examples

## [2.5.0] - 2024-12-XX - Manual Batch Processing

### Added
- Manual batch processing capability
- User-controlled workflow execution
- Simplified error handling for manual oversight
- Batch size configuration options

### Fixed
- Data persistence issues in automatic batching
- Loop control variable corruption
- Upload authentication problems

### Changed
- Shifted focus from full automation to reliable manual control
- Simplified workflow logic for better maintainability

## [2.0.0] - 2024-11-XX - Cloudinary Integration & Rate Limiting

### Major Changes
- **Storage Migration**: Google Drive → Cloudinary for audio storage
- **Advanced Rate Limiting**: Implemented sophisticated batch processing
- **Authentication Overhaul**: N8N credentials for secure API access

### Added
- Cloudinary upload integration with proper authentication
- SplitInBatches node implementation for controlled processing
- Rate limiting with configurable delays between batches
- Retry logic for failed API requests
- Error handling for upload failures

### Fixed
- Google Drive access restrictions blocking uploads
- API rate limiting causing request failures
- Authentication token exposure in workflow JSON

### Removed
- Google Drive integration (moved to archive)
- Local file storage options
- Hardcoded API credentials

### Technical Improvements
- Implemented proper HTTP Header Auth for ElevenLabs API
- Created Cloudinary credential configuration
- Added batch state management
- Improved error logging and debugging

## [1.5.0] - 2024-10-XX - Google Drive Integration (Deprecated)

### Added
- Google Drive integration for audio file storage
- OAuth2 authentication for Google services
- Folder organization in Google Drive
- Automatic file naming conventions

### Issues Discovered
- Google Drive API restrictions for automated uploads
- Authentication complexity with service accounts
- Rate limiting issues with Google Drive API

### Status
- **DEPRECATED**: Google Drive integration moved to archive due to restrictions

## [1.2.0] - 2024-09-XX - Batch Processing Introduction

### Added
- First attempt at batch processing implementation
- Loop control for processing multiple items
- Batch size configuration (initial: 5 items per batch)
- Basic error handling for batch failures

### Known Issues
- Data persistence problems in loop control
- Complex state management across N8N nodes
- Inconsistent batch state after API responses

### Technical Details
- Used custom loop logic with item indexing
- Attempted to preserve batch state in item payload
- Implemented basic retry mechanisms

## [1.1.0] - 2024-08-XX - Rate Limiting & Security

### Added
- Basic rate limiting with fixed delays
- N8N credential system implementation
- Voice ID configuration options
- Text length validation

### Fixed
- API key exposure in workflow exports
- Missing authentication headers
- Inconsistent voice selection

### Security
- Migrated from hardcoded API keys to N8N credentials
- Implemented HTTP Header Auth for ElevenLabs API
- Added credential validation steps

## [1.0.0] - 2024-07-XX - Initial Release

### Added
- Basic text-to-speech workflow using ElevenLabs API
- Local file storage for generated audio
- Simple content array processing
- Voice selection by speaker name
- Basic error handling

### Features
- Single-item processing
- Local MP3 file output
- Hardcoded API credentials (later addressed)
- Manual workflow execution

### Technical Implementation
- Direct API calls to ElevenLabs TTS endpoint
- Basic HTTP Request nodes
- File system write operations
- Simple content structure

---

## Migration Guide

### From v2.x to v3.0
1. **File Organization**: Workflows have been moved to new directory structure
2. **Import New Workflows**: Use workflows from `production/` folder
3. **Update Documentation**: Review new setup guide and configuration examples
4. **Verify Credentials**: Ensure N8N credentials are properly configured

### From v1.x to v3.0
1. **Complete Rewrite**: v3.0 represents a complete rewrite of the workflow logic
2. **New Import Required**: Previous workflows are incompatible
3. **Credential Migration**: Update to N8N credential system
4. **Storage Migration**: Move from local/Google Drive to Cloudinary

## Archive Information

Historical versions and experimental workflows are preserved in the `archive/` directory:

- **Setup Guides**: Previous setup documentation
- **Experimental Workflows**: Various approaches and tests
- **Cloudinary Tests**: Authentication and upload testing workflows
- **Batch Processing Evolution**: Various attempts at batch processing
- **Google Drive Integration**: Deprecated Google Drive workflows

## Support & Contributions

### Version Support
- **v3.0+**: Actively maintained and supported
- **v2.x**: Security updates only
- **v1.x**: End of life, archived for reference

### Contributing
When contributing:
1. Test thoroughly with small datasets first
2. Update changelog with your changes
3. Follow the established naming conventions
4. Document any new configuration options
5. Archive old versions rather than deleting

### Reporting Issues
For bug reports or feature requests:
1. Specify the workflow version and N8N version
2. Include relevant configuration details
3. Provide minimal reproduction steps
4. Check archived versions for similar issues

---

**Maintainers**: Internal Team  
**Last Updated**: January 2025  
**Next Review**: March 2025