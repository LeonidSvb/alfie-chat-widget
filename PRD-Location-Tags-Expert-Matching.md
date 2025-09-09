# PRD: Location Tags, Canonical Tag System, and Expert Matching (MCP-only)

## Raw Context & Requirements
Based on detailed requirements:
- **wearTable function**: Takes expert description, uses OpenAI to generate tags for columns (country, state, region, etc.), fills appropriate columns for each expert
- **Fill all experts**: Ensure all experts in table have tags
- **Canonical tag function**: Calls all tags, removes duplicates, creates unique set (100-500 tags) to pass to OpenAI without wasting context window
- **Trip guide generation**: For InspireMe flow - 3 ideas, 3 experts. Each expert selected by generated content results. Location right under idea (accordion style). Expert card at bottom of each accordion so users can immediately book consultation
- **IKnowWhere flow**: 1 expert (only one generation)
- **Tag extraction function**: After OpenAI trip guide generation, make another OpenAI request with prompt: "Based on this trip guide, choose necessary tags" - input trip guide + set of all unique tags from table. OpenAI chooses right set of tags (region, country, state, etc.)
- **Matching function**: Tags + hierarchy with internal scoring system (most specific to least specific). Country: +5 points, specific place: +30 points. Each tag category has weight in points
- **Search priority**: Look for expert at highest tag scoring level first. If none found, go to next level up until found. If multiple experts found, look at other matching tags, choose expert with highest scoring points
- **Performance**: Generation should happen while user enters email, so experts are ready when email submitted. Use placeholders if not ready to avoid lags
- **MCP-only**: All Airtable operations through airtable-mcp-server, no direct SDK
- **Location focus**: Only location tags now (country, region, subregion, city, town, specific-area). Activity tags later
- **US states**: Treat as "region" (no separate state field), unify with other countries' regions

## Goal
Implement MCP-only location tagging system with hierarchical expert matching integrated into TripGuide flows. Generate structured location tags for all experts, maintain dynamic canonical tag set, and match experts to trip ideas using weighted hierarchy.

## Success Metrics
- All experts have structured location tags (country, region, subregion, city, town, specific-area)
- Canonical tag set dynamically generated without duplicates
- InspireMe: 3 ideas → 3 expert cards (under accordions)
- IKnowWhere: 1 idea → 1 expert card
- Expert matching completes while user enters email (no UI lag)
- Test Mode shows top-3 experts with internal scoring (dev-only)

## Scope (MVP)

### Must-Have
- **Expert Tagging System**:
  - OpenAI generates structured location tags from expert descriptions
  - Write to Airtable fields: Country, Region, Sub-Region, City, Town, Specific Area, Location Tags
  - Normalize to lowercase, kebab-case format
  - Handle US states as "region" field (unified with other countries)

- **Canonical Tag Management**:
  - Dynamic aggregation of all expert location tags via MCP
  - Deduplication and normalization
  - No static tag files - always computed from current expert data
  - Limit size for OpenAI context windows

- **Hierarchical Expert Matching**:
  - Weighted scoring system (editable config):
    - specific-area: 30 points
    - town/city: 20 points  
    - subregion: 12 points
    - region: 10 points
    - country: 5 points
  - Fallback hierarchy: specific-area → town/city → subregion → region → country
  - Tie-breaking: more matches at narrower levels → rating → random

- **Trip Guide Integration**:
  - Extract relevant tags from generated trip guide content
  - Match tags against canonical set only (no novel tags)
  - InspireMe: 3 accordions → 3 expert cards
  - IKnowWhere: 1 accordion → 1 expert card
  - Show matched tags on expert cards

- **UI/UX Requirements**:
  - Expert cards appear under each idea accordion
  - Skeleton placeholders while matching in progress
  - No blocking/lag when ideas are ready but experts still loading
  - Show "why matched" with overlapping tags

- **MCP-Only Architecture**:
  - All Airtable operations through airtable-mcp-server v1.7.2+
  - No direct Airtable SDK usage in runtime code
  - Environment variables for API keys (AIRTABLE_API_KEY)

### Nice-to-Have (Later)
- Activity tags (hiking, climbing, cultural, etc.)
- Cached canonical tag sets with TTL
- Advanced matching explanations
- Expert rating/priority weights in tie-breaking

### Out of Scope
- Payment integration
- Calendar booking (just links to expert profiles)
- Social features
- Mobile app (web widget only)

## Technical Architecture

### Data Model (Airtable)
Use existing experts table `tblsSB9gBBFhH2qci`. Required fields:
```
- Country (text/single select)
- Region (text) - for US this contains state names
- Sub-Region (text)  
- City (text)
- Town (text)
- Specific Area (text)
- Location Tags (text/array) - normalized kebab-case tags
- Profile Link (existing booking URL)
```

### Core Components

**1. MCP Airtable Layer** (`src/lib/mcpAirtable.ts`)
- Typed wrapper for airtable-mcp-server calls
- Expert CRUD operations
- Tag aggregation and canonicalization
- Error handling and retries

**2. OpenAI Tagging** (`src/lib/openai.ts` extensions)
- `generateExpertStructuredTags()`: expert description → structured location fields
- `extractTripGuideTagsFromCanonicalSet()`: trip guide + canonical tags → relevant subset

**3. Hierarchical Matching** (`src/lib/expertMatcher.ts` - new implementation)
- Weighted scoring algorithm
- Fallback hierarchy traversal  
- Tie-breaking logic
- Configuration in `src/lib/tagConfig.ts`

**4. Trip Guide Generation** (`src/lib/tripGuideGenerator.ts` updates)
- Integrate tag extraction after content generation
- Parallel expert matching for each idea
- Return enhanced structure with experts and tags

**5. Prompts** (`back/prompts/tagging-prompts.ts` - new)
- Expert location tagging prompt (structured output)
- Trip guide tag selection prompt (canonical set filtering)

### API Extensions

**POST `/api/generate-trip-guide`** - Enhanced Response:
```json
{
  "success": true,
  "guide": {
    "id": "tripguide_...",
    "flowType": "inspire-me",
    "title": "Your Trip Inspiration", 
    "content": "...",
    "tags": ["utah", "zion", "southwest-us"],
    "ideas": [
      {
        "id": "idea-1",
        "title": "Adventure Idea 1: Zion National Park",
        "body": "...",
        "tags": ["zion", "utah", "southwest-us"],
        "expert": {
          "id": "rec...",
          "name": "Sarah Mountain",
          "avatar": "...",
          "description": "...",
          "link": "https://calendly.com/sarah-mountain"
        },
        "matchedTags": ["zion", "utah"],
        "matchScore": 0.85
      }
    ],
    "matchingMeta": {
      "totalExperts": 45,
      "tagCanonicalization": "...",
      "fallbackLevels": ["specific-area", "city", "region"]
    }
  }
}
```

### User Flows

**1. Expert Backfill Process**
```
1. MCP reads all experts from Airtable
2. For each expert: OpenAI generates structured location tags
3. MCP writes back to location fields
4. Normalization and deduplication applied
5. Location Tags field populated with kebab-case array
```

**2. Trip Guide Generation with Expert Matching**
```
1. Generate trip guide content (existing flow)
2. MCP aggregates canonical tag set from all experts  
3. OpenAI extracts relevant tags from guide content
4. For each idea:
   - Match tags against expert location tags
   - Apply weighted scoring hierarchy
   - Select best expert with fallback logic
5. Return enhanced response with ideas + experts
```

**3. UI Rendering Flow**
```
1. Display trip guide ideas immediately (existing)
2. Show skeleton placeholders for expert cards
3. As expert matching completes, populate cards
4. Show matched tags and "why selected" explanation
5. Link to expert booking page
```

## Configuration & Weights

**Tag Hierarchy Weights** (`src/lib/tagConfig.ts`):
```javascript
export const TAG_WEIGHTS = {
  'specific-area': 30,
  'town': 20,
  'city': 20, 
  'subregion': 12,
  'region': 10,
  'country': 5
};

export const FALLBACK_ORDER = [
  'specific-area',
  'town', 
  'city',
  'subregion', 
  'region',
  'country'
];

export const NORMALIZATION_RULES = {
  'usa': 'united-states',
  'us': 'united-states',
  'uk': 'united-kingdom',
  // ... more synonyms
};
```

## Test Mode Features

**Developer Panel** (`src/test-mode/components/LocationTagsTestPanel.tsx`):
- 30 random location tag combinations (10 per hierarchy level)
- Top-3 expert matches with internal scoring breakdown
- Tag canonicalization diagnostics
- Matching performance metrics
- Hidden in production builds

**Test Scenarios**:
- No matching experts (fallback to country level)
- Multiple experts with same score (tie-breaking)
- Large canonical tag sets (token limit handling)
- US state vs international region handling

## Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Create `src/lib/tagConfig.ts` with weights and rules
- [ ] Add `back/prompts/tagging-prompts.ts` 
- [ ] Implement `src/lib/mcpAirtable.ts` wrapper
- [ ] Extend `src/lib/openai.ts` with tagging functions

### Phase 2: Matching Engine (Week 1-2)  
- [ ] Archive existing matcher to `src/legacy/expertMatcher.ts`
- [ ] Implement new hierarchical matching in `src/lib/expertMatcher.ts`
- [ ] Create backfill script `scripts/generate-expert-tags.js`
- [ ] Run backfill on all existing experts

### Phase 3: Trip Guide Integration (Week 2)
- [ ] Update `src/lib/tripGuideGenerator.ts` with tag extraction
- [ ] Enhance `src/app/api/generate-trip-guide/route.ts` response
- [ ] Update TypeScript types in `src/types/`

### Phase 4: UI Updates (Week 2-3)
- [ ] Modify `src/components/TripGuide/EmailGatedTripGuide.tsx`
- [ ] Add expert cards under accordions with skeletons
- [ ] Update `src/components/Expert/ExpertCard.tsx` for matched tags
- [ ] Implement loading states and error handling

### Phase 5: Test Mode & Polish (Week 3)
- [ ] Create Test Mode location tags panel
- [ ] Add comprehensive test coverage
- [ ] Performance optimization and error handling
- [ ] Documentation updates

## Risks & Mitigations

**Large Canonical Tag Sets**:
- Risk: Token limits with 500+ unique tags
- Mitigation: Frequency-based pruning, chunked processing, max prompt length limits

**MCP Availability**:
- Risk: airtable-mcp-server downtime or connection issues  
- Mitigation: Retry logic, graceful degradation, local development setup

**Tag Normalization Complexity**:
- Risk: Inconsistent location naming (NYC vs New York City)
- Mitigation: Comprehensive normalization rules, manual review process

**Performance Impact**:
- Risk: Expert matching delays trip guide display
- Mitigation: Async processing, skeleton UI, parallel execution

## Success Criteria

**Functional**:
- [ ] All experts have structured location tags
- [ ] Canonical tag set generates without duplicates  
- [ ] Expert matching works with weighted hierarchy
- [ ] UI shows expert cards under trip ideas
- [ ] Test Mode displays internal scoring

**Performance**:
- [ ] Trip ideas display immediately (<2s)
- [ ] Expert matching completes during email entry (<10s)
- [ ] No UI blocking or lag perception
- [ ] Canonical tag aggregation <5s

**Quality**:
- [ ] Tag normalization handles edge cases
- [ ] Fallback matching always finds expert
- [ ] MCP integration stable and reliable
- [ ] Test coverage >80% for new components

## Post-MVP Roadmap

**Activity Tags**: Extend beyond location to activities (hiking, cultural, adventure)
**Caching Layer**: Redis/memory cache for canonical tags and frequent matches  
**Advanced Matching**: ML-based similarity, user preference learning
**Analytics**: Track expert selection success rates and user conversions
**Internationalization**: Multi-language tag support and normalization
