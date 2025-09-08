# Outdoorable TripGuide Widget - Project Documentation

## What This Project Is

This is a **Next.js-based interactive widget** that generates personalized trip guides using OpenAI. Users complete a questionnaire, AI creates custom recommendations, and their data gets saved to GoHighLevel CRM. The widget embeds as an iframe on any website.

## Project Structure

### Root Files
- `next.config.js` - **Critical file** that allows iframe embedding on any website
- `package.json` - Dependencies: Next.js, OpenAI, Airtable, GoHighLevel clients
- `.env.local` - API keys (OpenAI, GoHighLevel, Airtable)
- `CHANGELOG.md` - Version history and feature updates
- `tsconfig.json` - TypeScript configuration

### Core Application (`src/app/`)
- **`page.tsx`** - Main widget entry point, handles all user flows and state
- **`layout.tsx`** - App wrapper with meta tags and responsive setup
- **`api/`** - Next.js API routes:
  - `generate-trip-guide/route.ts` - Calls OpenAI to create trip guides
  - `submit-email/route.ts` - Saves user data to GoHighLevel CRM
  - `match-expert/route.ts` - Finds matching experts from Airtable
  - `test-ghl-fields/route.ts` - Tests GoHighLevel integration

### Components (`src/components/`)
- **Questionnaire flows:**
  - `FlowSelector.tsx` - Choose "Inspire Me" or "I Know Where" path
  - `InspireMeFlow.tsx` - Questions for destination inspiration
  - `IKnowWhereFlow.tsx` - Questions for specific destination planning
  - `QuestionCard.tsx` - Individual question component
  - `ProgressBar.tsx` - Shows completion progress

- **Trip Guide display:**
  - `TripGuideDisplay.tsx` - Shows generated trip guide
  - `TripGuideLoading.tsx` - Loading animation while AI generates
  - `AIContentRenderer.tsx` - Formats AI-generated content
  - `EmailGatedTripGuide.tsx` - Collects email before showing full guide
  - `TripGuideChips.tsx` - Tag display for trip categories

- **Other components:**
  - `WidgetContainer.tsx` - Main widget wrapper with theming
  - `ExpertMatching.tsx` - Shows matched experts from database
  - `InlineEmailGate.tsx` - Email collection component

### Business Logic (`src/lib/`)
- **`tripGuideGenerator.ts`** - **Main AI logic**: calls OpenAI with prompts, handles retries, generates trip guides
- **`gohighlevel.ts`** - **CRM integration**: saves leads to GoHighLevel with custom fields
- **`airtable.ts`** - Expert database connection for matching users with guides
- **`openai.ts`** - OpenAI client configuration and models
- **`embedUtils.ts`** - Iframe embedding utilities (height adjustment, messaging)
- **`expertMatcher.ts`** - Algorithms to match users with relevant experts
- **`emailAnalytics.ts`** - Tracks email submissions and conversions

### Test Mode (`src/test-mode/`)
- **`TestModeWrapper.tsx`** - Test interface (access with `?TestMod=1`)
- **`registry.ts`** - Test scenarios and fixtures
- **`SimpleTestPanel.tsx`** - Quick testing interface
- **`__tests__/`** - Automated tests for all flows

### Types (`src/types/`)
- `questionnaire.ts` - Question and flow type definitions
- `tripGuide.ts` - Trip guide data structure
- `expert.ts` - Expert profile types
- `widget.ts` - Widget configuration types
- `crm.ts` - GoHighLevel data types

## How It Works

### User Flow
1. **User sees widget** on host website (embedded via iframe)
2. **Selects flow**: "Inspire Me" (need destination ideas) or "I Know Where" (have destination)
3. **Answers questions**: 3-7 questions about budget, interests, experience level
4. **AI generates guide**: Uses OpenAI with custom prompts (30 seconds)
5. **Email collection**: User provides email to get full guide
6. **Data saved**: Contact automatically added to GoHighLevel CRM with preferences
7. **Expert matching**: System suggests relevant experts from Airtable database

### Key Technical Functions

#### `tripGuideGenerator.ts`
- `generateInspireGuide()` - Creates destination inspiration using OpenAI
- `generatePlanningGuide()` - Creates detailed trip plans for known destinations  
- `generateTags()` - Creates tags for expert matching
- Includes retry logic for API failures and rate limiting

#### `gohighlevel.ts`  
- `createContact()` - Saves user data to CRM with custom fields
- Handles GoHighLevel V1 API format (customField object, not array)
- Includes error handling and manual logging if API fails

#### `next.config.js` - Iframe Embedding
```javascript
headers: [
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors *;"  // Allows embedding on ANY domain
  }
]
```

## Why N8N Cannot Do This

### Technical Limitations of N8N:
1. **No HTTP headers control** - Cannot set `Content-Security-Policy` or `X-Frame-Options`
2. **No iframe capability** - Cannot create embeddable widgets that work across domains  
3. **No frontend rendering** - Cannot display interactive React components
4. **Webhook limitations** - Would require proxy servers, adding complexity and cost
5. **No state management** - Cannot handle multi-step user flows with progress tracking

### What N8N Can Do vs. What This Project Does:
| Feature | N8N | This Project |
|---------|-----|-------------|
| API integrations | ✅ | ✅ |
| Data workflows | ✅ | ✅ |
| Interactive UI | ❌ | ✅ |
| Iframe embedding | ❌ | ✅ |
| Real-time user interaction | ❌ | ✅ |
| Custom React components | ❌ | ✅ |
| Cross-domain embedding | ❌ | ✅ |

**Bottom line**: N8N handles backend workflows, but cannot create interactive, embeddable user interfaces.

## Environment Setup

### Required Environment Variables (`.env.local`)
```
OPENAI_API_KEY=your_openai_key_here
GOHIGHLEVEL_API_KEY=your_ghl_key_here  
GOHIGHLEVEL_LOCATION_ID=your_location_id_here
AIRTABLE_API_KEY=your_airtable_key_here
AIRTABLE_BASE_ID=your_base_id_here
```

### Installation & Launch
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production  
npm run build
npm start

# Run tests
npm test

# Test mode (in browser)
http://localhost:3000/?TestMod=1
```

## Deployment

### Current Setup
- **Hosting**: Vercel (automatic deployment from GitHub)
- **Domain**: Links to production URL
- **Embedding**: Works on Webflow, WordPress, Shopify, any HTML site

### Embed Code
```html
<iframe 
  src="https://your-domain.vercel.app/?embedded=true&theme=light" 
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

### Vercel Deployment
1. Connected to GitHub repository
2. Automatic deployments on `git push`
3. Environment variables configured in Vercel dashboard
4. Custom domain configured if needed

## Key Files You Need to Know

### Must Understand Files:
1. **`next.config.js`** - Makes iframe embedding work (CSP headers)
2. **`src/app/page.tsx`** - Main application logic and user flow
3. **`src/lib/tripGuideGenerator.ts`** - AI trip guide creation
4. **`src/lib/gohighlevel.ts`** - CRM integration
5. **`src/components/Questionnaire/FlowSelector.tsx`** - User journey starts here

### Configuration Files:
1. **`.env.local`** - API keys and secrets
2. **`package.json`** - Dependencies and scripts  
3. **`tsconfig.json`** - TypeScript settings

### Testing:
1. **`src/test-mode/`** - Test interface (`?TestMod=1`)
2. **`src/__tests__/`** - Automated tests

## Common Issues & Solutions

### Embedding Problems
- **Issue**: Widget not loading in iframe
- **Solution**: Check `next.config.js` CSP headers, ensure `frame-ancestors *`

### API Failures  
- **Issue**: OpenAI or GoHighLevel errors
- **Solution**: Check API keys in `.env.local`, verify rate limits

### Development Issues
- **Issue**: Build failures
- **Solution**: Run `npm install`, check Node.js version (16+)

## Project Value

This project combines:
- ✅ Interactive React frontend with multi-step flows
- ✅ AI integration (OpenAI) for content generation  
- ✅ CRM integration (GoHighLevel) for lead capture
- ✅ Database integration (Airtable) for expert matching
- ✅ Universal embedding capability (works anywhere)
- ✅ Mobile responsive design
- ✅ Test mode for easy QA
- ✅ Production-ready deployment pipeline

**Technical complexity**: Handles cross-domain embedding, AI API integration, CRM automation, responsive design, error handling, and performance optimization - all in a single embeddable widget.

**Business impact**: Converts website visitors into qualified leads through interactive experience, with automatic CRM integration and expert matching.