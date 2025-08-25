# Changelog

**RULES: Follow [Keep a Changelog](https://keepachangelog.com/) standard strictly. Only 6 categories: Added/Changed/Deprecated/Removed/Fixed/Security. Be concise, technical, no fluff.**

## [Unreleased]

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