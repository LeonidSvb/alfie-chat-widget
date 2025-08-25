# Outdoorable Project Instructions

## ⚠️ CRITICAL FILE CREATION RULES

**NEVER create any files without detailed justification first. You MUST:**

1. **For ANY file creation:**
   - Explain WHY this specific file is needed
   - Explain WHY it's impossible without this file  
   - Explain HOW it relates to project goals
   - Get explicit approval before creating

2. **For MD/documentation files:**
   - List main bullet points of what will be included
   - Explain WHY this documentation is essential
   - Explain HOW it serves the project's specific needs
   - Show WHY existing documentation is insufficient

**No exceptions. Always ask first, create second.**

## ⚠️ ARCHITECTURAL DECISIONS RULES

**When proposing ANY architectural or technical solutions, you MUST:**

1. **Consider project goals first** - how does this serve Outdoorable's MVP objectives?
2. **Present multiple options** - show 2-3 different approaches with pros/cons
3. **Explain the logic** - WHY is one option optimal vs others?
4. **Educational approach** - teach me the reasoning, don't just give answers
5. **Simplicity analysis** - which approach is simpler and why that matters for MVP
6. **Impact assessment** - how will this decision affect future development?
7. **Trade-offs explanation** - what are we gaining/losing with each choice?

**Example format:**
- **Option A**: [approach] - Pros: [list] - Cons: [list] - Best for: [scenario]
- **Option B**: [approach] - Pros: [list] - Cons: [list] - Best for: [scenario]  
- **Recommended**: Option X because [educational explanation of why it's optimal for our MVP goals]

**Always explain WHY we can't do it differently and how it impacts the project.**

## ⚠️ README CONTENT RULES

**README.md is for humans only. NEVER include:**

1. **API keys or credentials** - reference .env file instead
2. **Detailed table structures** - data changes frequently  
3. **Specific expert profiles** - managed in Airtable
4. **Local development commands** - we use N8N Cloud
5. **Contributing guidelines** - solo development, not needed
6. **Code standards for undecided languages** - no premature decisions
7. **Support sections** - not a public open-source project
8. **License boilerplate** - MVP doesn't need it yet
9. **Sentimental signatures** - keep it professional

**README should only contain:**
- Project overview and goals
- Architecture explanation 
- Basic setup instructions
- Reference to CHANGELOG.md for history

**Keep it lean, factual, and current.**

## Architecture & Process Flow

**Real Conversation Flow:**
1. **Client** → asks questions through chat widget
2. **OpenAI** → every 2-3 questions reformulates & maintains Alfie personality 
3. **End of conversation** → trigger final processing:
   - **Perplexity** → Google search with site filtering
   - **OpenAI** → generates recommendations from search results  
   - **Airtable** → expert matching by region/specialization
4. **Output** → recommendations + matched expert + booking link

**N8N Cloud orchestrates everything. You can edit workflows directly via MCP.**

## Project Context

**What this is:**
- Travel MVP: AI chat widget connecting travelers to outdoor experts  
- 2 conversation flows: destination inspiration (16 questions) vs trip planning (11 questions)
- End goal: match users with real human experts for booking

**Alfie personality and conversation flows are implemented in N8N workflow prompts, not here.**

## Content Source Rules (Critical)

**PRIORITIZE these sites:**
- AllTrails, Komoot, National Park Service, tourism boards
- Outside Magazine, Adventure Journal, NYT Travel, NatGeo
- Local blogs, independent guides, conservation orgs

**BLOCK these commercial booking sites:**
- Booking.com, Expedia, Hotels.com, Airbnb, Viator
- TripAdvisor, GetYourGuide, all flight booking platforms
- Any site focused on price comparison vs authentic content

## Technical Notes

- **MVP approach**: functional over perfect
- **N8N Cloud**: main business logic lives in visual workflows  
- **Flexible tech stack**: no decisions locked in until approved
- **One HTML file for widget**: keep it simple

## Detailed Resources

**For deeper information, reference these files:**

- **`client/flows.txt`** - Detailed question flows and logic charts
- **`client/what sites to scrape.txt`** - Full lists of prioritized vs blocked websites  
- **`README.md`** - Project architecture, setup, development history

**Note:** Alfie personality is in N8N workflow prompts, not in files.