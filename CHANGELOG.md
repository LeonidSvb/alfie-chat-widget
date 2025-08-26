# Changelog

**RULES: Follow [Keep a Changelog](https://keepachangelog.com/) standard strictly. Only 6 categories: Added/Changed/Deprecated/Removed/Fixed/Security. Be concise, technical, no fluff.**

## [Unreleased]

## [1.1.0] - 2025-08-26

### Added
- Dynamic progress calculation based on user's actual question path
- Realistic progress estimation showing ~15-24 questions instead of full JSON count
- `estimatePathLength()` method for accurate progress tracking per flow and user choices

### Changed  
- Progress display format to "Question X of ~Y" with tilde indicating estimate
- Final webhook URL updated to `webhook-test/final-processing` for N8N testing
- Progress calculation now counts answered questions rather than JSON index position

### Fixed
- Progress bar showing inflated question counts (27 total vs 15-18 actual user path)
- Misleading progress indicators causing user confusion about flow length

## [1.0.0] - 2025-08-26

### Added  
- Modular widget architecture with clean HTML/CSS/JS separation
- AlfieWidget class with full conditional logic support (`branches`, `equals`, `not_equals`, `equals_any`)
- Dynamic flow loading from external JSON configurations
- Session ID generation and N8N webhook integration
- Progress tracking with debug numbers for development testing
- Complete Flow 1 (Inspire) configuration with all 24 questions from flows.txt specification
- Complete Flow 2 (Planning) configuration with proper branching logic matching new flowchart
- Comprehensive question types: single_select, multi_select, free_form with proper validation
- Advanced conditional logic for trip structure branching (Single/Multi-destination/Roadtrip)
- GitHub Pages deployment ready structure
- Expert matching system documentation with waterfall filtering logic (`client/expert-matching-logic.txt`)
- Perplexity content filtering strategy documentation (`client/perplexity-content-filtering.txt`)

### Changed
- Split monolithic index.html (900+ lines) into separate files
- Moved all assets to `widget/` directory for better organization
- Flow 2 restructured from 34 questions to 27 questions with proper branching
- Updated all image and config file paths to new widget structure
- Progress bar displays specific question numbers for debugging purposes

### Removed
- Inline CSS and JavaScript from HTML file
- Root-level `configs/` and `images/` directories (moved to `widget/`)

### Fixed
- Flow 2 conditional logic now properly implements trip structure branches
- Correct question counting and progress calculation
- File path references updated for new directory structure

## [0.5.0] - 2025-08-25 - Complete Flow Configurations

### Added
- Complete Flow 1 (Inspire) configuration with all 24 questions from flows.txt specification
- Complete Flow 2 (Planning) configuration with all 34 branching questions and conditional logic
- Comprehensive question types: single_select, multi_select, free_form with proper validation
- Advanced conditional logic for trip structure branching (Single/Multi-destination/Roadtrip)
- Optimized Alfie interaction triggers for natural conversation flow
- Full emoji integration matching flows.txt design specifications
- Expert matching system documentation with waterfall filtering logic (`client/expert-matching-logic.txt`)
- Perplexity content filtering strategy documentation (`client/perplexity-content-filtering.txt`)
- Client-ready documentation in Google Docs compatible format
### Changed
- Flow 1 total_questions updated from 16 to 24 (100% flows.txt compliance)  
- Flow 2 total_questions updated from 11 to 34 (complete branching implementation)
- Alfie triggers optimized: Flow 1 [4,8,12,16], Flow 2 [5,10,15,20] for even distribution
- Enhanced conditional logic with precise field matching and proper boolean operators
- Improved question formulations with context-aware text variants for different party types
- Documentation format optimized for easy Google Docs integration (removed markdown, added bullet points)

### Fixed
- Critical Flow 1 missing questions Q9-Q16 (Activity intensity, Outdoor activities, Food preferences, etc.)  
- Critical Flow 2 incomplete branching logic - added all Q12A-Q16A/B/C questions for trip types
- Incorrect total_questions causing progress bar calculation errors
- Alfie triggers referencing non-existent question positions
- Conditional logic field matching inconsistencies between question options and references
- JSON structure validation errors and field name standardization
- Widget navigation flow interruptions due to missing question sequences
- Proper conditional logic sanitization to avoid infinite loops or undefined states

### Removed
- Incomplete and placeholder question configurations that didn't match flows.txt
- Redundant test questions and development artifacts from configuration files

### Security
- Configuration validation to prevent widget crashes from malformed question data

## [0.4.0] - 2025-08-25 - Production N8N Workflows Implementation

### Added
- Production N8N workflows uploaded to cloud instance via API
- Alfie Intermediate Summaries workflow (ID: 8s7sGAadN8vwZury) with `/alfie-intermediate` endpoint
- Outdoorable Final Processing workflow (ID: 8yOG36hHNvALhOUE) with `/final-processing` endpoint
- OpenAI credential integration using existing account (PVUGFR4BRcDcdsZt)
- Airtable credential integration using existing token (TlvcaDmp0On83I0S) 
- Perplexity API integration via HTTP Request node with Bearer authentication
- Automated workflow deployment system using N8N Cloud API
- Comprehensive development changelog in `src/n8n-workflows/file-changelog.md`
- Input validation and progress calculation for conversation flows
- Dynamic Alfie personality adaptation based on conversation stage
- Complete processing pipeline: OpenAI → Perplexity → Airtable → OpenAI → Response

### Changed
- N8N workflow deployment from manual UI to automated API-based system
- Credential management from manual entry to existing credential ID reuse
- Perplexity integration approach from dedicated node to HTTP Request workaround
- Alfie personality implementation from static to context-aware responses

### Fixed
- N8N workflow JSON structure issues preventing API upload
- Connection mapping errors between workflow nodes
- Missing OpenAI credentials in workflow definitions
- Read-only field conflicts in N8N API requests
- Webhook registration dependencies on workflow activation status

### Removed
- Obsolete workflow files and development artifacts from n8n-workflows directory
- Redundant simple chat workflow (consolidated into proper intermediate workflow)
- Temporary activation and test files no longer needed

### Security
- API credentials properly referenced through N8N credential store
- Perplexity API key secured in HTTP Request headers rather than exposed URLs
- No sensitive data embedded in workflow JSON files committed to repository

---

### Technical Implementation Details

#### Critical N8N API Issues Resolved
1. **"request/body must NOT have additional properties"** - Stripped read-only fields (`active`, `versionId`, `id`) before upload
2. **"request/body/active is read-only"** - Manual UI activation required, no API activation available
3. **"The requested webhook is not registered"** - Webhooks only work when workflow is active
4. **Connection structure errors** - Exact string matching required between nodes and connections
5. **Missing credentials** - Added proper credential objects with existing IDs

#### API Integrations Configured
- **OpenAI**: gpt-4o-mini model with temperature 0.7-0.8 for personality responses
- **Perplexity**: llama-3.1-sonar-small-128k-online model via HTTP Request node
- **Airtable**: Base `appO1KtZMgg8P4IiR`, Table `Experts`, operation `list`

#### N8N Cloud API Limitations Discovered
- No programmatic workflow activation (requires manual UI)
- Credential listing endpoint not accessible via API
- Webhook testing blocked until manual UI activation
- Many workflow fields are read-only in API context

#### Next Session Requirements
1. Manual activation of both workflows in N8N Cloud UI
2. Webhook endpoint testing with sample conversation data
3. Airtable schema validation for Experts table structure
4. End-to-end flow testing with real travel preferences
5. Error handling validation for API failures

## [0.3.0] - 2025-01-25 - Documentation Cleanup & Architecture Rules

### Added
- README content rules in CLAUDE.md to prevent future bloat
- Architectural decision framework requiring multiple options analysis
- Educational approach requirement for technical proposals

### Removed
- API keys and credentials from README (moved to .env reference)
- Detailed expert table structures (data managed dynamically in Airtable)
- Specific expert profiles (outdated information)
- Local development commands and localhost references
- Contributing guidelines (solo development)
- Code standards for undecided languages (premature decisions)
- Support sections and license boilerplate (not needed for MVP)
- Workflow management detailed steps (cloud-based now)

### Changed
- README focused on project overview, architecture, and basic setup only
- All development history moved to CHANGELOG.md
- N8N references updated from local to cloud instances
- Deployment environment descriptions updated for cloud architecture

## [0.2.0] - 2025-01-25
### Added
- Airtable MCP server integration
- Production expert database with 6 profiles
- Two conversation flows: inspiration and planning
- Embedded chat widget with SVG avatars

### Changed
- Webhook configuration for N8N Cloud
- Project structure optimization

### Fixed
- MCP server build and connection issues

## [0.1.0] - 2025-01-20
### Added
- Initial MVP project structure
- Alfie personality documentation
- Basic N8N workflow template