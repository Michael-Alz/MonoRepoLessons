# TODO Terminal App — Design Document

A multi‑panel terminal to‑do manager built with **blessed** + **TypeScript**, following an **MVC** architecture. This document defines goals, architecture, UI, data model, workflows, and technical requirements.

---

## 1. Goals & Non‑Goals

### 1.1 Goals
- Fast, keyboard‑first task management in the terminal.
- Clear **MVC boundaries** for testability and maintainability.
- **Multi‑panel UI** with independent focus/scroll, resizable layout.
- Offline‑first **local persistence** (JSON by default; SQLite optional).
- Robust **undo/redo**, **search/filter**, and **project/tag** organization.
- Extensible via **commands** and a small **plugin** hook surface.

### 1.2 Non‑Goals
- Cloud sync (can be future work).
- Mobile or GUI app.
- Advanced collaborative multi‑user features.

---

## 2. Architecture Overview (MVC)

```
+------------------------------+      +------------------------------+
|            Model             |<---->|        Storage Adapter       |
|  (domain, state, services)   |      | (JSON / SQLite / In-memory)  |
+------------------------------+      +------------------------------+
             ^    ^                                   ^
             |    |                                   |
             |    +-----------------+-----------------+
             |                      |
+------------+------------+   +-----+------------------+
|        Controller       |   |      Event Bus         |
| (actions, commands,     |   |  (pub/sub, undo/redo)  |
|  orchestration)         |   +------------------------+
+------------+------------+                 ^
             |                              |
             v                              |
+------------------------------+            |
|              View            |<-----------+
|  (blessed components + UI)   |
+------------------------------+
```

**Key principles**
- **Model** owns domain logic and persistence interfaces.
- **Controller** translates UI events → domain actions; enforces app rules.
- **View** is a thin layer of blessed widgets; no domain logic.
- **Event Bus** (pub/sub) decouples View updates and supports undo/redo.

---

## 3. Directory Structure

```
./
├─ src/
│  ├─ app/
│  │  ├─ App.ts (bootstrap, DI container)
│  │  └─ config.ts
│  ├─ model/
│  │  ├─ entities.ts (Task, Project, Tag)
│  │  ├─ repository.ts (interfaces)
│  │  ├─ services/
│  │  │  ├─ TaskService.ts
│  │  │  └─ SearchService.ts
│  │  └─ storage/
│  │     ├─ json.adapter.ts
│  │     └─ sqlite.adapter.ts (optional)
│  ├─ controller/
│  │  ├─ CommandRouter.ts
│  │  ├─ Keybindings.ts
│  │  ├─ PanelsController.ts
│  │  └─ UndoRedo.ts
│  ├─ view/
│  │  ├─ ui.ts (screen, theme)
│  │  ├─ panels/
│  │  │  ├─ SidebarPanel.ts (Projects/Tags)
│  │  │  ├─ TaskListPanel.ts
│  │  │  ├─ DetailPanel.ts
│  │  │  ├─ InspectorPanel.ts (filters)
│  │  │  └─ LogPanel.ts (notifications)
│  │  └─ widgets/ (reusable)
│  ├─ core/
│  │  ├─ EventBus.ts
│  │  ├─ Result.ts (Either/Result helpers)
│  │  └─ types.ts
│  ├─ plugins/
│  │  └─ index.ts (registrations)
│  └─ cli/
│     └─ index.ts (binary entry)
├─ test/ (unit + integration)
├─ package.json
├─ tsconfig.json
├─ .eslintrc.cjs
└─ README.md
```

---

## 4. UI Layout & Interaction

### 4.1 Panels (Default Layout)

```
┌───────────────────────────────────────────────────────────────┐
│ Command Bar (1 line): :help | :add | :edit | :move | :filter  │
├───────────────┬──────────────────────────────┬─────────────────┤
│ Sidebar       │ Task List                    │ Detail          │
│ (Projects/    │ (current view: inbox/search) │ (task preview)  │
│  Tags/Views)  │                              │                 │
│               │                              │                 │
├───────────────┴──────────────────────────────┴─────────────────┤
│ Inspector / Filters (status, due, tags, sort)  │  Log / Alerts  │
└────────────────────────────────────────────────┴────────────────┘
```

- **Command Bar**: single‑line prompt with history & completion.
- **Sidebar Panel**: hierarchical Projects, Saved Searches, Tags.
- **Task List Panel**: main list with columns (⏱ due, ★ priority, ✔ status).
- **Detail Panel**: read‑only preview; toggle to edit mode.
- **Inspector Panel**: live filters/sorts; shows active query chips.
- **Log Panel**: transient notifications (e.g., “Task moved”, errors).

### 4.2 Panel Behavior
- Each panel supports **focus**, **scroll**, **resize** (drag borders or keys).
- Panels emit events via EventBus; Controller updates model then publishes diffs.
- Layout presets: `1)` Default, `2)` Focused List (full‑width), `3)` Editor Mode.

### 4.3 Keyboard Shortcuts (default)
- Global: `?` help, `:` command palette, `Tab`/`Shift+Tab` cycle panels, `F6` rotate layout, `Ctrl+s` save.
- Sidebar: `j/k` move, `o` open, `a` add project, `r` rename, `Del` delete.
- Task List: `j/k` move, `x` toggle done, `a` add, `e` edit, `p` priority, `t` tag, `m` move, `/` search.
- Detail: `e` edit, `Esc` cancel, `Ctrl+Enter` save.
- Inspector: arrow keys to toggle chips; `r` reset filters.
- Undo/Redo: `u` / `Ctrl+r`.

> Keymaps are configurable in `~/.todo/config.json`.

### 4.4 Mouse (optional)
- Click to focus panel, drag dividers to resize, double‑click to open/edit.

---

## 5. Data Model

### 5.1 Entities (TypeScript interfaces)

```ts
export type ID = string; // uuid
export type Status = 'todo' | 'doing' | 'done' | 'archived';
export type Priority = 1 | 2 | 3 | 4 | 5; // 1 = highest

export interface Task {
  id: ID;
  title: string;
  notes?: string;
  status: Status;
  priority: Priority;
  projectId?: ID;
  tags: ID[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
  dueAt?: string;    // ISO
  completedAt?: string; // ISO
}

export interface Project { id: ID; name: string; order: number; parentId?: ID }
export interface Tag { id: ID; name: string; color?: string }

export interface ViewState {
  focusedPanel: 'sidebar'|'list'|'detail'|'inspector'|'log'|'command';
  selection: { panel: string; id?: ID };
  filters: {
    query?: string;
    statuses?: Status[];
    priorities?: Priority[];
    tags?: ID[];
    projectId?: ID;
    dueBefore?: string;
    sort: { field: 'dueAt'|'priority'|'updatedAt'; dir: 'asc'|'desc' };
  };
}
```

### 5.2 Derived Data & Indexes
- In‑memory indexes (by `projectId`, `tag`, `status`) for fast list queries.
- Search index (simple token map; pluggable to Lunr/FZF later).

### 5.3 Persistence Formats

**JSON (default)**
```json
{
  "version": 1,
  "tasks": [ { "id": "...", "title": "...", "status": "todo" } ],
  "projects": [ { "id": "...", "name": "Inbox", "order": 0 } ],
  "tags": [ { "id": "...", "name": "urgent", "color": "red" } ]
}
```

**SQLite (optional)**
- Tables: `tasks`, `projects`, `tags`, `task_tags`, `meta`.
- Indices: `tasks(projectId)`, `task_tags(tagId)`, `tasks(status, dueAt)`.

### 5.4 Validation & Migrations
- JSON schema with `ajv`; bump `version` and run migration steps when loading.

---

## 6. Controllers & Commands

### 6.1 Command Router
- Parses `:` commands and dispatches to controller actions.
- Supports completion and syntax help.

**Examples**
- `:add "Buy milk" +home p:2 due:2025-09-20`
- `:move 123 -> @Work`
- `:filter status:todo tag:urgent sort:dueAt:asc`

### 6.2 Undo/Redo
- Command pattern stores **inverse ops**; history capped (configurable).
- Group granular edits into a single transaction (e.g., multi‑field edit).

### 6.3 Panels Controller
- Keeps focus map, selection, and orchestrates panel refreshes.
- Emits diff events for minimal re‑render.

---

## 7. View Layer (blessed)

### 7.1 Core Widgets
- `screen`: root; global key handling and resize listener.
- `layout` grid: for resizable multi‑panel arrangement.
- Custom widgets built over `blessed` primitives: list/table, tree, text area, status bar, splitter.

### 7.2 Rendering Strategy
- Virtualized list rendering for large task lists (windowed rows).
- Debounced renders; coalesce events per frame.
- Theming via config: colors, highlights, borders (light/dark).

### 7.3 Accessibility
- Clear focus rings, high‑contrast theme, predictable tab order.
- All actions have keyboard equivalents.

---

## 8. Storage Adapters

### 8.1 JSON Adapter
- File: `~/.todo/data.json` (+ lock file `data.lock`).
- Atomic writes via temp file rename.
- File watcher for external edits; prompt reload.

### 8.2 SQLite Adapter (optional)
- `better-sqlite3` for sync operations.
- Single‑process lock; WAL mode; periodic vacuum.

---

## 9. Configuration

- File: `~/.todo/config.json`
```json
{
  "storage": { "driver": "json", "path": "~/.todo/data.json" },
  "keymap": { "global": { "help": "?", "command": ":" } },
  "theme": { "accent": "cyan", "danger": "red" },
  "undoLimit": 200,
  "plugins": ["@todo/plugin-sample"]
}
```

---

## 10. Technical Requirements

### 10.1 Runtime & Tooling
- Node.js ≥ 18, TypeScript ≥ 5.
- **Libraries**: `blessed`, `kleur` (colors), `uuid`, `ajv` (schema), optional `better-sqlite3`.
- **Build/Test**: `tsup` or `esbuild`, `vitest`, `ts-node` for dev.
- **Lint/Format**: ESLint (`@typescript-eslint`), Prettier.
- **Packaging**: `bin` entry in `package.json` (CLI `todo`).

### 10.2 Error Handling & Logging
- Centralized logger with levels; render to Log Panel and file `~/.todo/logs/app.log`.
- Graceful failure messages with remediation (e.g., permission errors).

### 10.3 Performance Targets
- Cold start < 150ms on typical machines.
- Render < 16ms per interaction for perceived instant feedback.

### 10.4 Security
- Respect file permissions (0600) for data/config.
- No network access by default.

---

## 11. Workflows

### 11.1 Add Task
1. User presses `a` in Task List or `:add` in Command Bar.
2. Controller validates payload; Model creates Task; Storage persists.
3. EventBus publishes `task:created`; List/Detail refresh minimal diffs.

### 11.2 Edit Task
- Toggle Detail Panel to edit mode → edit → `Ctrl+Enter` save → diff emit.

### 11.3 Filter/Search
- Inspector toggles chips; Controller composes predicate; Model returns view; List re‑renders windowed rows.

### 11.4 Undo/Redo
- Controller pops/pushes command stack; emits resulting diffs; persists.

---

## 12. Testing Strategy
- **Unit**: entities, services, adapters, command parsing.
- **Integration**: controller ↔ model ↔ storage using temp dirs.
- **UI smoke**: blessed screen initialization, key routing, panel focus.
- Snapshot task list rendering for regressions.

---

## 13. Plugin Surface (MVP)
- Hooks: `onLoad(app)`, `onCommand(cmd, ctx)`, `onTaskCreated(task)`.
- Plugin manifest in `package.json` with `todoPlugin` field.

---

## 14. Future Enhancements
- Cloud sync (Git, WebDAV, or custom).
- Recurring tasks & reminders.
- Calendar view (due date grid) with `blessed-contrib` charts.
- Rich search `fzf` integration.

---

## 15. Acceptance Criteria (MVP)
- Launches with default layout and panels.
- Create/edit/complete tasks; move between projects; tag tasks.
- Filter by status/tag/due; search by text.
- Undo/redo for create, edit, complete, move.
- Persist to JSON atomically; config reload without restart.
- All listed default keybindings functional; help screen available.

---

## 16. Example Type Definitions (Appendix)

```ts
// repository.ts
export interface TaskRepository {
  all(): Task[];
  byId(id: ID): Task | undefined;
  create(input: Partial<Task>): Task;
  update(id: ID, changes: Partial<Task>): Task;
  remove(id: ID): void;
}

export interface Storage {
  load(): Promise<{ tasks: Task[]; projects: Project[]; tags: Tag[] }>;
  save(data: { tasks: Task[]; projects: Project[]; tags: Tag[] }): Promise<void>;
}

// Command pattern
export interface Command<T = unknown> {
  name: string;
  do(): T;
  undo(): void;
}
```

---

**End of Design**

