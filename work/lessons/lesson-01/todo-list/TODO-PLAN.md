## TODO Terminal App — Implementation Plan (MVC)

This plan turns the design in `todo_design.md` into actionable phases with milestones, file structure, step-by-step tasks, and identified risks. Each phase has a definition of done (DoD) and suggested tests.

### Guiding Principles
- **Separation of concerns**: Model ↔ Controller ↔ View via events.
- **Incremental vertical slices**: Deliver thin, testable end-to-end paths early.
- **Deterministic behavior**: Command pattern for undo/redo; pure services where possible.
- **Performance-first UI**: Debounced/event-coalesced renders; windowed lists.

---

## Phases & Milestones

### Phase 0 — Project Bootstrap
Milestones:
- Tooling and scripts ready to run, test, lint, and package a CLI.

Tasks:
- Add Node.js 18+ engines, TypeScript 5, eslint/prettier.
- Add dependencies: `blessed`, `kleur`, `uuid`, `ajv`, `zod` (optional), `tsup` or `esbuild`, `vitest`. Defer `better-sqlite3` to later.
- Configure `tsconfig.json` for commonjs/esm as needed; set strict mode.
- Add `bin` entry to `package.json` (CLI name `todo`).
- Add npm scripts: `dev`, `build`, `start`, `test`, `lint`, `typecheck`.

DoD:
- `npm run dev` starts a minimal CLI that prints version and exits.

Tests:
- CI script runs `lint`, `typecheck`, `test` successfully.

---

### Phase 1 — Core Domain Model
Milestones:
- Entities, types, and result helpers implemented with unit tests.

Tasks:
- Create `src/model/entities.ts` with `Task`, `Project`, `Tag`, `ViewState`, enums/aliases.
- Create `src/core/Result.ts` helpers (Result/Either style) and `src/core/types.ts`.
- Implement simple ID utilities (uuid v4 wrapper).

DoD:
- Types compile; unit tests validate entity invariants (e.g., priority bounds).

Tests:
- Schema/type validation round-trips and guards for `Status`, `Priority`.

---

### Phase 2 — Repositories and In-Memory Store
Milestones:
- Repository interfaces and an in-memory implementation with indexes.

Tasks:
- Define interfaces in `src/model/repository.ts` for `TaskRepository`, `Storage` (per design appendix).
- Implement `src/model/services/IndexStore.ts` for derived indexes by `projectId`, `status`, `tag`.
- Provide an in-memory repository backed by `IndexStore` for fast queries.

DoD:
- Can add/update/remove tasks/projects/tags in memory; queries by filters are O(1)/O(log n) where feasible.

Tests:
- Unit tests for add/update/remove; index integrity after operations.

---

### Phase 3 — JSON Storage Adapter (Default)
Milestones:
- Load/save to `~/.todo/data.json` atomically with schema validation and migrations.

Tasks:
- Implement `src/model/storage/json.adapter.ts` with atomic write via temp file + rename; simple lock file.
- Define JSON schema; wire `ajv` validation and migration step when `version` mismatches.
- Implement file watcher; publish `storage:changed` event when external edits occur.

DoD:
- Cold load creates defaults on first run; subsequent runs load existing data; writes are atomic.

Tests:
- Integration: temp directory, simulated concurrent writes, schema invalid file -> graceful error.

---

### Phase 4 — Event Bus and Command Pattern (Undo/Redo)
Milestones:
- Central event bus, command registry, undo/redo stacks with transaction grouping.

Tasks:
- Create `src/core/EventBus.ts` (typed pub/sub, once, wildcard, error handling).
- Implement `src/controller/UndoRedo.ts` with command stack, inverse ops, configurable limit.
- Define command interfaces per design; basic commands: `CreateTask`, `UpdateTask`, `ToggleComplete`, `MoveTask`.

DoD:
- `do()` mutates repository + emits diffs; `undo()` restores prior state; history capped.

Tests:
- Unit: Each command’s do/undo symmetry; history boundaries; transaction coalescing.

---

### Phase 5 — Controllers: Keybindings, Command Router, Panels Controller
Milestones:
- Keyboard to command routing; basic `:add`, `:filter` parsing; panel focus/selection state.

Tasks:
- `src/controller/Keybindings.ts`: default map, load overrides from config.
- `src/controller/CommandRouter.ts`: parse `:` commands with completion/help.
- `src/controller/PanelsController.ts`: maintain `ViewState`, orchestrate refreshes.

DoD:
- Typing `:add "Test"` updates model and emits render diffs; `Tab` cycles focus.

Tests:
- Unit: parser cases; integration: key -> command -> event flow.

---

### Phase 6 — View Shell (blessed)
Milestones:
- Screen initialization, theme, base layout grid with panel placeholders.

Tasks:
- `src/view/ui.ts`: screen, theme, resize handling, debounced re-render.
- `src/view/panels/*` placeholders for Sidebar, TaskList, Detail, Inspector, Log.
- Minimal rendering of static content and focus rings.

DoD:
- App launches with default layout; panels can be focused via keys; no crashes on resize.

Tests:
- Smoke: screen init/dispose; focus traversal; snapshot minimal render.

---

### Phase 7 — Panel Interactivity & Layout
Milestones:
- Resizable splitters, independent scroll, selection state in Sidebar/List.

Tasks:
- Implement reusable widgets in `src/view/widgets/` (list/table, tree, splitter, status bar).
- Add mouse support (optional): click-to-focus, drag dividers.
- Wire panel events to EventBus; PanelsController updates selection.

DoD:
- Sidebar/List scroll independently; resizing updates layout and persists in `ViewState`.

Tests:
- Interaction tests for focus/scroll; snapshot after resize; event emissions.

---

### Phase 8 — Core Workflows (MVP)
Milestones:
- Add/Edit/Complete/Move tasks; filter/search; undo/redo for these actions.

Tasks:
- Implement `TaskService` and `SearchService` in `src/model/services/`.
- Detail panel edit mode with `Ctrl+Enter` save; list row actions (`x`, `a`, `e`, `m`).
- Inspector filters (status, tags, due, sort); live updates to TaskList.

DoD:
- All acceptance criteria actions work end-to-end with persistence.

Tests:
- Integration: scripted input sequences producing expected state and render diffs.

---

### Phase 9 — Persistence Polishing
Milestones:
- Autosave, debounce, conflict prompts on external file changes.

Tasks:
- Debounced save on mutations; manual `Ctrl+s`.
- Handle file watcher events; prompt reload; merge strategy for safe refresh.

DoD:
- No data loss on rapid edits; external edits show reload prompt and apply cleanly.

Tests:
- Simulate external write while app is open; verify prompt and reload behavior.

---

### Phase 10 — Plugin Surface (MVP)
Milestones:
- Minimal hooks exposed and documented; sample plugin invoked.

Tasks:
- `src/plugins/index.ts` with registration; hooks `onLoad`, `onCommand`, `onTaskCreated`.
- Load plugins from config; isolate failures; log errors.

DoD:
- Sample plugin runs and can add a custom command.

Tests:
- Plugin lifecycle unit tests; sandboxed error handling.

---

### Phase 11 — CLI Packaging & DX
Milestones:
- Single distributable; quick startup; helpful `--help`.

Tasks:
- Bundle with `tsup`/`esbuild`; set `bin` entry; add `--version`, `--help`.
- Optional: Prebuild native deps if using sqlite later.

DoD:
- `npm i -g` installs `todo`; `todo --help` works; cold start < 150ms target.

Tests:
- Manual and automated CLI tests; size and perf checks.

---

### Phase 12 — Test Coverage & QA
Milestones:
- Unit, integration, and UI smoke coverage per design.

Tasks:
- Expand vitest suites; snapshot list rendering; temp-dir integration tests.
- Add coverage thresholds; CI gates.

DoD:
- Coverage meets thresholds; happy/sad paths tested.

---

### Phase 13 — Performance Tuning
Milestones:
- Smooth renders; responsive under large datasets.

Tasks:
- Windowed list rendering; event coalescing; profiling hot paths.
- Optimize index updates; avoid redundant recomputation.

DoD:
- Interactions render < 16ms; no jank with 10k tasks.

---

### Phase 14 — Documentation
Milestones:
- Contributor docs, user guide, keymap reference, config schema.

Tasks:
- `README.md` quickstart; `docs/` for advanced topics; `--help` text.

DoD:
- New contributors can set up and ship a small feature in < 30 minutes.

---

## File/Directory Plan

```
src/
  app/
    App.ts               # bootstrap, DI container, compose modules
    config.ts            # load and validate ~/.todo/config.json
  model/
    entities.ts          # Task, Project, Tag, ViewState types
    repository.ts        # repository + storage interfaces
    services/
      TaskService.ts     # create/update/move/toggle; business rules
      SearchService.ts   # tokenization, query executor
      IndexStore.ts      # in-memory indexes for fast queries
    storage/
      json.adapter.ts    # JSON load/save + migrations + watcher
      sqlite.adapter.ts  # optional later
  controller/
    CommandRouter.ts     # parse and dispatch :commands
    Keybindings.ts       # keymap + handlers
    PanelsController.ts  # focus/selection orchestration
    UndoRedo.ts          # command stack + grouping
  view/
    ui.ts                # screen, theme, render loop, layout grid
    panels/
      SidebarPanel.ts    # projects/tags tree
      TaskListPanel.ts   # windowed list
      DetailPanel.ts     # preview/edit
      InspectorPanel.ts  # filters/sorts
      LogPanel.ts        # notifications
    widgets/             # reusable blessed components
  core/
    EventBus.ts          # typed pub/sub
    Result.ts            # helpers
    types.ts             # shared types/utilities
  plugins/
    index.ts             # plugin registrations + hooks
  cli/
    index.ts             # entrypoint (#!/usr/bin/env node)
test/                    # unit + integration + smoke
```

---

## Step-by-Step Build Strategy

1) Bootstrap CLI and configs (Phase 0).
2) Implement core types and Result (Phase 1).
3) Build in-memory repo + indexes (Phase 2).
4) Add JSON persistence and migrations (Phase 3).
5) Wire EventBus and Command pattern (Phase 4).
6) Implement controller skeletons (Phase 5).
7) Bring up blessed UI shell and layout (Phase 6).
8) Add panel interactivity and widgets (Phase 7).
9) Implement end-to-end workflows for MVP (Phase 8).
10) Polish persistence (autosave, watcher) (Phase 9).
11) Expose plugin hooks (Phase 10).
12) Package CLI, improve DX (Phase 11).
13) Expand tests, tune performance (Phases 12–13).
14) Document thoroughly (Phase 14).

Prefer delivering thin vertical slices: e.g., show a task in UI sourced from JSON as early as Phase 6–8, not after everything is “perfect.”

---

## Potential Challenges & Mitigations

- Keyboard routing conflicts and terminal differences:
  - Normalize keys; allow remapping; test across iTerm, macOS Terminal.
- Blessed layout performance under resize:
  - Debounce; minimize full reflows; profile render paths.
- Undo/redo granularity and transaction grouping:
  - Define grouping rules (e.g., edit session = one transaction); test symmetry.
- Atomic file writes and lock behavior:
  - Use write-to-temp + rename; lock file with timeouts; handle stale locks.
- External edits to data JSON:
  - File watcher with checksum; prompt reload; show diff in Log Panel.
- Index consistency after complex edits/moves:
  - Centralize mutations through services/commands; validate in tests.
- Search correctness and performance:
  - Start with simple token map; add fuzzy later; keep index incremental.
- Plugin isolation and failure safety:
  - Try/catch around plugin hooks; per-plugin timeouts; log errors.
- Optional SQLite complexity:
  - Defer to post-MVP; isolate via adapter interface.
- UI testing determinism:
  - Use snapshot tests of rendered strings; mock timers and EventBus.

---

## Acceptance Criteria per Phase (Abbrev.)

- P0: CLI prints help/version.
- P1: Types compile, unit tests pass.
- P2: In-memory repo with indexes and queries.
- P3: JSON load/save with migrations and schema validation.
- P4: Undo/redo works for create/update/toggle/move.
- P5: Keybindings + :command route to controller.
- P6: Layout renders; focus cycles; no crash on resize.
- P7: Resizable panels; independent scroll; selection tracking.
- P8: MVP workflows complete; persistence integrated.
- P9: Autosave + reload on external edits.
- P10: Sample plugin runs.
- P11: Packaged CLI; cold start target met.
- P12–13: Coverage thresholds and perf targets met.
- P14: Docs complete.

---

## Estimation (Rough)

- P0–P3: 2–3 days
- P4–P5: 2–3 days
- P6–P8: 4–6 days
- P9–P11: 2–3 days
- P12–P14: 2–3 days

Adjust based on team size and prior art.

---

## Next Actions

- Initialize Phase 0 tasks: add deps, scripts, and basic CLI in `src/cli/index.ts`.
- Create skeleton files per File/Directory Plan so subsequent phases have anchors.


