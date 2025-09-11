# Coding Pattern Preferences

## Core Principles

### Simplicity First
- Always prefer simple solutions over complex ones
- Avoid over-engineering or premature optimization
- Choose straightforward implementations that are easy to understand and maintain

### DRY (Don't Repeat Yourself)
- Avoid duplication of code whenever possible
- Before writing new functionality, check for similar existing code in the codebase
- Refactor common patterns into reusable utilities or components
- Share logic across components rather than duplicating it

### Environment Awareness
- Write code that works consistently across different environments: dev, test, and prod
- Use environment variables for configuration differences
- Avoid hardcoding values that might differ between environments
- Test code behavior in all target environments

### Focused Changes
- Only make changes that are requested or directly related to the task at hand
- Be confident that changes are well understood and necessary
- Avoid scope creep or tangential improvements unless explicitly requested

### Conservative Technology Choices
- When fixing issues or bugs, exhaust all options within the existing implementation first
- Avoid introducing new patterns or technologies without strong justification
- If new patterns are introduced, ensure old implementations are properly removed to prevent duplicate logic
- Maintain consistency with existing codebase patterns

## Code Organization

### Clean Codebase
- Keep the codebase very clean and organized
- Follow existing file structure and naming conventions
- Group related functionality together
- Remove unused code and imports

### File Management
- Avoid writing one-time scripts directly in files
- If scripts are needed, create them in appropriate directories (e.g., `scripts/`)
- Consider whether a script will be reused before embedding it in the codebase

### File Size Limits
- Keep files under 200-300 lines of code
- Refactor larger files by splitting them into smaller, focused modules
- Break down complex components into smaller, composable pieces

## Data and Testing

### No Fake Data in Production
- Mocking data is only acceptable for tests
- Never add stubbing or fake data patterns that affect dev or prod environments
- Use real data sources and proper error handling for development and production

### Environment Files
- Never overwrite `.env` files without explicit permission and confirmation
- Always ask before modifying environment configuration
- Back up existing environment files when changes are necessary

## Next.js Specific Guidelines

### Component Organization
- Follow the established component structure in `src/components/`
- Keep components focused on a single responsibility
- Use TypeScript for type safety
- Follow existing naming conventions (PascalCase for components)

### API Routes
- Place API routes in `src/app/api/` following the App Router structure
- Handle errors appropriately with proper HTTP status codes
- Validate input data before processing
- Use environment variables for API keys and sensitive data

### Data Management
- Use the established data structure in `src/data/`
- Keep questions and prompts in separate, organized files
- Follow the existing pattern for flow definitions

### Integration Patterns
- Follow established patterns for external API integrations (OpenAI, Airtable, GoHighLevel)
- Create reusable client utilities in `src/lib/`
- Handle API errors gracefully with proper fallbacks

### Airtable MCP Integration
- **Primary Method**: Use official MCP server via NPM (`npm install airtable-mcp-server`)
- **Version**: v1.7.2+ (latest stable)
- **Installation**: Installed as project dependency for better stability and version control
- **Alternative**: NPX method available (`npx -y airtable-mcp-server`) but NPM preferred
- **Security**: API keys stored in environment variables, never transmitted externally
- **Architecture**: Local MCP server communicates directly with Airtable API
- **Capabilities**: Full CRUD operations, schema inspection, search, and table management
- **API Tokens**: Two verified working tokens available:
  - `AIRTABLE_API_KEY` - Primary token (current)
  - `AIRTABLE_MCP_TOKEN` - Backup MCP-specific token 
- **Usage**: Configure in Claude Desktop/Cursor with AIRTABLE_API_KEY environment variable
- **Local Access**: Run via `./node_modules/.bin/airtable-mcp-server` or `npx airtable-mcp-server`

## Widget-Specific Considerations

### Embedding
- Ensure code works within iframe constraints
- Test responsive behavior across different screen sizes
- Minimize bundle size for faster loading in embedded contexts

### Styling
- Use existing CSS patterns from the `src/styles/` directory
- Maintain visual consistency with the Outdoorable brand
- Ensure styles are scoped to avoid conflicts with host pages

### Performance
- Optimize for fast loading in embedded environments
- Minimize external dependencies
- Use efficient rendering patterns to avoid unnecessary re-renders

## Test Mode Integration

### Feature Testing Requirements
- When we release a new feature, it must be immediately added to test mode for easy testing
- Every new feature should include test mode declarations in its implementation
- Use `?TestMod=1` to access the test mode interface for comprehensive feature testing

### Test Mode Implementation Process
1. **Feature Development**: Implement the feature with normal functionality
2. **Test Integration**: Add feature to test mode registry with appropriate actions and fixtures
3. **Validation Testing**: Create and run comprehensive tests for each test mode component
4. **Success Criteria**: All tests must pass before feature is considered complete

### Testing Standards
- Create 5 comprehensive tests for each major test mode component
- Test both isolated functionality and integration with existing features
- Ensure all test scenarios pass successfully
- If any test fails, address the issue immediately before proceeding
- Document test results and maintain test coverage for future changes


Where it is possible to make massive batches First, see what needs to be changed, and then change everything massively to make it as fast as possible. 


When you test, run localhost randomly from 3000 to 6000. Maximum randomly. And when you finish testing, close unused ports so that they don't accumulate. 
- Never commit yourself on GitHub if I don't tell you directly about it.