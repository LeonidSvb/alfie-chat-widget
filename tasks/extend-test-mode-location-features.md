---
description: Add location tag testing features to existing test mode system
globs: src/test-mode/features/*.js,src/test-mode/data/*.json,src/test-mode/registry.ts
alwaysApply: false
---

id: "TASK-0003"
title: "Extend test mode with location tag testing"
status: "planned"
priority: "P2"
labels: ["test-mode", "location", "testing", "fixtures"]
dependencies: ["tasks/enhance-location-tagging-system.md", "tasks/integrate-trip-guide-expert-matching.md"]
created: "2025-01-09"

# 1) High-Level Objective

Extend existing test mode system with location-specific testing features and fixtures for comprehensive validation of location tagging and expert matching.

# 2) Background / Context

Current test mode in src/test-mode/ has flow testing but lacks location-specific fixtures. Need to add location tag testing panel, diverse location fixtures, and validation tools following existing test mode patterns.

# 3) Assumptions & Constraints

- ASSUMPTION: Existing test mode registry and feature system works well
- Constraint: Follow existing patterns in src/test-mode/registry.ts
- Constraint: Use existing fixture structure from src/test-mode/data/randomAnswers.json
- Constraint: Maintain existing TestMod=1 parameter system

# 4) Dependencies (Other Tasks or Artifacts)

- tasks/enhance-location-tagging-system.md
- tasks/integrate-trip-guide-expert-matching.md
- src/test-mode/registry.ts (existing)
- src/test-mode/features/ (existing)

# 5) Context Plan

**Beginning (add to model context):**

- src/test-mode/registry.ts
- src/test-mode/features/flowFeature.js
- src/test-mode/data/randomAnswers.json
- src/components/TestMode/ _(read-only)_

**End state (must exist after completion):**

- src/test-mode/features/locationTagsFeature.js (new)
- src/test-mode/data/locationTestFixtures.json (new)
- src/test-mode/registry.ts (updated with location feature)

# 6) Low-Level Steps (Ordered, information-dense)

1. **Create location tags test feature**

   - File: `src/test-mode/features/locationTagsFeature.js`
   - Exported API:
     ```js
     export const locationTagsFeature = {
       name: 'Location Tags Testing',
       description: 'Test hierarchical location tagging and expert matching',
       actions: [
         { name: 'Test Location Tag Generation', handler: testLocationTagGeneration },
         { name: 'Test Expert Location Matching', handler: testExpertLocationMatching },
         { name: 'Test Location Hierarchy Scoring', handler: testLocationHierarchyScoring }
       ],
       fixtures: locationTestFixtures
     };
     ```
   - Details:
     - Test location tag extraction from various questionnaire responses
     - Test expert matching with different location hierarchies
     - Test scoring system with specific-area vs country matches

2. **Create diverse location test fixtures**

   - File: `src/test-mode/data/locationTestFixtures.json`
   - Structure following existing randomAnswers.json pattern:
     ```json
     {
       "specificLocationTests": [
         {
           "name": "Utah Zion Specific",
           "questionnaire": { "specificPlaces": ["Zion National Park"], "homeBase": "Utah" }
         },
         {
           "name": "European Multi-Country", 
           "questionnaire": { "regions": ["europe"], "specificPlaces": ["Paris", "Rome"] }
         }
       ],
       "hierarchyTests": [
         // Country-only, region-only, city-specific scenarios
       ]
     }
     ```

3. **Add location testing actions**

   - File: `src/test-mode/features/locationTagsFeature.js`
   - Implement test handlers:
     ```js
     async function testLocationTagGeneration(fixture) {
       const tags = await generateTagsFromAnswers(fixture.questionnaire);
       return {
         input: fixture.questionnaire,
         extractedLocationTags: tags.filter(t => isLocationTag(t)),
         hierarchy: categorizeLocationTags(tags)
       };
     }
     ```

4. **Register location feature in test mode**

   - File: `src/test-mode/registry.ts`
   - Add to existing features array:
     ```ts
     import { locationTagsFeature } from './features/locationTagsFeature.js';
     
     export const testFeatures = [
       flowFeature, // existing
       locationTagsFeature, // new
       // ... other existing features
     ];
     ```

5. **Create location tag validation utilities**

   - File: `src/test-mode/features/locationTagsFeature.js`
   - Helper functions:
     ```js
     function isLocationTag(tag) {
       return LOCATION_HIERARCHY.some(level => 
         tag.includes(level) || isGeographicTerm(tag)
       );
     }
     
     function categorizeLocationTags(tags) {
       return {
         country: tags.filter(t => isCountryTag(t)),
         region: tags.filter(t => isRegionTag(t)),
         city: tags.filter(t => isCityTag(t))
       };
     }
     ```

# 7) Types & Interfaces

```ts
// src/test-mode/types.ts (extend existing if exists)
interface LocationTestFixture {
  name: string;
  questionnaire: QuestionnaireData;
  expectedLocationTags?: string[];
  expectedHierarchy?: LocationHierarchy[];
}

interface LocationTestResult {
  input: QuestionnaireData;
  extractedLocationTags: string[];
  hierarchy: {
    country: string[];
    region: string[];
    city: string[];
    specificArea: string[];
  };
  matchedExperts?: Expert[];
}
```

# 8) Acceptance Criteria

- `src/test-mode/features/locationTagsFeature.js` exports locationTagsFeature with actions
- `src/test-mode/data/locationTestFixtures.json` contains 10+ diverse location scenarios
- `src/test-mode/registry.ts` includes locationTagsFeature in testFeatures array
- TestMod=1 interface shows "Location Tags Testing" feature
- Location tag generation and expert matching can be tested with fixtures

# 9) Testing Strategy

- Test location tag extraction with fixture data
- Test expert matching with location-diverse scenarios  
- Integration test with existing test mode interface
- Validate location hierarchy scoring with real expert data

# 10) Notes / Links

- Reference: Existing test mode patterns in src/test-mode/features/flowFeature.js
- Related: Must work with enhanced expert matcher from TASK-0001