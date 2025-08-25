# Outdoorable MVP - AI Travel Concierge

> Embedded travel concierge assistant that surfaces real recommendations from outdoor experts around the world.

## 🎯 Project Overview

**Alfie** is your Adventure Concierge - a clever AI chat widget that connects travelers with real outdoor experts. Think of Alfie as your friendly fox guide who knows the perfect balance of popular must-sees and hidden local gems.

### Key Features
- **Alfie Personality**: Warm, witty, and outdoorsy AI that acts as an adventure concierge
- **2 Main Conversation Flows**: Destination inspiration ("where should I go?") and trip planning ("help me plan my trip to X")
- **Expert Connection**: Every conversation ends with connection to real human experts
- **Authentic Recommendations**: Popular destinations reframed with local insider twists
- **Source Filtering**: Prioritizes editorial/local content, avoids commercial booking platforms
- **Responsible Travel**: Focus on supporting local communities and sustainable tourism

## 🏗️ Architecture

```
Frontend (Next.js Chat Widget) 
    ↓ Webhook
N8N Workflow Orchestration
    ↓ API Calls  
OpenAI + Perplexity + Airtable
    ↓ Response
Expert Profiles + Booking CTA
```

### Tech Stack
- **Orchestration**: N8N (self-hosted)
- **Frontend**: Next.js chat widget (embeddable)
- **AI**: OpenAI GPT-4 + Perplexity API
- **Database**: Airtable (experts, content, analytics)
- **MCP**: Airtable MCP Server for data management
- **Deployment**: Local development → Cloud production

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- N8N instance with API access
- OpenAI API key
- Perplexity API key
- Airtable account

### Installation

1. **Clone and setup**
   ```bash
   git clone <repo>
   cd outdoorable
   npm install
   ```

2. **Setup Airtable MCP**
   ```bash
   cd airtable-mcp-server
   npm install
   npm run build
   ```

3. **Access N8N Cloud**
   - Use your N8N Cloud instance
   - Import workflow via interface

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Add your API keys
   ```

5. **Import workflows**
   - Open N8N interface
   - Import `workflow.json` 
   - Configure credentials for each service

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🗣️ Alfie's Conversation Flows

### Flow 1: Destination Inspiration
*"Inspire me - I'm not sure where to go yet"*
- **16 detailed questions** covering geography, travel style, party composition, activities
- Balances popular destinations with local authenticity
- Outputs 2-3 personalized destination recommendations
- Includes sample itineraries and expert connections

### Flow 2: Trip Planning & Recommendations  
*"I know my destination - help with recs & itinerary"*
- **11 targeted questions** covering trip structure (single/multi-destination/roadtrip)
- Activity preferences, food interests, guided vs independent
- Creates detailed itineraries with local insider tips
- Connects to regional experts for deeper planning

## 🦊 Meet Alfie - Your Adventure Concierge

**Personality**: Warm, witty, outdoorsy fox who's your connector to authentic travel experiences

**Voice Style**:
- Conversational, informal, text-like with contractions
- Self-aware humor ("I'm just a fox in a hoodie")
- Never mentions AI - frames everything as expert-driven knowledge
- Always suggests something "beyond the obvious"

**Recommendation Philosophy**:
- **Balance Local + Popular**: Never skips classics, but adds authentic local layers
- **Reframe as Gateway**: Off-hour timing, local expert perspective, alternate access routes
- **Authenticity Filters**: Who profits? Who leads? Would locals do this?
- **Guest-Friendly**: Never shames travelers for wanting popular spots

## 🗂️ Project Structure

```
outdoorable/
├── README.md                     # This file - complete documentation
├── .env                          # Environment variables
├── workflow.json                 # Main N8N workflow
├── src/
│   ├── chat-logic.js            # Chat interaction logic
│   └── widget.js                # Embeddable chat widget
├── client/                      # Client materials (excluded from git)
│   ├── alfies_personality.txt   # Complete Alfie brand voice guide
│   ├── flows.txt                # Detailed conversation flow logic
│   ├── questions.txt            # All question types and options
│   └── what sites to scrape.txt # Content source prioritization
├── airtable-mcp-server/         # MCP server for Airtable integration
├── images/                      # Project screenshots and assets
└── archive/                     # Backup and archived files
```

## 🗃️ Airtable Configuration

### Production Base Setup
- **Base ID**: `appO1KtZMgg8P4IiR`
- **Base Name**: "Outdoorable Production"
- **Main Table**: `Experts` (ID: `tblUxVoMSLwS8cFMR`)

### Expert Database
Expert profiles and matching logic are managed in Airtable. Table structure and expert data are updated dynamically.

## 🔧 Environment Variables

See `.env` file for required API keys and configuration.

## 🤖 N8N Workflow Setup

1. Import `workflow.json` into your N8N instance
2. Update Airtable credentials with your API key
3. Set Base ID to `appO1KtZMgg8P4IiR`
4. Configure OpenAI credentials with Alfie personality prompts
5. Configure Perplexity API for content filtering (prioritize authentic sources)
6. Test webhook endpoints
7. Activate the workflow

### Workflow Features
- **Alfie Personality Integration**: All responses match brand voice and tone
- **2-Flow Routing**: Inspiration vs destination planning logic
- **Content Source Filtering**: Prioritizes editorial/local content, blocks commercial booking sites
- **Expert Matching**: Location and specialization-based recommendations
- **Authentic Recommendations**: Popular + local balance in all suggestions
- **Error handling**: Fallback responses maintain Alfie's voice

## 🌐 Widget Integration

The chat widget files are in `/src/`:
- `widget.js` - Main widget logic and UI
- `chat-logic.js` - Conversation flow handling

### Embedding the Widget
```html
<script src="path/to/widget.js"></script>
```

Update webhook URL in `widget.js` to point to your N8N instance.

## 🧪 Testing

### Test Conversation Flows
```bash
# Test flows via N8N Cloud webhook endpoints
# Use your specific N8N Cloud webhook URLs
```

### Alfie Personality Tests
1. **Voice consistency**: Check for conversational tone, contractions, no AI mentions
2. **Popular + Local balance**: Verify recommendations include both classic spots and insider tips
3. **Expert connections**: Ensure all conversations end with expert booking offers
4. **Source filtering**: Confirm no Booking.com/Expedia links in responses
5. **Authenticity**: Check for "beyond the obvious" suggestions

## 📊 Development Status

**Current Phase**: MVP Development - Core functionality operational

**See [CHANGELOG.md](./CHANGELOG.md) for detailed development history and session logs.**

## 🚦 Deployment

### Development Environment
- N8N: Cloud instance
- Widget: Single HTML file 
- Database: Airtable Cloud workspace
- MCP Server: Integrated with Claude Code

### Production Environment
- N8N: Cloud instance
- Frontend: Embedded widget deployment
- Database: Airtable Cloud workspace
- Monitoring: N8N execution logs

## 🔄 Management

**Workflows**: Edit directly in N8N Cloud interface
**Experts**: Add/edit directly in Airtable Cloud interface

## 🐛 Troubleshooting

### Common Issues
- **N8N API unauthorized**: Check API key in .env
- **Workflow execution fails**: Verify all credentials configured
- **Expert matching empty**: Check Airtable schema and data
- **Chat widget not loading**: Verify webhook URLs and CORS settings
- **MCP server connection**: Ensure airtable-mcp-server is built and running

### Debug Mode
- Enable N8N execution logging
- Use webhook test endpoints
- Check browser console for frontend errors
- Verify Airtable API responses


