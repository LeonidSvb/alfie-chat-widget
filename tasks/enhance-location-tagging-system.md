---
description: Enhance existing expert matching with hierarchical location tagging
globs: src/lib/expertMatcher.ts,src/lib/openai.ts,src/lib/airtable.ts
alwaysApply: false
---

id: "TASK-0001"
title: "Enhance location tagging in existing expert matcher"
status: "planned"
priority: "P1"
labels: ["location", "tagging", "expert-matching", "enhancement"]
dependencies: []
created: "2025-01-09"

# 1) High-Level Objective

Extend existing expert matching system with hierarchical location tagging without breaking current functionality or creating duplicate systems.

# 2) Background / Context

Current `src/lib/expertMatcher.ts` has basic location support but needs enhanced hierarchical location matching (specific-area > city > region > country) with weighted scoring system. Must work with existing Airtable integration and maintain backward compatibility.

# 3) Assumptions & Constraints

- ASSUMPTION: Current expertMatcher.ts and airtable.ts patterns work well
- Constraint: No new files - extend existing implementations only  
- Constraint: Maintain backward compatibility with current expert matching
- Constraint: Use existing OpenAI integration patterns from src/lib/openai.ts

# 4) Dependencies (Other Tasks or Artifacts)

- src/lib/expertMatcher.ts (existing - modify)
- src/lib/airtable.ts (existing - extend)
- src/lib/openai.ts (existing - enhance)

# 5) Context Plan

**Beginning (add to model context):**

- src/lib/expertMatcher.ts
- src/lib/airtable.ts  
- src/lib/openai.ts
- src/types/expert.ts _(read-only)_

**End state (must exist after completion):**

- src/lib/expertMatcher.ts (enhanced)
- src/lib/airtable.ts (with location fields)
- src/lib/openai.ts (with location prompts)

# 6) Low-Level Steps (Ordered, information-dense)

1. **Add location hierarchy constants to expertMatcher.ts**

   - File: `src/lib/expertMatcher.ts`
   - Add constants:
     ```ts
     const LOCATION_WEIGHTS = {
       'specific-area': 30,
       'city': 20,
       'town': 20,
       'subregion': 12,
       'region': 10,
       'country': 5
     } as const;
     
     const LOCATION_HIERARCHY = ['specific-area', 'city', 'town', 'subregion', 'region', 'country'] as const;
     ```

2. **Enhance generateTagsFromAnswers function**

   - File: `src/lib/expertMatcher.ts`
   - Extend existing function to extract location tags from questionnaire:
     ```ts
     // Add location extraction logic to existing generateTagsFromAnswers
     // Extract from homeBase, specificPlaces, regions fields
     ```

3. **Add location-aware scoring to matchExpertToTags**

   - File: `src/lib/expertMatcher.ts`  
   - Enhance existing function:
     ```ts
     export async function matchExpertToTags(
       tags: string[],
       flowType: 'inspire-me' | 'i-know-where' = 'inspire-me',
       options?: { locationWeight?: number }
     ): Promise<Expert | null>
     ```
   - Add location hierarchy scoring alongside existing tag matching

4. **Extend OpenAI prompts for location extraction**

   - File: `src/lib/openai.ts`
   - Add location-specific prompts:
     ```ts
     const LOCATION_TAG_PROMPT = `Extract location tags in this hierarchy: country, region, subregion, city, town, specific-area. Return kebab-case format.`;
     ```

5. **Enhance Airtable expert querying**

   - File: `src/lib/airtable.ts`
   - Extend existing `getExperts()` function to include location fields:
     ```ts
     // Add Country, Region, Sub-Region, City, Town, Specific Area to field selection
     ```

# 7) Types & Interfaces

```ts
// src/types/expert.ts (extend existing)
interface Expert {
  // ... existing fields
  country?: string;
  region?: string;
  subregion?: string; 
  city?: string;
  town?: string;
  specificArea?: string;
  locationTags?: string[];
}

type LocationHierarchy = 'specific-area' | 'city' | 'town' | 'subregion' | 'region' | 'country';
```

# 8) Acceptance Criteria

- `src/lib/expertMatcher.ts` includes location hierarchy scoring in existing matchExpertToTags()
- Location tags extracted from questionnaire responses in existing generateTagsFromAnswers()
- Backward compatibility: all existing expert matching continues to work
- No new files created - only existing files enhanced

# 9) Testing Strategy

- Test existing expert matching still works with sample questionnaire data
- Test location hierarchy scoring with mock location tags  
- Integration test with real Airtable data
- Test Mode: extend existing fixtures with location-diverse scenarios

# 10) Notes / Links

- Reference: Current expertMatcher.ts implementation patterns
- Related: Must integrate with existing Test Mode in src/test-mode/