# Operator architecture

## Decision

Operator is a standalone next-generation product, not a fork of the existing
Solution Enablement CRR application. It owns its user experience and release
path while reusing compatible Workiva platform services and CRR contracts.

The existing imperative engine is a temporary behavioral reference. New product
logic must not be added to it. Each migrated workflow moves through typed domain
and application boundaries before the legacy implementation is removed.

## Target layers

```text
src/
  domain/          Business types and deterministic rules
  application/     Use cases and service-port interfaces
  infrastructure/  Mock, tRPC, and Workiva platform adapters
  screens/         Route-level React surfaces
  components/      Reusable presentation components
  engine/legacy.ts Temporary adapter for unmigrated workflows
```

Dependencies point inward:

1. `domain` imports nothing from React, the DOM, or infrastructure.
2. `application` depends on domain types and declares required service ports.
3. `infrastructure` implements those ports using mocks, tRPC, or generated
   Workiva clients.
4. React screens call application use cases. They do not call platform clients
   or mutate global state directly.
5. The legacy engine may call application use cases during migration, but new
   modules never import the legacy engine.

## Workiva alignment

Operator follows the established Solution Enablement patterns where they create
durable boundaries:

- TanStack Query owns asynchronous server state.
- Internal product APIs use versioned, Zod-validated tRPC contracts.
- Generated clients are used for Workiva platform REST services.
- Tenant and user context enter through an authentication adapter.
- Procedures stay thin; business behavior lives in application/domain services.
- Stable error codes cross service boundaries.
- Mock and live adapters implement the same ports.

The existing CRR services are integration candidates, not compile-time
dependencies of the domain layer:

- reports and filing instances
- obligation recommendations
- regulatory work items
- connected processes and user tasks
- source data and form mapping
- agent and LLM services
- activity and audit events

## Backend handoff seam

`src/application/ports/ReportRepository.ts` is the persistence contract for the
first migrated workflow. The prototype implementation,
`src/infrastructure/reports/InMemoryReportRepository.ts`, owns writes to the
existing fixture state.

`src/application/ports/WorkflowRepository.ts` is the canonical lifecycle
contract shared by the Operator conversation and manual report workspace. It
owns the current project stage, optimistic version, and attributable transition
events. `src/infrastructure/workflow/InMemoryWorkflowRepository.ts` is the
prototype adapter; replacing it must not require either presentation surface to
change its stage model.

A backend team can replace that adapter with tRPC or another API without
changing report-domain rules or React:

1. Decide whether an existing CRR service or a new datastore owns reports.
2. Define a versioned server contract with stable IDs and error codes.
3. Implement `ReportRepository` and `WorkflowRepository` against that contract.
4. Inject the live adapter at the application root.
5. Use TanStack Query to cache `list` and invalidate after commands.

The frontend intentionally does not prescribe a database. Storage, tenancy,
authorization, audit retention, and transaction boundaries belong to the
service implementation and must be decided with the backend owners.

## Migration rules

Every vertical slice must:

1. Preserve current behavior with characterization tests.
2. Extract one source of truth; never duplicate legacy and React state.
3. Move deterministic rules into `domain`.
4. Put orchestration in `application`.
5. Keep platform access behind an interface with mock and live adapters.
6. Replace the complete user path before deleting its legacy handlers.
7. Pass `pnpm check`.

## Retirement sequence

1. Report creation and report-type fixtures
2. Report/session read model and notifications
3. Navigation and route state
4. Low-risk satellite screens
5. Portfolio and project workspace
6. Operator conversation context
7. Report lifecycle stages
8. Remove `window` bridges, `shell.html`, and `legacy.ts`

The repository is ready for engineering handoff when no product behavior depends
on global `window` handlers, imperative `innerHTML` rendering, or module-scoped
mutable fixtures.
