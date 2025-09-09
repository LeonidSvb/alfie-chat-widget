---
description: {{TASK_DESCRIPTION}}
globs: {{GLOBS_PATTERN}}
alwaysApply: false
---

# INSTRUCTIONS — READ THIS FIRST WHEN CREATING NEW TASKS

This file is a single, self-contained TASK for an AI agent. **One task = one file.**
Follow the steps below when creating new tasks.

1. **Name your file**: place under `./tasks/` and use kebab-case, e.g., `tasks/add-bar-chart.md`.
2. **Fill the frontmatter** (above) completely. Keep `title`, `status`, and `owner` accurate.
3. **Use information-dense keywords** throughout (exact file paths, function signatures, type names, constants, CLI flags).
4. **Define types first** if adding new data structures. Reference those types by exact name in later steps.
5. **Order your steps** so later steps explicitly reference earlier artifacts by name (files, types, functions).
6. **Keep scope tight**: this task should be completable independently. If it's large, split into multiple task files and add them to `dependencies`.
7. **Acceptance criteria** must be testable and unambiguous. Include file paths for tests and example CLI/API usage.
8. **Context plan** must list the files to add to the model's context at the start (mark dep files read-only) and which files must exist at the end.
9. **Testing strategy** use primarily integration tests, calling real APIs. No useless unit tests that just test the properties of the class. No tests for front end.

---

id: "{{TASK_ID}}" # e.g., TASK-0123
title: "{{TASK_TITLE}}" # e.g., "Add quartile-colored bar chart"
status: "{{STATUS}}" # planned, in-progress, blocked, done
priority: "{{PRIORITY}}" # P0, P1, P2
labels: [{{LABEL_LIST}}] # free-form tags
dependencies: [{{DEPENDENCY_LIST}}] # list other task files that must be completed first
created: "{{YYYY-MM-DD}}"

# 1) High-Level Objective

{{HIGH_LEVEL_OBJECTIVE}}

# 2) Background / Context (Optional but recommended)

{{BACKGROUND_CONTEXT}}

# 3) Assumptions & Constraints

- ASSUMPTION: {{ASSUMPTION_1}}
- Constraint: {{CONSTRAINT_1}}
- Constraint: {{CONSTRAINT_2}}

# 4) Dependencies (Other Tasks or Artifacts)

- {{DEPENDENCY_TASK_1}}
- {{DEPENDENCY_FILE_1}}

# 5) Context Plan

**Beginning (add to model context):**

- {{CONTEXT_FILE_1}}
- {{CONTEXT_FILE_2}}
- {{READONLY_FILE_1}} _(read-only)_
- {{READONLY_FILE_2}} _(read-only)_

**End state (must exist after completion):**

- {{OUTPUT_FILE_1}}
- {{OUTPUT_FILE_2}}
- {{TEST_FILE_1}}

# 6) Low-Level Steps (Ordered, information-dense)

> Write concrete, atomic steps. Include **file paths, exact names, signatures, params with defaults, return types**.

1. **{{STEP_1_TITLE}}**

   - File: `{{STEP_1_FILE_PATH}}`
   - Exported API:
     ```ts
     export type {{TYPE_NAME}} = {{TYPE_DEFINITION}};
     export function {{FUNCTION_NAME}}(
       {{PARAM_1}}: {{PARAM_1_TYPE}},
       {{PARAM_2}}?: { {{OPTION_1}}?: {{OPTION_1_TYPE}}; {{OPTION_2}}?: {{OPTION_2_TYPE}} }
     ): Promise<{{RETURN_TYPE}}>;
     ```
   - Details:
     - {{IMPLEMENTATION_DETAIL_1}}
     - {{IMPLEMENTATION_DETAIL_2}}
     - {{IMPLEMENTATION_DETAIL_3}}

2. **{{STEP_2_TITLE}}**

   - File: `{{STEP_2_FILE_PATH}}`
   - Add: `export * from "{{STEP_2_EXPORT}}";`

3. **{{STEP_3_TITLE}}**

   - File: `{{STEP_3_FILE_PATH}}`
   - Add flag `{{CLI_FLAG}}`, and when selected, call:
     ```ts
     await {{FUNCTION_CALL}}({{PARAM_USAGE}}, {
       {{OPTION_1}}: {{OPTION_1_VALUE}},
       {{OPTION_2}}: {{OPTION_2_VALUE}},
     });
     ```
   - Update help text accordingly.

4. **{{STEP_4_TITLE}}**
   - File: `{{TEST_FILE_PATH}}` ({{TEST_FRAMEWORK}})
   - Cases:
     - {{TEST_CASE_1}}
     - {{TEST_CASE_2}}
     - {{TEST_CASE_3}}

# 7) Types & Interfaces (if applicable)

> Define or reference types here so the model has a stable contract.

```ts
// {{TYPES_FILE_PATH}}
export interface {{INTERFACE_NAME}} {
  {{PROPERTY_1}}: {{PROPERTY_1_TYPE}};
  {{PROPERTY_2}}: {{PROPERTY_2_TYPE}};
}
export type {{TYPE_ALIAS}} = {{TYPE_DEFINITION}};
```

# 8) Acceptance Criteria

- `{{CRITERIA_FILE_1}}` exports `{{CRITERIA_FUNCTION_1}}(...)` with the exact signature above.
- Running `{{CLI_COMMAND}}` writes a {{OUTPUT_TYPE}} file.
- All tests in `{{TEST_PATH}}` pass locally.

# 9) Testing Strategy

- {{TESTING_APPROACH_1}}
- {{TESTING_APPROACH_2}}
- {{TESTING_APPROACH_3}}

# 10) Notes / Links

- Reference spec section: {{SPEC_LINK}}
- Related tasks: {{RELATED_TASKS}}

---

## Example with Realistic Mock Data

id: "TASK-0089"
title: "Add user authentication middleware"
status: "planned"
priority: "P1"
labels: ["security", "backend", "middleware"]
dependencies: ["tasks/setup-database.md"]
created: "2024-03-15"

# 1) High-Level Objective

Add JWT-based authentication middleware that protects API routes and validates user sessions.

# 2) Background / Context

Current API endpoints are unprotected, allowing unauthorized access to user data. Need secure authentication before v2.0 release.

# 3) Assumptions & Constraints

- ASSUMPTION: JWT tokens will be stored in HTTP-only cookies for security
- Constraint: Use existing bcrypt library for password hashing
- Constraint: Must work with existing Express.js setup

# 4) Dependencies (Other Tasks or Artifacts)

- tasks/setup-database.md
- src/models/User.ts (must exist)

# 5) Context Plan

**Beginning (add to model context):**

- src/app.ts
- src/models/User.ts
- package.json _(read-only)_
- .env.example _(read-only)_

**End state (must exist after completion):**

- src/middleware/auth.ts
- src/routes/auth.ts
- tests/middleware/auth.test.ts

# 6) Low-Level Steps

1. **Create authentication middleware**

   - File: `src/middleware/auth.ts`
   - Exported API:
     ```ts
     export interface AuthRequest extends Request {
       user?: { id: string; email: string; role: string };
     }
     export function requireAuth(
       req: AuthRequest,
       res: Response,
       next: NextFunction
     ): Promise<void>;
     ```
   - Details:
     - Verify JWT token from cookies
     - Attach user data to request object
     - Return 401 for invalid/missing tokens

2. **Create auth routes**

   - File: `src/routes/auth.ts`
   - Add: `export * from "./auth";`

3. **Apply middleware to protected routes**

   - File: `src/app.ts`
   - Add middleware: `app.use('/api/protected', requireAuth)`

4. **Integration tests**
   - File: `tests/middleware/auth.test.ts` (Jest)
   - Cases:
     - Valid JWT allows access to protected routes
     - Invalid JWT returns 401 status
     - Missing token returns 401 status

# 8) Acceptance Criteria

- `src/middleware/auth.ts` exports `requireAuth(...)` middleware function
- Running `npm test -- auth.test.ts` passes all authentication tests
- Protected routes return 401 without valid JWT token

# 9) Testing Strategy

- Integration tests with real JWT tokens and database queries
- Test token expiration and refresh scenarios
- Validate middleware integration with existing routes