# StudyListNext2 — How it composes @ohif/ui-next

This note documents how `StudyListNext2` uses the Design System (ui‑next) versus what it implements locally. Summary: it composes the headless state and building blocks from `@ohif/ui-next` and only adds app‑specific logic (data mapping, workflow launch, real series/thumbnail preview, and URL hydration). It does not create a parallel study list.

## Where things live

- Route entry (URL rehydration before data source): `platform/app/src/routes/StudyListNext2/StudyListNext2Entry.tsx:1`
- Main composition: `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:1`
- Default route wiring (uses `StudyListNext2Entry`): `platform/app/src/routes/index.tsx:120`

## What’s imported from @ohif/ui-next

- Headless/state: `useStudyListState`, `StudyListProvider`  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:246`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:277`
- Layout/split panes: `StudyListLayout` (+ `OpenPreviewButton`)  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:278`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:365`
- Table + defaults: `StudyListTable`, `defaultColumns`  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:288`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:256`
- Preview shell/empty: `PreviewPanelShell`, `PreviewPanelEmpty`  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:498`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:610`
- Patient summary: `PatientSummary`  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:556`
- Series views and media: `SeriesListView`, `Thumbnail`  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:604`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:586`
- Controls and utilities: `SettingsPopover`, `ToggleGroup`, `ToggleGroupItem`, `TooltipProvider`, `Button`, `Icons`  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:325`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:567`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:555`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:327`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:298`

## App‑specific logic (what StudyListNext2 owns)

### 1) Data shaping + sorting

- Maps backend rows to `UISLRow` with a display value and a numeric sort key for date/time:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:96` (row mapping), `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:256` (override defaultColumns to sort by timestamp)
- Adds `workflows` per row from installed/valid modes so the menu reflects only available workflows.

### 2) Workflow resolution and launch

- Maps workflow labels to route names, validates with `loadedModes`, and falls back to viewer/basic; preserves query parameters; navigates:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:174`
- Provides friendly warnings when a study lacks `StudyInstanceUID` or a matching mode cannot be found.

### 3) Real preview content (series + thumbnails)

- Queries series for the selected study, sorts by series date if available:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:380`
- Skips non‑image modalities for thumbnail attempts (e.g., RT):  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:418`
- Ensures instances/`imageId` are present by calling `dataSource.retrieve.series.metadata(...)`:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:410`
- Derives a representative `imageId` and requests a thumbnail via the data source helper; if configured for `wadors`, uses Cornerstone to render to a canvas and convert to a data URL:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:431`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:472`
- Supports toggling preview between thumbnails and list view with `ToggleGroup`:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:567`

### 4) Settings menu (About/Preferences) via `SettingsPopover`

- Uses the ui‑next compound `SettingsPopover` pattern with `Trigger`/`Content`/`Workflow`/`Divider`/`Link`:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:325`
- Invokes About and User Preferences modals using `useModal` + `customizationService`:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:337`, `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:526`
- Also renders a `ClosedPanelControls` variant that shows the same settings next to the reopen button:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2.tsx:316`

### 5) URL hydration before data source mounts

- `StudyListNext2Entry` restores `configUrl` into the URL (from `sessionStorage` or `localStorage`) before mounting `DataSourceWrapper`, mirroring previous worklist behavior:  
  `platform/app/src/routes/StudyListNext2/StudyListNext2Entry.tsx:13`

## How this differs from the previous StudyListNext

- Same overall composition with ui‑next primitives; `StudyListNext` also showed `Onboarding` and `InvestigationalUseDialog` at the route root, which `StudyListNext2` currently omits.  
  Add them near the root container if you want parity.
- `StudyListNext2` changes date display to `DD‑MMM‑YYYY HH:mm` and introduces an explicit numeric sort key for accurate sorting of the Study Date column.

## Optional improvements (non‑blocking)

- Types: `useStudyListState` returns `seriesViewMode`/`setSeriesViewMode`, which are used by `StudyListNext2`. If you want stricter TS types in the context, extend `StudyListContextValue` upstream to include these keys.
- Workflow inference: The current approach computes `row.workflows` from installed modes, ensuring the menu only lists valid, installed options. Alternatively, you can rely on ui‑next’s `WorkflowsInfer` heuristics, but the current tighter coupling to installed modes is sensible.
- Feature parity: Add `Onboarding` and `InvestigationalUseDialog` if desired (see `platform/app/src/routes/StudyListNext/StudyListNext.tsx:640`).

## Bottom line

StudyListNext2 is a composition of `@ohif/ui-next` headless state and building blocks. It uses ui‑next for the provider, layout, table, preview scaffolding, and controls; it implements app‑specific data shaping, workflow launch mapping, real series/thumbnail fetching, and URL hydration.

