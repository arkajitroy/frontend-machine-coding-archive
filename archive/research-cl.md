# Frontend Machine Coding Research (By Claude)

1. Data grid with sort/filter/pagination (Hard / 50min )

- 10K + row, resizing
- Focus Area: Performance

Core concepts tested
Table virtualization, server-side pagination, multi-column sort, column pinning, ARIA grid
Architectural approach
Separate data layer (fetch+cache), column config model, row virtualization, sort state machine

Performance considerations
Row height pooling, debounced column resize, memoized cell renderers, incremental filter
Hidden edge cases
Mixed type sorting, sticky column z-index, empty state, loading skeleton rows, select-all across pages
Evaluation signals
ARIA grid role + aria-sort, 60fps scroll with 10k rows, correct multi-sort ordering
Follow-up extensions
Inline editing, CSV export, row grouping, global search, frozen columns

Common rejection reasons
No virtual scroll; missing aria-sort; re-fetching on every column click; select-all broken across pages

---

2. File upload with progress and retry (Hard / 50 mins)

- Upload queue
- Focus Area: Asynchronous Behavior

Core concepts tested
XHR progress events, chunked upload, AbortController, exponential backoff, Blob.slice
Architectural approach
Upload queue manager, chunk state machine (idle/uploading/paused/error/done), progress aggregator
Performance considerations
Parallel chunk upload with concurrency limit, stream large files, memory-efficient Blob handling
Hidden edge cases
Network drop mid-upload, duplicate file detection, file size validation, concurrent uploads
Evaluation signals
Accurate progress per file, retry with backoff, pause/resume correctness, accessible progress bar
Follow-up extensions
Drag-drop zone, image preview, server-side deduplication, resumable upload protocol (tus)
Common rejection reasons
No chunking for large files; no retry; progress bar not accessible; memory leak on abort

---

3. Modal Dialog System

Core concepts tested
React portal, focus trap, inert attribute, aria-modal, scroll lock, z-index stacking context
Architectural approach
ModalManager singleton for stacked modals, FocusTrap hook, scroll-lock utility, close-on-esc
Performance considerations
Lazy portal mount, avoid re-rendering background content, CSS contain: strict
Hidden edge cases
Nested modals, modal inside modal focus trap, iOS 15 scroll lock bug, animation on close
Evaluation signals
Tab cycles inside modal, Esc closes, aria-modal + role=dialog, background scroll locked
Follow-up extensions
Confirmation dialog variant, toast notification system, sheet/drawer, overlay stacking manager
Common rejection reasons
Focus escapes modal; background scrolls; missing aria-labelledby; no cleanup on unmount

---

4. Custom Hooks Library (Hard, 45 mins)

- useDebounce, useFetch, useVirtualList, useIntersection

Core concepts tested
Closure correctness, ref vs state, cleanup in useEffect, generic typing, composability
Architectural approach
Single-responsibility hooks, parameter stability (useCallback deps), return shape consistency
Performance considerations
Avoid unnecessary re-renders via useRef for stable callbacks, lazy initial state
Hidden edge cases
Stale closure in async callbacks, double-invocation in StrictMode, unmounted component state update
Evaluation signals
Correct cleanup, no stale closures, TypeScript generics, composable design
Follow-up extensions
usePrevious, useUndo, useReducerWithMiddleware, useSyncExternalStore adapter
Common rejection reasons
Effect cleanup missing; stale closure in timer; no generic types; hooks violating rules of hooks

---

5. Throttled Scroll based Animation (Hard, 40mins)

- Parallax, sticky sections, progress indicator

Core concepts tested
Passive event listeners, rAF loop, IntersectionObserver, CSS will-change, prefers-reduced-motion
Architectural approach
ScrollManager singleton, observer registry, animation state per element, rAF-gated update
Performance considerations
Passive scroll listener, GPU-composited transforms only (translate/opacity), no layout reads in rAF
Hidden edge cases
Multiple scroll containers, iOS momentum scroll, animation on resize, prefers-reduced-motion
Evaluation signals
Smooth 60fps, no layout thrash, respects reduced-motion, no janky paint
Follow-up extensions
Scroll-triggered video play, scroll snap sections, parallax depth layers, lazy-animate offscreen
Common rejection reasons
Layout-triggering properties in scroll handler; no reduced-motion guard; JS animation instead of CSS

---

6. Responsive layout system (40mins, Architectural)

- CSS Grid-based, responsive breakpoints, RTL

Core concepts tested
CSS Grid/Flexbox, logical properties, fluid typography (clamp), container queries, RTL via dir attribute
Architectural approach
Token-based spacing/sizing system, breakpoint config, responsive utility classes, layout components

Performance considerations
Avoid JS-based responsive logic; use CSS custom properties for theming; minimize specificity
Hidden edge cases
RTL text wrapping differently, print stylesheet, reduced-motion media query, high-contrast mode
Evaluation signals
No JS for layout, correct RTL mirroring, passes WCAG contrast, works without JS
Follow-up extensions
Dark mode, design token system, component variants, Storybook integration

Common rejection reasons
JS resize listener instead of CSS; no RTL support; hard-coded px values; ignores prefers-contrast

---

7. Code Difference Reviewer (70min, Extreme Hard)

- Syntax highlight, line-level comments, collapse

Core concepts tested
Myers diff algorithm, token-level highlighting, virtual scroll for large diffs, inline vs split view

Architectural approach
Diff model (hunk list), syntax tokenizer, virtual row renderer, comment anchoring to line numbers

Performance considerations
Tokenize lazily, virtual scroll hunks, memoize unchanged lines

Hidden edge cases
Binary file diff, very long lines causing horizontal scroll, comment on deleted line

Evaluation signals
Correct diff computation, performant with 1000-line files, comment threading, view toggle
Follow-up extensions
Word-level diff, comment resolution, suggestion mode, PR review workflow

Common rejection reasons
Naive DOM diff without virtualization; no syntax highlight; comments lost on view switch

---

8. Infinite Calandar / Date Picker (50 mins, Hard, Accessibility)

- Virtualized months, range select, keyboard

Core concepts tested
Date math, locale-aware week start, virtualized month grid, range selection FSM, ARIA grid pattern
Architectural approach
Controlled date range state, month navigation virtualization, keyboard focus grid management
Performance considerations
Memoize month grids, avoid recomputing all months on range change
Hidden edge cases
Disabled date ranges, min/max bounds, cross-year navigation, RTL locale support
Evaluation signals
ARIA grid role, aria-selected, aria-disabled, keyboard (arrow keys, Page Up/Down), locale support
Follow-up extensions
Time picker integration, multi-month view, blocked date ranges with tooltips, mobile touch gestures
Common rejection reasons
No ARIA grid; arrow keys broken; no min/max enforcement; no range visual feedback

---

9. Virtualized Tree View (60 mins, Very Hard, Performance)

- Expandable nodes, async lazy-load children

Core concepts tested
Tree flattening for virtual list, expand/collapse with row injection, lazy-load subtree, ARIA treeitem
Architectural approach
Flat visible-rows array recomputed on toggle, async node loader, selection model, keyboard nav FSM
Performance considerations
Only flatten visible rows, skip hidden subtrees, debounce expand for large trees
Hidden edge cases
Async children arrive after collapse, multi-select across levels, very deep trees (1000+ nodes)
Evaluation signals
ARIA tree/treeitem/group roles, keyboard (arrows, home/end, expand/collapse), async correctness
Follow-up extensions
Drag-drop reorder, search with highlight, virtual checkboxes, bulk expand/collapse
Common rejection reasons
Re-renders entire tree on toggle; no ARIA; async race on collapse; no keyboard nav

---

10. Event Emitter / Pub Sub (Hard, 40mins, Listener Registry)

Core concepts tested
Listener map, once wrapper, removeListener by reference, max listener warning, wildcard events
Architectural approach
Map>, once wraps and removes after invoke, emit in listener insertion order
Performance considerations
WeakRef listeners for auto-cleanup, avoid cloning listener array unless needed
Hidden edge cases
Emit during emit (re-entrancy), removing listener inside handler, once after multiple emits
Evaluation signals
Correct once semantics, removeListener by same function reference, no memory leak for removed events
Follow-up extensions
Namespaced events, async emit with await, error event convention, React adapter hook
Common rejection reasons
Off doesn't work; once fires multiple times; memory leak; emit order wrong during modification

---

11. Promise combinators from scratch

Core concepts tested
Promise internals, microtask queue, resolve/reject semantics, early exit on rejection, settled vs fulfilled
Architectural approach
Factory function consuming iterable, handling non-Promise values, maintaining insertion-order results
Performance considerations
No unnecessary wrapper allocations, correct microtask timing
Hidden edge cases
Empty array input, non-iterable input, already-settled promises, synchronous throw inside executor
Evaluation signals
Correct rejection semantics per spec, empty array edge case, handles synchronous errors
Follow-up extensions
Promise.withResolvers, cancellable promise, retry combinator, timeout wrapper
Common rejection reasons
Wrong rejection semantics for allSettled; broken with empty array; synchronous error not caught

---

12. Offline First PWA with sync-queue (IndexedDB + sync queue)

- Service worker, IndexedDB, background sync

Core concepts tested
Service worker install/activate/fetch lifecycle, cache strategies (cache-first, stale-while-revalidate), Background Sync API, IndexedDB queue
Architectural approach
SW registration, cache versioning + cleanup, mutation queue in IDB, sync on reconnect, conflict resolution
Performance considerations
Precache critical assets, runtime cache dynamic routes, compress cached responses
Hidden edge cases
SW update mid-session, sync queue overflow, conflict on concurrent edits while offline
Evaluation signals
Offline mode works fully, sync fires on reconnect, stale data correctly invalidated
Follow-up extensions
Push notifications, delta sync, selective offline routes, multi-tab coordination via BroadcastChannel
Common rejection reasons
No cache strategy; SW not activated properly; sync fails silently; no conflict handling

---

13. Debounced/throttled event utility

- With flush, cancel, leading/trailing

Core concepts tested
Closure over timer, leading/trailing edge, flush() for immediate invoke, cancel() cleanup, requestAnimationFrame variant
Architectural approach
Factory function returning wrapped fn with .flush() and .cancel(), option object pattern
Performance considerations
Correct timer references, no closure memory leak, handle rapid invocation without drift
Hidden edge cases
Flush after cancel, leading+trailing both true, async wrapped fn, multiple instances
Evaluation signals
Correct trailing vs leading behavior, flush/cancel composability, no memory leak, TypeScript generics
Follow-up extensions
Throttle with rAF, memoized debounce per argument, React hook wrapper
Common rejection reasons
Timer not cleared on cancel; flush broken; no leading option; memory leak from closure holding large args

---

14. Accordion / disclosure pattern (30 mins, mid-hard, local)

- Animated, keyboard, single-open mode

Core concepts tested
ARIA disclosure pattern (button + region), CSS height animation with auto, focus management, single-open constraint
Architectural approach
Accordion context for single-open enforcement, panel state map, animated panel using CSS max-height transition
Performance considerations
CSS animation not JS; avoid reflow by using max-height or grid-template-rows
Hidden edge cases
Dynamically added panels, pre-expanded on mount, deep-linked panel by URL hash
Evaluation signals
aria-expanded, aria-controls, id wiring, keyboard (Enter/Space/Home/End/arrows), correct animation
Follow-up extensions
Nested accordions, accordion inside tab panel, lazy-load panel content, search filtering panels
Common rejection reasons
div onClick not button; aria-expanded missing; animation janky via JS height; no keyboard support

---

15. Toast / notification system (Global Queue)

- Queue, priority, auto-dismiss, stack

Core concepts tested
Pub/sub event system, portal rendering, aria-live polite/assertive, animation exit, queue FIFO
Architectural approach
ToastProvider context, addToast/removeToast API, priority queue, animation state per item
Performance considerations
Limit concurrent toasts (max 3), CSS animation over JS, avoid layout reflow on add
Hidden edge cases
Multiple toasts overlapping, persistent error toast, dismiss race, focus management on dismiss
Evaluation signals
aria-live region, correct role (alert vs status), keyboard dismiss, no z-index bleed
Follow-up extensions
Undo action inside toast, grouping similar toasts, custom renderer, toast history panel
Common rejection reasons
No aria-live; toasts cover interactive content; no keyboard dismiss; dismiss race condition

---

16. Image carousel / slideshow

- Lazy-load, preload adjacent, ARIA

Core concepts tested
IntersectionObserver lazy-load, preload next/prev, CSS transform animation, ARIA live region
Architectural approach
Viewport-aware image loader, preload manager (1 ahead), touch swipe gesture handler
Performance considerations
Only decode images in viewport, use , avoid layout thrash on slide change
Hidden edge cases
Images of different aspect ratios, slow network fallback, autoplay pause on focus, RTL support
Evaluation signals
Accessible ARIA (role=region, aria-roledescription, aria-label), keyboard nav, no layout shift
Follow-up extensions
Zoom on click, thumbnail strip, caption overlay, video slide support
Common rejection reasons
All images preloaded upfront; no keyboard nav; autoplay doesn't pause on focus; no ARIA

---

17. Multi-step form wizard

- Validation, persistence, async submit

Core concepts tested
Step state machine, async field validation, optimistic navigation, localStorage draft persistence
Architectural approach
Wizard context with step config, field-level validators, submit queue, error recovery
Performance considerations
Lazy-load step components, validate on blur not change, minimize re-renders via field subscriptions
Hidden edge cases
Browser back button breaking wizard state, concurrent submit clicks, field async validation race
Evaluation signals
No state loss on back, correct error summary, accessible step indicator, submit idempotency
Follow-up extensions
Conditional branches, auto-save draft, multi-language, progress restoration on refresh
Common rejection reasons
Full-form re-render on each keystroke; missing error summary for screen readers; duplicate submit

---

18. Polling + real-time dashboard (Hard, 50 mins, Async)

- WebSocket with HTTP polling fallback

Core concepts tested
WebSocket lifecycle, SSE, exponential backoff reconnect, optimistic chart update, memory-safe subscriptions
Architectural approach
Transport abstraction (WS/SSE/polling), event bus, chart update queue, connection state machine
Performance considerations
Throttle chart redraws to rAF, batch incoming events, evict old data from ring buffer
Hidden edge cases
Tab visibility change pausing WS, reconnect storm with many clients, message ordering
Evaluation signals
Reconnect with backoff, no memory leak on tab close, graceful fallback, live region updates for a11y
Follow-up extensions
Historical replay, alert thresholds, multi-metric overlay, export to CSV
Common rejection reasons
No reconnect logic; memory leak from unremoved listeners; no fallback; no aria-live region

---

19. Virtualized infinite scroll feed

- News feed with DOM recycling

Core concepts tested
IntersectionObserver, windowing (react-window), pagination, request deduplication, stale-while-revalidate
Architectural approach
Separate scroll container, item height estimation, overscan buffer, LRU cache layer
Performance considerations
DOM node count capped, requestAnimationFrame scheduling, image lazy-load, debounced scroll
Hidden edge cases
Variable item heights breaking virtual list, race conditions on fast scroll, empty state, error retry backoff
Evaluation signals
Node recycling correctness, memory stays flat, smooth 60fps, handles network failures gracefully
Follow-up extensions
Add real-time new-post injection, sticky header, optimistic likes, collaborative cursors
Common rejection reasons
Naive map rendering all items; no loading skeleton; no error boundary; accessibility missing for dynamic content

---

20. Collaborative rich-text editor

- Multi-user live editing with conflict resolution

Core concepts tested
Operational Transform or CRDT basics, WebSocket/SSE, contentEditable, selection reconciliation
Architectural approach
Document model separate from view, operation queue, merge function, cursor broadcast
Performance considerations
Throttled broadcast, minimal DOM diffing, virtual cursor rendering
Hidden edge cases
Cursor drift after remote ops, undo/redo with concurrent edits, offline queue flush
Evaluation signals
Correct merge semantics, no cursor jump, graceful degradation offline
Follow-up extensions
Comments/annotations, version history, presence avatars, permission model
Common rejection reasons
No conflict model at all; direct DOM manipulation losing selection; no WebSocket teardown on unmount

---

21. Nested Comment Thread

- Infinite depth with virtualization

Core concepts tested
Recursive tree rendering, state normalization, lazy-load child threads, DFS/BFS traversal
Architectural approach
Flat id-map store vs nested JSON, collapse/expand by id set, reply optimistic insert
Performance considerations
Virtualize top-level threads, lazy-expand deep nodes, batch state updates
Hidden edge cases
Deleted parent with visible children, extremely deep nesting, concurrent collapse/expand
Evaluation signals
State normalization, O(1) lookup, correct parent-child wiring after collapse
Follow-up extensions
Moderation flags, mentions, real-time new replies, infinite scroll within thread
Common rejection reasons
Nested state causing O(n²) re-renders; no keyboard nav; no ARIA tree role

---

22. Autocomplete / typeahead search

- Debounced, cached, keyboard-navigable

Core concepts tested
Debounce vs throttle, AbortController, LRU suggestion cache, ARIA combobox pattern
Architectural approach
Input controller, suggestion manager (fetch+cache), dropdown renderer, keyboard FSM
Performance considerations
Debounce 200ms, cancel in-flight requests, cache last N queries, group virtual list for 100+ results
Hidden edge cases
Stale suggestions after fast typing, empty/error state, IME composition events, mobile soft-keyboard
Evaluation signals
No race condition, cache hit path, ARIA roles (combobox/listbox/option), esc/enter/arrow keys
Follow-up extensions
Grouped categories, recent searches, server-side fuzzy match, analytics on selection
Common rejection reasons
No debounce; missing ARIA; old results flash; no AbortController on unmount

---

23. Drag and Drop Kanban Board

- Columns + cards with persistence

Core concepts tested
Pointer events, drop-target detection, optimistic UI, rollback on failure, keyboard DnD alternative
Architectural approach
Immutable card list per column, drag context, ghost element positioning, server sync queue
Performance considerations
RequestAnimationFrame for ghost, avoid re-rendering all cards on drag, batch column updates
Hidden edge cases
Cross-column ordering conflicts, undo on API failure, touch devices, drag over nested targets
Evaluation signals
Smooth 60fps, ARIA for keyboard users, optimistic+rollback, no flicker on drop
Follow-up extensions
Card detail drawer, swimlanes, WIP limits, multi-select drag, board sharing
Common rejection reasons
No keyboard alternative; state mutation causing flicker; no rollback on failure; no touch support

---
