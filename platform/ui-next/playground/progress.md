# StudyListNext Migration – Progress Log

This document tracks the phased replacement of the legacy WorkList with the new StudyListNext (ui‑next).

## Scope
- Keep ui‑next visuals and interaction model intact.
- Reuse DataSourceWrapper for data source selection, URL→query mapping, and the 101‑item rolling window.
- Achieve legacy‑compatible launch behavior and preserved query parameters.

---

## Phase 1 – Route + Mapping (Completed)

Changes
- Added new route component: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`.
- Gated swap in `platform/app/src/routes/index.tsx` via `appConfig.features.studyListNext`.
- Mapped server studies to ui‑next `StudyRow` fields, carrying `studyInstanceUid` for later phases.
- Implemented `toISOLikeDateTime(date, time)` to output a stable ISO‑like UTC string used by ui‑next sorter.

Behavior
- When `features.studyListNext` is true, `/` uses `StudyListNext` via `DataSourceWrapper`.
- Visuals remain from ui‑next (table + preview shell); workflows/launch/URL sync/thumbnails intentionally not wired yet.

Files
- New: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`
- Updated: `platform/app/src/routes/index.tsx`

---

## Phase 2 – Real Workflows + Launch (Completed)

Decisions Incorporated
- Workflows inferred from `appConfig.loadedModes` using legacy parity logic: preprocess modalities by converting `/` to `\`, normalize (trim/uppercase/dedupe), and call `mode.isValidMode({ modalities, study })`.
- Only enabled modes are shown; hidden/null (`valid === null`) are omitted, preserving ui‑next prototype UX.
- Use `displayName` for labels; filter to ui‑next’s `ALL_WORKFLOW_OPTIONS` set.

Implementation
- `normalizeModalities(s)` converts mixed separators to `\\`, trims, uppercases, and de‑duplicates.
- `withWorkflows(rows, appConfig)` computes per-row `workflows` by evaluating `isValidMode` and optionally groups enabled first via `appConfig.groupEnabledModesFirst`.
- `handleLaunch(row, workflow, appConfig, dataPath, currentSearch, navigate)`:
  - Finds the mode by `displayName`.
  - Builds query preserving: `configUrl`, `multimonitor`, `screenNumber`, `hangingProtocolId`.
  - Appends `StudyInstanceUIDs` and uses `dataPath`.
  - Navigates to `/${mode.routeName}${dataPath}?…`.

Behavior
- ui‑next menus show only available workflows (prototype parity).
- Launch path and preserved parameters match legacy WorkList.

Files
- Updated: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`

---

## Decisions & Mitigations (Locked‑In)
- isValidMode parity: reuse legacy calling pattern; preprocess modalities and pass the server study as `study`.
- Date parsing: emit ISO‑like UTC strings (`YYYY-MM-DD HH:mm:ssZ`) to ensure stable sorting in ui‑next.
- Route gating: `appConfig.features.studyListNext` controls rollout; default keeps legacy WorkList.
- Workflow uniqueness: label collisions handled by using `displayName` for UI and underlying mode object for evaluation.

---

## Upcoming Phases (Planned)

Phase 3 – Thumbnails (Preview Panel)
- Add optional `fetchSeriesThumbnails(row)` to headless context.
- In `PreviewPanelContent`, load thumbnails when provided; fallback to placeholders.
- In `StudyListNext`, implement thumbnail fetcher with caching and, if needed, auth blob URLs.

Phase 4 – URL Sync (Filters/Sort/Pagination)
- Add optional callbacks to ui‑next DataTable to observe state changes.
- Debounce in route and update URL using legacy keys so `DataSourceWrapper` re‑queries the correct 101‑item window.

Phase 5 – Route Swap
- Keep gate; option to flip default after validation.

---

## Quick Reference

Mapping (server → StudyRow)
- `patient ← patientName`
- `mrn ← mrn`
- `studyDateTime ← toISOLikeDateTime(date, time)`
- `modalities ← modalities`
- `description ← description`
- `accession ← accession`
- `instances ← instances`
- Extra (carried): `studyInstanceUid`

Launch Preservation
- Preserved: `configUrl`, `multimonitor`, `screenNumber`, `hangingProtocolId`
- Required: `StudyInstanceUIDs`
- Path: `/${mode.routeName}[/${dataSourceName}]` + query

---

## Status
- Phase 1: complete
- Phase 2: complete
- Phase 3: complete (metadata + caching; image rendering optional)
- Phase 4: complete
- Phase 5: complete
- Phase 6: complete (instance-level thumbnails with auth + Accept + fallback)
- Phase 7: complete (initial URL → table hydration)
 - Phase 8: complete (optional StudyRow type extension)
 - Phase 9: complete (stable selection IDs)
 - Phase 10: complete (real workflow labels passthrough)

---

## Phase 3 – Real Thumbnails in Preview (Completed)

Approach
- Added an optional `fetchSeriesThumbnails(row)` channel to the headless context, plumbed through `useStudyListState`.
- `PreviewPanelContent` consumes the fetcher when present; otherwise falls back to placeholders (backwards‑compatible for the playground).
- `StudyListNext` supplies a memoized fetcher that queries the active data source for series and maps to thumbnail rows; results are cached per study UID.

Changes
- Context: `platform/ui-next/src/components/StudyList/headless/StudyListProvider.tsx`
  - Added `fetchSeriesThumbnails?: (row) => Promise<any[]>` to `StudyListContextValue`.
- State: `platform/ui-next/src/components/StudyList/headless/useStudyList.ts`
  - Accepted `fetchSeriesThumbnails` option and returned it in state.
- Layout: `platform/ui-next/src/components/StudyList/layouts/StudyListLargeLayout.tsx`
  - Plumbed new `fetchSeriesThumbnails` prop down to `useStudyListState`.
- Facade: `platform/ui-next/src/components/StudyList/StudyList.tsx`
  - Extended props to accept `fetchSeriesThumbnails` and pass through.
- Preview: `platform/ui-next/src/components/StudyList/components/PreviewPanelContent.tsx`
  - If fetcher provided: loads real series list; otherwise uses placeholder rows.
  - Uses optional `imageSrc` when provided; otherwise muted tiles render.
- Route: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`
  - Implemented `fetchSeriesThumbnailsForRow` using `dataSource.query.series.search(studyUID)`.
  - Cache results by `studyInstanceUid` to avoid redundant queries during selection changes.

Notes
- Image rendering: current implementation maps real series metadata; `imageSrc` is left undefined unless a rendered endpoint is configured. The UI falls back to muted tiles. We can add WADO‑RS rendered JPEG fetch with auth headers and blob URLs later, with URL revocation on cache eviction.

---

## Phase 5 – Replace WorkList Route with StudyListNext (Completed)

Approach
- Swap the `/` route to render `StudyListNext` by default while retaining a kill‑switch via config.
- Keep `DataSourceWrapper` unchanged; it still initializes the data source, maps URL→query, and fetches studies.

Changes
- Routes: `platform/app/src/routes/index.tsx`
  - The route wrapper now defaults to `StudyListNext` unless `appConfig.features.studyListNext === false`.
  - This preserves a feature flag for rollback while making StudyListNext the default experience.

Notes
- Existing `showStudyList` gating remains: when `showStudyList` is false, the root list route is omitted entirely.
- No changes to mode routes or viewer flows.

---

## Phase 6 – Wire Thumbnails Fetcher (Image URLs + Caching) (Completed)

Approach
- Align with the viewer’s StudyBrowser: fetch instance‑level rendered JPEGs (or thumbnails) using DICOMweb retrieve.
- Load series + instances metadata via `dataSource.retrieve.series.metadata({ StudyInstanceUID })` and read from `DicomMetadataStore`.
- For each series, pick a representative instance (first) and build:
  - Primary: `/studies/{study}/series/{series}/instances/{sop}/rendered?accept=image/jpeg`
  - Fallback: `/thumbnail?accept=image/jpeg`
- Pass Authorization headers and `credentials: 'include'`. Convert fetched blobs to object URLs.
- LRU cache (~20 studies) and revoke URLs on eviction/unmount.

Changes
- Route: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`
  - Added helpers: `getWadoRoot`, `makeInstanceThumbUrl`, `getAuthHeaders`, `fetchObjectUrl` (Accept + credentials), `ensureCacheCapacity`.
  - `fetchSeriesThumbnailsForRow` now loads series+instances metadata (via retrieve) and fetches instance‑level images with fallback.
  - Prefers `dataSource.retrieve.getGetThumbnailSrc(instance, imageId)` when available (non‑wadors) to respect server config and auth.
  - Filters out non‑image modalities for preview fetches (SR/SEG/RT*, DOC, PMAP).
  - Added unmount cleanup to revoke any remaining object URLs.

Notes
- Errors during image fetch are swallowed per‑item; the UI continues to display metadata tiles.
- If your server requires cookie auth, `credentials: 'include'` is enabled; Authorization headers are also sent when present.

---

## Phase 9 – Stable Selection IDs (Completed)

Problem
- Selecting one row also highlighted other rows due to non‑unique `getRowId` (defaulted to accession which can duplicate).

Fix
- Prefer `studyInstanceUid` for row identity, falling back to accession or index.

Changes
- Layout: `platform/ui-next/src/components/StudyList/layouts/StudyListLargeLayout.tsx`
  - Default `getRowId = (row, index) => row.studyInstanceUid || row.accession || String(index)`.
- Route: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`
  - Explicitly passes the same `getRowId` to `StudyList` for consistency.

---

## Phase 10 – Real Workflow Labels Passthrough (Completed)

Problem
- Some valid modes (e.g., “TMTV Workflow”) were omitted because we filtered to ui‑next’s fixed workflow registry and re‑inferred in headless.

Fix
- Trust app‑provided workflows derived from `appConfig.loadedModes` and stop filtering to a fixed set.
- Headless `availableWorkflowsFor` now returns row‑supplied workflows when present; falls back to inference only when missing.

Changes
- Route: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`
  - Removed filtering to `ALL_WORKFLOW_OPTIONS`; propagate real `mode.displayName` labels.
- Headless: `platform/ui-next/src/components/StudyList/headless/useStudyList.ts`
  - Prefer `row.workflows` (when provided) over heuristic inference.

---

## Phase 7 – Initial URL → Table State Hydration (Completed)

Approach
- Hydrate initial sorting, filters, and pagination from URL to match legacy behavior.
- Avoid resetting pagination to page 0 on initial mount by skipping the first reset effect in `DataTable`.

Changes
- DataTable: `platform/ui-next/src/components/DataTable/DataTable.tsx`
  - Skip the first run of the “reset to page 0 on filters/sorting change” effect to honor `initialPagination`.
- StudyListTable: `platform/ui-next/src/components/StudyList/components/StudyListTable.tsx`
  - Accepts `initialFilters` and passes to `DataTable`.
- Layout and Facade:
  - `platform/ui-next/src/components/StudyList/layouts/StudyListLargeLayout.tsx`: accepts `initialSorting`, `initialFilters` and forwards to `StudyListTable`.
  - `platform/ui-next/src/components/StudyList/StudyList.tsx`: exposes `initialSorting`, `initialFilters`, `initialPagination`.
- Route: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`
  - Reads from URL and sets:
    - Sorting: `sortby` + `sortdirection` (maps `studyDate` → `studyDateTime`).
    - Filters: `patientname`, `mrn`, `description`, `modalities`, `accession`.
    - Pagination: `pagenumber`, `resultsperpage` (already implemented earlier).

Notes
- Date range (`startdate`/`enddate`) is not hydrated yet due to the current single-input column; to be added when a date-range cell is introduced.

---

## Phase 8 – Type & Data Model Adjustments (Completed)

Changes
- `platform/ui-next/src/components/StudyList/StudyListTypes.ts`
  - Added optional `studyInstanceUid?: string` to `StudyRow` so apps can carry the server UID without casting.

Notes
- This is backward-compatible and unused fields are ignored by ui-next components.
- We kept the `ThumbnailRow` type local to the preview; exporting it remains optional and can be done later if helpful.

---

## Phase 4 – URL Sync (Filters/Sort/Pagination) (Completed)

Approach
- Added optional callbacks to ui‑next `DataTable` to observe filters, sorting, and pagination changes, and an `initialPagination` prop to hydrate from URL.
- In `StudyListNext`, mapped table state to legacy query keys and debounced updates (200ms). Preserved critical keys via `preserveQueryParameters` and kept current `datasources`.

Changes
- DataTable: `platform/ui-next/src/components/DataTable/DataTable.tsx`
  - Props: `onFiltersChange?`, `onSortingStateChange?`, `onPaginationChange?`, `initialPagination?`.
  - State change effects notify parent; pagination initializes from `initialPagination` when provided.
- StudyListTable: `platform/ui-next/src/components/StudyList/components/StudyListTable.tsx`
  - Plumbed the new props to `DataTable`.
- StudyList (facade): `platform/ui-next/src/components/StudyList/StudyList.tsx`
  - Extended props and forwarded to `StudyListLargeLayout`.
- Layout: `platform/ui-next/src/components/StudyList/layouts/StudyListLargeLayout.tsx`
  - Plumbed URL sync props to `StudyListTable`.
- Route: `platform/app/src/routes/StudyListNext/StudyListNext.tsx`
  - Implemented debounced URL writer with mappings:
    - Filters → `patientname`, `mrn`, `description`, `modalities`, `accession` (date filter skipped until a range input exists).
    - Sorting → `sortby`, `sortdirection`.
    - Pagination → `pagenumber` (1‑based), `resultsperpage`.
  - Hydrates `initialPagination` from URL to keep UI and backend in sync.

Notes
- Skips `studyDateTime` mapping until a date‑range input is available; server query still benefits from pagination/other filters.
- Debounce is 200ms to mirror legacy WorkList behavior and prevent excessive navigations.
