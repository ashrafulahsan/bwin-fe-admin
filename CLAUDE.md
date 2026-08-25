# Project Overview

BWIN Consultants — CMS + LMS Platform.

- Frontend: Next.js (App Router), JavaScript (no TypeScript), Tailwind CSS
- Backend: FastAPI (consumed over HTTP by `src/services` and module-level `services/`)
- State: Zustand (client state) + TanStack Query (server state)
- Forms: React Hook Form + Zod
- Auth: JWT + refresh token, RBAC (Super Admin, Admin, Instructor)

This file is the standing development guide. All future code generation in this
repo must follow it.

## Folder Structure

```
src/
├── app/                  # routing only — no business logic
│   ├── (auth)/           # login, forgot-password, etc.
│   └── (dashboard)/      # authenticated app shell
│
├── modules/              # business features, one folder per domain
│   ├── auth/
│   ├── dashboard/
│   ├── user-management/
│   ├── cms/
│   ├── lms/
│   ├── business/
│   ├── notifications/
│   ├── support-tickets/
│   ├── reports/
│   ├── settings/
│   └── activity-logs/
│
├── components/           # reusable, feature-agnostic UI
│   ├── ui/                  base primitives (Button, Input, Card, ...)
│   ├── common/               generic composites (EmptyState, PageHeader, ...)
│   ├── forms/                shared form building blocks
│   ├── tables/                data table building blocks
│   ├── modals/                dialog/modal building blocks
│   └── charts/                chart building blocks
│
├── layouts/              # app shell (DashboardLayout, Header, Sidebar, Footer)
├── services/             # shared API client(s); module services build on these
├── store/                # Zustand stores (authStore, appStore, settingsStore)
├── hooks/                # shared hooks (not tied to one module)
├── lib/                  # framework/library glue code
├── config/               # app configuration (routes, permissions, sidebar)
├── context/              # React context providers not covered by providers/
├── providers/            # app-wide providers (QueryProvider, AuthProvider)
├── utils/                # pure helper functions
├── styles/               # global/shared styling assets beyond globals.css
└── constants/            # global constants
```

## Folder Structure Rules

- `app/` = routing only. Pages/layouts compose module components; they do not
  contain fetching logic, validation, or business rules.
- `modules/` = business features. Each domain's UI, data access, and rules
  live in its own module.
- `components/` = reusable UI with no knowledge of a specific module.
- `services/` = all API communication (module services build on
  `services/apiClient.js`).
- `store/` = Zustand client state.
- `config/` = application configuration (routes, permissions, sidebar, etc.),
  not feature logic.

## Module Convention

Every module in `src/modules/<name>/` must contain exactly these subfolders:

```
api/           # raw endpoint definitions / request functions
components/    # module-scoped UI
hooks/         # module-scoped hooks (often wrapping TanStack Query)
services/      # orchestration on top of api/, used by hooks/components
validation/    # Zod schemas for this module's forms/data
constants/     # module-scoped constants
```

Do not add ad-hoc folders inside a module outside this list. If a module
needs a new kind of file, prefer fitting it into one of the six subfolders.

## Naming Conventions

| Type       | Convention              | Example                    |
|------------|--------------------------|-----------------------------|
| Components | PascalCase               | `UserTable.jsx`            |
| Hooks      | camelCase, `use` prefix  | `useSomething.js`          |
| Stores     | camelCase + `Store`      | `authStore.js`             |
| Services   | camelCase + `Service`    | `userService.js`           |
| Constants  | UPPER_CASE (values)      | `MAX_UPLOAD_SIZE`           |
| Routes     | kebab-case               | `/user-management`         |

## Development Rules

1. Keep business logic inside `modules/`.
2. Do not place business logic in `app/` routes — routes compose and render.
3. Use reusable UI components from `src/components/` instead of duplicating markup.
4. Follow feature-based architecture: new features get a new module.
5. Follow DRY — extract shared logic instead of copy-pasting.
6. Use absolute imports with `@/` (mapped to `src/`), not relative `../../..` chains.
7. Prefer composition over duplication.
8. Use TanStack Query for all server state (fetching, caching, mutations).
9. Use Zustand for client state only (UI state, session state, preferences).
10. All API calls must go through `services/` (shared `apiClient` or a module's
    `services/`) — never call `fetch`/`axios` directly from components.
11. Every module must be isolated — a module should not import another
    module's internals directly; share through `components/`, `hooks/`,
    `lib/`, or `services/` instead.
12. The sidebar must be configuration-driven via `config/sidebar.js`, not
    hardcoded markup in `Sidebar.jsx`.
13. Permission checks must be driven by permissions returned from the backend
    (`config/permissions.js` defines the shape, not the source of truth).
14. Follow RBAC architecture for all access control decisions.
15. Future code generation must follow this structure — do not introduce
    parallel conventions.

## Role Architecture

- **Super Admin** — full access to every module, including Settings and
  Activity Logs.
- **Admin** — operational access (CMS, LMS, User Management, Business,
  Notifications, Support Tickets, Reports); no Settings or Activity Logs.
- **Instructor** — course management access (LMS, Dashboard, Notifications).

Role identifiers live in `src/config/permissions.js` (`ROLES`). Actual
authorization must always be validated against the backend response, not
inferred purely on the client.

## Future Instructions

When adding new features:

- Follow the existing module structure (`api/ components/ hooks/ services/
  validation/ constants/`).
- Do not create random top-level folders under `src/`.
- Do not break the conventions in this file.
- If the architecture itself changes, update this CLAUDE.md in the same
  change so it stays the source of truth.
