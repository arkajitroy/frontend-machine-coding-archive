# Frontend Machine Coding Interview Repository

**Curated for Mid-to-Senior Frontend Engineers**

This document synthesizes research from multiple sources into a single, high-signal reference. It merges overlapping problems, normalizes terminology, eliminates redundancy, and enriches entries with architectural depth, evaluation signals, hidden complexities, and production-grade expectations observed in Big Tech and high-scale product company interviews.

### Executive Summary & Key Trends (2023–2026)

Modern frontend machine coding rounds have evolved from basic component implementation to **frontend systems engineering evaluations**. Interviewers prioritize:

- **Scalable rendering** (virtualization, memoization, incremental updates)
- **Robust async orchestration** (debouncing, race conditions, caching, retries, backpressure)
- **Production-grade architecture** (data layers, state normalization, optimistic/rollback patterns, offline-first)
- **Accessibility & keyboard navigation** as first-class concerns
- **Real-world resilience** (conflict resolution, network degradation, multi-user sync, undo/redo)
- **Extensibility & composability** (schemas, plugins, contexts, factories)

**Recurring Themes**:

- Virtualization for large datasets
- Optimistic UI + rollback
- Real-time/collaborative patterns (WebSockets, CRDT-like ops)
- Offline-first with sync queues
- Performance isolation & memoization
- ARIA compliance & focus management

The strongest candidates demonstrate **systems thinking** — clear separation of data, UI, and orchestration layers — rather than monolithic components.

---

## 1. Easy to Medium Questions

These test solid fundamentals, component design, accessibility, and clean architecture. They frequently appear as warm-ups or mid-level screening rounds.

| No  | Problem Title                                                      | Category/Domain     | Difficulty  | Frequency Signal | Core Concepts Tested                                | Architectural Focus             | Est. Time | Key Evaluation Criteria & Hidden Edge Cases                                                            |
| --- | ------------------------------------------------------------------ | ------------------- | ----------- | ---------------- | --------------------------------------------------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| 1   | Modal / Overlay System Manager                                     | UI Infrastructure   | Medium-High | Very High        | Portals, focus traps, stacking, inert               | UI orchestration layer          | 45m       | Nested modals, Esc handling, background scroll lock, aria-modal, focus restoration, animation cleanup. |
| 2   | Multi-Select Dropdown / Combobox                                   | Form Controls       | Medium-High | Extremely High   | Controlled components, keyboard nav, ARIA           | Component composition           | 45m       | Async options, keyboard filtering, ARIA listbox, tag input, select-all, stale data handling.           |
| 3   | Tabs / Popover / Menu System                                       | Compound Components | High        | Extremely High   | Compound components, roving tabindex                | UI infrastructure primitives    | 45m       | Nested overlays, focus management, keyboard navigation, z-index stacking, escape handling.             |
| 4   | Notification / Toast System                                        | Feedback Systems    | Medium-High | High             | Queue management, portals, aria-live                | Global orchestration            | 45m       | Auto-dismiss, priority queues, stacking, undo actions, persistent toasts, screen reader announcements. |
| 5   | Accordion / Disclosure Pattern                                     | Interactive UI      | Medium      | High             | ARIA disclosure, animation, single-open mode        | Context-driven state            | 30–45m    | Dynamic panels, keyboard (arrows/home/end), deep linking, nested accordions, CSS animation.            |
| 6   | Image Carousel / Slideshow                                         | Media UI            | Medium      | Medium-High      | Lazy loading, touch/swipe, IntersectionObserver     | Lazy-load + viewport management | 45–60m    | Different aspect ratios, keyboard nav, preload adjacent, ARIA live region, autoplay pause.             |
| 7   | Responsive Layout System + Design Tokens                           | Layout & Theming    | Medium-High | High             | CSS Grid/Container Queries, logical properties, RTL | Token-based architecture        | 40–60m    | No-JS responsive, high-contrast, reduced-motion, print styles, dark mode, no layout shift.             |
| 8   | Command Palette                                                    | Productivity UI     | High        | Very High        | Keyboard systems, fuzzy search, action registry     | Action architecture             | 45–60m    | Roving tabindex, nested commands, recent history, keyboard shortcuts, accessibility.                   |
| 9   | Multi-Step Form / Wizard (basic)                                   | Forms               | High        | Very High        | Step state machine, validation, persistence         | Schema/journey context          | 60m       | Conditional branching, draft save, error summaries, back-button support, async validation.             |
| 10  | Custom Hooks Library (`useDebounce`, `useFetch`, `useVirtualList`) | React Primitives    | High        | High             | Rules of Hooks, closure safety, cleanup             | Composable abstractions         | 45m       | Stale closures, StrictMode, generics, proper cleanup, parameter stability.                             |
| 11  | Debounce / Throttle Utility (with flush/cancel)                    | Utilities           | Medium-High | High             | Timer management, leading/trailing                  | Factory pattern utilities       | 40m       | Flush/cancel semantics, memory leaks, async wrapped functions, leading+trailing options.               |
| 12  | Nested Comment System (basic)                                      | Threaded UI         | High        | High             | Recursive rendering, normalization                  | Tree vs flat store              | 60m       | Collapse/expand, reply insertion, keyboard navigation, basic live updates.                             |

---

## 2. Hard and Very Hard Questions

These represent the most frequently asked, high-impact problems across senior-level rounds. They best signal senior engineering capability.

| No  | Problem Title                                                                   | Category/Domain      | Difficulty  | Frequency Signal                       | Core Concepts Tested                                         | Architectural Focus                          | Est. Complexity & Time | Seniority Signal | Key Evaluation Criteria & Hidden Edge Cases                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------- | -------------------- | ----------- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------- | ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Virtualized Data Grid / Table** (sort, filter, pagination, pinning, resizing) | Data-heavy UI        | Very High   | Extremely High (Meta, analytics tools) | Virtualization, memoization, column metadata, multi-sort     | Data layer abstraction + rendering isolation | Very High (90–120m)    | Senior+          | 60fps with 10k+ rows, ARIA grid roles, dynamic row heights, sticky columns/z-index, select-all across pages, incremental filtering, keyboard nav. **Edge**: Mixed data types, frozen columns, empty/loading states. |
| 2   | **Infinite Scroll Feed / Virtualized List** (with pagination, caching)          | Feeds & Lists        | High        | Extremely High                         | Windowing, IntersectionObserver, request deduplication       | Async cache design, sparse rendering         | High (60–90m)          | Mid-Senior       | Smooth scrolling, duplicate prevention, scroll restoration, prefetching, variable heights, race conditions on fast scroll, skeletons, bidi-scroll support.                                                          |
| 3   | **Kanban Board** (Drag-and-Drop columns + cards)                                | Interactive Boards   | High        | Very High                              | DnD (Pointer events), normalized state, optimistic updates   | State architecture + undo/rollback           | High (90m)             | Senior           | Keyboard DnD alternative, multi-column reordering, conflict resolution, batch updates, touch support, flicker-free ghosting. **Follow-up**: Multi-user sync.                                                        |
| 4   | **Typeahead / Autocomplete Search** (debounced, cached)                         | Search & Input       | High        | Extremely High                         | Debounce/throttle, LRU cache, race handling, AbortController | Async orchestration + suggestion manager     | High (45–75m)          | Mid-Senior       | Stale response cancellation, ARIA combobox, fuzzy search, grouped results, IME composition, keyboard navigation, empty/error states.                                                                                |
| 5   | **Rich Text Editor / Collaborative Document**                                   | Editors              | Very High   | High & Increasing                      | Selection/operation models, conflict resolution              | Extensible architecture, OT/CRDT basics      | Very High (90–120m)    | Staff+           | Cursor sync, offline queue, undo/redo with concurrency, real-time merging, XSS sanitization, presence indicators.                                                                                                   |
| 6   | **Chat / Messaging System** (threads, typing, presence)                         | Real-time Apps       | High        | Extremely High                         | Streaming updates, optimistic sends, message ordering        | Event-driven state + presence sync           | High (60–90m)          | Mid-Senior       | Live regions, message deduplication, offline queue, read receipts, reconnect backoff, thread navigation.                                                                                                            |
| 7   | **File Upload Manager** (progress, chunking, retry)                             | Async Workflows      | High        | High                                   | Chunked uploads, queue management, exponential backoff       | Retry systems + progress aggregation         | High (60m)             | Senior           | Partial failures, resumable (tus-like), memory-efficient Blobs, pause/resume, duplicate detection, accessible progress.                                                                                             |
| 8   | **Tree Explorer / Virtualized Tree** (expandable, lazy)                         | Hierarchical UI      | High        | High                                   | Recursive flattening, lazy loading, selection models         | Data normalization + tree semantics          | High (60–90m)          | Senior           | ARIA tree roles, keyboard nav (arrows, home/end), async race on collapse/expand, mixed selection states, deep nesting.                                                                                              |
| 9   | **Modal / Overlay System Manager** (stacking, focus)                            | UI Infrastructure    | Medium-High | Very High                              | Portals, focus traps, inert, z-index stacking                | UI orchestration & accessibility primitives  | Medium (45m)           | Mid-Senior       | Nested modals, Esc handling, background scroll lock, aria-modal, animation cleanup, keyboard trap.                                                                                                                  |
| 10  | **Multi-Step Form / Wizard Engine** (validation, branching)                     | Forms                | High        | Very High                              | Schema-driven UI, async validation, state machines           | Config-driven + journey context              | High (60m)             | Mid-Senior       | Conditional fields, draft persistence, error summaries (ARIA), back-button resilience, optimistic navigation.                                                                                                       |
| 11  | **Nested Comment System** (threads, pagination)                                 | Social / Threaded UI | High        | High                                   | Recursive rendering, normalization vs nesting                | Tree rendering + flat store                  | High (60m)             | Mid-Senior       | Lazy loading replies, collapse/expand races, moderation actions, live updates, deep nesting virtualization.                                                                                                         |
| 12  | **Calendar / Scheduler** (multi-view, drag)                                     | Time-based UI        | Very High   | High                                   | Date math, recurrence, view virtualization                   | Complex state modeling                       | High (90m)             | Senior           | Timezone handling, keyboard scheduling, drag-resize, blocked ranges, multi-month views.                                                                                                                             |
| 13  | **Dashboard Widget System** (dynamic layout, drag)                              | Configurable UIs     | Very High   | Increasing                             | Plugin architecture, layout engines                          | Composable + persistent config               | Very High (90m)        | Staff+           | Widget marketplace patterns, resize handling, persistence, focus preservation, async widget loading.                                                                                                                |
| 14  | **Offline-First App** (notes/cart/sync)                                         | Offline & Sync       | Very High   | Increasing                             | IndexedDB, queue reconciliation, conflict handling           | Offline-first architecture                   | Very High (90m)        | Senior           | Merge conflicts, background sync, optimistic local writes, multi-device consistency, service worker strategies.                                                                                                     |
| 15  | **Command Palette** (fuzzy search, keyboard)                                    | Productivity UI      | High        | Very High                              | Keyboard systems, action registry                            | Action architecture                          | High (45–60m)          | Senior           | Roving tabindex, nested commands, fuzzy matching, recent history, accessibility.                                                                                                                                    |
| 16  | **Real-Time Streaming Dashboard** (WebSocket/SSE)                               | Observability        | Very High   | Increasing                             | Incremental rendering, backpressure                          | Real-time data pipelines                     | Very High (90m)        | Staff+           | Reconnect logic, adaptive refresh, live regions, throttling, historical replay.                                                                                                                                     |
| 17  | **Optimistic Mutation System**                                                  | State Management     | Very High   | Increasing                             | Rollback, queues, consistency                                | Async consistency layer                      | High (75m)             | Senior           | Conflict detection, retry queues, error recovery UX, network degradation handling.                                                                                                                                  |
| 18  | **Spreadsheet Clone** (virtualized cells)                                       | Data Tools           | Very High   | Increasing                             | Cell virtualization, formula engine                          | State graph design                           | Very High (120m)       | Staff+           | Formula cycles, multi-sheet, keyboard nav, large dataset performance.                                                                                                                                               |
| 19  | **Collaborative Whiteboard**                                                    | Real-time Canvas     | Very High   | Increasing                             | Event sync, operation transforms                             | Real-time architecture                       | Very High (120m)       | Staff+           | Conflict resolution, presence, layer management, offline buffer, undo stack.                                                                                                                                        |
| 20  | **Data Fetching Layer** (cache, dedupe, invalidation)                           | Infrastructure       | Very High   | Increasing                             | Request deduplication, stale-while-revalidate                | Shared async infrastructure                  | High (90m)             | Senior           | Background revalidation, suspense patterns, error boundaries, loading semantics.                                                                                                                                    |

_(Remaining high-signal items such as Design System Components, Multi-Select Dropdown, Tabs/Popover/Menu, Notification/Toast System, and Markdown Editor are strong mid-level signals and frequently appear as warm-ups or focused segments.)_

---

## 3. Bonus: Advanced / Niche / Emerging Questions

These provide strong differentiation for Staff+ roles or specialized interviews.

| No  | Problem Title                                                           | Category          | Difficulty  | Frequency   | Core Concepts                                       | Architectural Focus             | Notes & Evaluation Signals                                                    |
| --- | ----------------------------------------------------------------------- | ----------------- | ----------- | ----------- | --------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| 1   | Promise Combinators / Event Emitter from scratch                        | Foundations       | High        | Medium      | Microtask queue, listener registry, re-entrancy     | Low-level async primitives      | Correct rejection semantics, once(), memory safety, WeakRef cleanup.          |
| 2   | Custom Hooks Library (`useDebounce`, `useVirtualList`, `useFetch` etc.) | React Primitives  | High        | High        | Rules of Hooks, closure safety, generics            | Composable abstractions         | Stale closures, StrictMode double-invoke, cleanup, TypeScript ergonomics.     |
| 3   | Code Diff Viewer (syntax highlight, virtualized, comments)              | Tools             | Extreme     | Medium-High | Myers diff, tokenization, virtual hunks             | Diff model + rendering pipeline | Large file performance, comment anchoring, view switching (unified/split).    |
| 4   | Drag-and-Drop Page Builder / Layout Engine                              | Composability     | Very High   | Increasing  | Nested drag zones, constraint solving               | Composable architecture         | Keyboard DnD, persistence, collaborative editing, nested drop targets.        |
| 5   | Video Player Controls + Streaming                                       | Media             | High        | Medium      | Media events, quality switching, buffering          | Media abstraction layer         | Buffer handling, accessibility timing, picture-in-picture, keyboard controls. |
| 6   | Responsive Layout System + Design Tokens                                | Theming/Layout    | High        | High        | CSS Grid/Container Queries, logical properties, RTL | Token-based, no-JS responsive   | High-contrast, reduced-motion, print styles, no layout shift.                 |
| 7   | Real-Time Presence System                                               | Collaboration     | Very High   | Increasing  | Distributed state, disconnect recovery              | Presence sync layer             | Typing indicators, avatar cursors, reconnect UX.                              |
| 8   | Bulk Action Selectable List (Gmail-style)                               | List Interactions | Medium-High | High        | Selection sets, batch async actions                 | Selection + queue architecture  | Partial selection, undo, ARIA live updates.                                   |

---

### Preparation Guidance & Interviewer Signals

**Prioritize**:

1. Virtualization + performance isolation
2. Async resilience (debounce, cancellation, queues, retries)
3. Accessibility (ARIA, focus, keyboard, live regions)
4. State/data layer design (normalization, caching, optimistic patterns)
5. Real-time & offline considerations

**Common Rejection Reasons** (across sources):

- No virtualization → OOM or jank on large data
- Missing focus traps / ARIA → accessibility failure
- Stale closures / race conditions in async flows
- Direct DOM mutation or poor separation of concerns
- No error handling / rollback on failures
- Ignoring keyboard / screen reader paths

**Strong Signals**:

- Clear data vs. UI layer separation
- Proactive performance & accessibility considerations
- Production-like edge case handling without prompting
- Thoughtful trade-off discussion (e.g., virtual vs. actual DOM, normalization tradeoffs)

This repository serves as a living reference. Focus preparation on **building production-realistic systems** rather than isolated components. The market now rewards engineers who can design, scale, and productionize complex UIs under realistic constraints.

**Happy interviewing!**
