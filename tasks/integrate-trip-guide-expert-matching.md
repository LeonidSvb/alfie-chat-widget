---
description: Integrate enhanced expert matching with trip guide generation flows
globs: src/lib/tripGuideGenerator.ts,src/components/TripGuide/*.tsx,src/app/api/generate-trip-guide/route.ts
alwaysApply: false
---

id: "TASK-0002"
title: "Integrate expert matching with trip guide flows"
status: "planned"
priority: "P1"
labels: ["trip-guide", "expert-matching", "integration", "ui"]
dependencies: ["tasks/enhance-location-tagging-system.md"]
created: "2025-01-09"

# 1) High-Level Objective

Integrate enhanced location-aware expert matching with existing trip guide generation flows (InspireMe and IKnowWhere) to show expert cards under each trip idea.

# 2) Background / Context

Current trip guide generation creates ideas but doesn't show matched experts. Need to add expert matching after trip guide generation and display expert cards under each accordion idea, following existing component patterns.

# 3) Assumptions & Constraints

- ASSUMPTION: Enhanced expert matcher from TASK-0001 works with location tags
- Constraint: Use existing TripGuide components in src/components/TripGuide/
- Constraint: Maintain existing trip guide generation API response structure
- Constraint: No blocking UI - show skeletons while experts load

# 4) Dependencies (Other Tasks or Artifacts)

- tasks/enhance-location-tagging-system.md
- src/lib/tripGuideGenerator.ts (existing - modify)
- src/components/TripGuide/ (existing components)

# 5) Context Plan

**Beginning (add to model context):**

- src/lib/tripGuideGenerator.ts
- src/components/TripGuide/EmailGatedTripGuide.tsx
- src/components/TripGuide/TripGuideDisplay.tsx
- src/components/Expert/ExpertCard.tsx _(read-only)_
- src/app/api/generate-trip-guide/route.ts _(read-only)_

**End state (must exist after completion):**

- src/lib/tripGuideGenerator.ts (enhanced with expert matching)
- src/components/TripGuide/TripGuideDisplay.tsx (with expert cards)
- src/app/api/generate-trip-guide/route.ts (enhanced response)

# 6) Low-Level Steps (Ordered, information-dense)

1. **Enhance trip guide generation with expert matching**

   - File: `src/lib/tripGuideGenerator.ts`
   - Extend existing `generateTripGuide` function:
     ```ts
     export async function generateTripGuide(
       answers: QuestionnaireData,
       flowType: 'inspire-me' | 'i-know-where' = 'inspire-me'
     ): Promise<{
       guide: TripGuide;
       experts: Array<{ ideaIndex: number; expert: Expert | null; matchedTags: string[] }>;
     }>
     ```
   - Details:
     - After generating trip guide content, extract location tags from each idea
     - Call enhanced matchExpertToTags for each idea's location tags
     - Return original guide plus matched experts array

2. **Update API route response structure**

   - File: `src/app/api/generate-trip-guide/route.ts`
   - Enhance existing POST handler:
     ```ts
     // Add experts array to existing response structure
     return NextResponse.json({
       success: true,
       guide: tripGuide,
       experts: matchedExperts, // new field
       matchingMeta: { /* debug info */ }
     });
     ```

3. **Add expert cards to trip guide display**

   - File: `src/components/TripGuide/TripGuideDisplay.tsx`
   - Extend existing component props:
     ```ts
     interface TripGuideDisplayProps {
       guide: TripGuide;
       experts?: Array<{ ideaIndex: number; expert: Expert | null; matchedTags: string[] }>;
       isLoading?: boolean;
     }
     ```
   - Details:
     - Add ExpertCard under each idea accordion
     - Show skeleton while experts loading
     - Display matched tags on expert cards

4. **Update EmailGatedTripGuide integration**

   - File: `src/components/TripGuide/EmailGatedTripGuide.tsx`
   - Modify existing expert matching logic:
     ```ts
     // Replace existing expert matching with new integrated approach
     // Handle experts from trip guide API response
     ```
   - Details:
     - Remove duplicate expert matching calls
     - Use experts from trip guide API response
     - Maintain existing loading states

# 7) Types & Interfaces

```ts
// src/types/tripGuide.ts (extend existing)
interface TripGuideWithExperts extends TripGuide {
  experts?: Array<{
    ideaIndex: number;
    expert: Expert | null;
    matchedTags: string[];
    matchScore?: number;
  }>;
}

interface TripGuideApiResponse {
  success: boolean;
  guide: TripGuide;
  experts?: Array<{ ideaIndex: number; expert: Expert | null; matchedTags: string[] }>;
  matchingMeta?: {
    totalExperts: number;
    fallbackLevels: string[];
  };
}
```

# 8) Acceptance Criteria

- `src/lib/tripGuideGenerator.ts` returns experts array alongside trip guide
- `src/app/api/generate-trip-guide/route.ts` includes experts in JSON response
- `src/components/TripGuide/TripGuideDisplay.tsx` shows expert cards under idea accordions
- InspireMe flow: 3 ideas → 3 expert cards, IKnowWhere: 1 idea → 1 expert card
- Skeleton loading states while experts are being matched

# 9) Testing Strategy

- Integration test with real questionnaire data and trip guide generation
- Test expert matching for both InspireMe and IKnowWhere flows
- UI test that expert cards appear under correct idea accordions
- Test loading states and error handling when no experts found

# 10) Notes / Links

- Reference: Existing expert matching patterns in src/components/Expert/
- Related: Must work with Test Mode fixtures from src/test-mode/