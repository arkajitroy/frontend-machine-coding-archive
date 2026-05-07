# Research-Backed Top 30 Frontend Machine Coding Questions

| #   | Problem                    | Difficulty  | Frequency        | Core Concepts                           | Architecture Focus      | Performance Complexity | Async Complexity | Accessibility Depth    | Seniority Signal | Interview Time | Hidden Edge Cases   | Common Follow-Ups       | Prep Priority |
| --- | -------------------------- | ----------- | ---------------- | --------------------------------------- | ----------------------- | ---------------------- | ---------------- | ---------------------- | ---------------- | -------------- | ------------------- | ----------------------- | ------------- |
| 1   | Virtualized Data Grid      | Very High   | Extremely Common | Virtualization, memoization, pagination | Rendering isolation     | Very High              | Medium           | Keyboard nav           | Senior           | 90–120m        | Dynamic row height  | Column pinning          | Critical      |
| 2   | Typeahead Search System    | High        | Extremely Common | Debounce, caching, race handling        | Async orchestration     | High                   | Very High        | ARIA combobox          | Mid-Senior       | 45–75m         | Stale responses     | Search history          | Critical      |
| 3   | Kanban Board               | High        | Very Common      | DnD, normalized state                   | State architecture      | High                   | Medium           | Keyboard DnD           | Senior           | 90m            | Reordering bugs     | Multi-user sync         | Critical      |
| 4   | Infinite Feed              | High        | Extremely Common | Pagination, caching                     | Async cache design      | High                   | High             | Focus recovery         | Mid-Senior       | 60m            | Duplicate items     | Prefetching             | Critical      |
| 5   | Rich Text Editor           | Very High   | Common           | Selection state, plugins                | Extensible architecture | Very High              | Medium           | Screen reader support  | Staff+           | 120m           | Cursor sync         | Collaborative editing   | Critical      |
| 6   | Modal System Manager       | Medium-High | Very Common      | Portals, focus traps                    | UI infrastructure       | Medium                 | Low              | Very High              | Mid-Senior       | 45m            | Nested modals       | Modal stacking          | High          |
| 7   | Tree Explorer              | High        | Common           | Recursive rendering                     | Data normalization      | High                   | Medium           | Tree semantics         | Senior           | 60m            | Lazy loading        | Virtualized tree        | High          |
| 8   | Collaborative Whiteboard   | Very High   | Increasing       | Event sync                              | Real-time architecture  | Very High              | Very High        | Pointer accessibility  | Staff+           | 120m           | Conflict resolution | Presence indicators     | Critical      |
| 9   | Chat Application           | High        | Extremely Common | Streaming updates                       | Event-driven state      | High                   | Very High        | Live regions           | Mid-Senior       | 60–90m         | Message ordering    | Offline queue           | Critical      |
| 10  | Spreadsheet Clone          | Very High   | Increasing       | Cell virtualization                     | State graph design      | Very High              | High             | Keyboard nav           | Staff+           | 120m           | Formula cycles      | Multi-sheet support     | Critical      |
| 11  | Multi-Step Form Engine     | High        | Very Common      | Validation orchestration                | Schema-driven UI        | Medium                 | High             | Error semantics        | Mid-Senior       | 60m            | Async validation    | Dynamic forms           | High          |
| 12  | Command Palette            | High        | Very Common      | Keyboard systems                        | Action architecture     | High                   | Medium           | Roving tabindex        | Senior           | 45–60m         | Fuzzy search        | Nested commands         | High          |
| 13  | File Upload Manager        | High        | Common           | Chunk upload                            | Retry systems           | Medium                 | Very High        | Progress announcements | Senior           | 60m            | Partial failure     | Resumable upload        | High          |
| 14  | Notification System        | Medium-High | Common           | Queue management                        | Global orchestration    | Medium                 | Medium           | Announcements          | Mid-Senior       | 45m            | Duplicates          | Priority queues         | Medium        |
| 15  | Design System Component    | High        | Extremely Common | API ergonomics                          | Reusable abstractions   | Medium                 | Low              | Very High              | Senior           | 60m            | Variant explosion   | Theming                 | Critical      |
| 16  | Nested Comment System      | High        | Common           | Recursive state                         | Tree rendering          | High                   | Medium           | Thread navigation      | Mid-Senior       | 60m            | Pagination          | Live updates            | Medium        |
| 17  | Calendar Scheduler         | Very High   | Common           | Time math                               | Complex state modeling  | High                   | High             | Keyboard scheduling    | Senior           | 90m            | Timezone bugs       | Drag resize             | High          |
| 18  | Streaming Dashboard        | Very High   | Increasing       | WebSockets                              | Incremental rendering   | Very High              | Very High        | Dynamic updates        | Staff+           | 90m            | Backpressure        | Adaptive refresh        | Critical      |
| 19  | Offline Notes App          | Very High   | Increasing       | Sync reconciliation                     | Offline-first           | High                   | Very High        | Recovery UX            | Senior           | 90m            | Merge conflicts     | Background sync         | High          |
| 20  | Analytics Chart Builder    | High        | Common           | Data transformation                     | Rendering pipelines     | High                   | Medium           | Chart semantics        | Senior           | 75m            | Large datasets      | Live filtering          | Medium        |
| 21  | Multi-Select Dropdown      | Medium-High | Extremely Common | Controlled state                        | Component composition   | Medium                 | Medium           | ARIA listbox           | Mid-Senior       | 45m            | Keyboard filtering  | Async options           | Critical      |
| 22  | Video Player Controls      | High        | Common           | Event coordination                      | Media abstraction       | Medium                 | Medium           | Screen reader timing   | Mid-Senior       | 60m            | Buffer handling     | Streaming quality       | Medium        |
| 23  | Dashboard Widget System    | Very High   | Increasing       | Dynamic layout                          | Plugin architecture     | High                   | High             | Focus persistence      | Staff+           | 90m            | Layout persistence  | Widget marketplace      | High          |
| 24  | Data Fetching Layer        | Very High   | Increasing       | Cache invalidation                      | Shared async infra      | High                   | Very High        | Loading semantics      | Senior           | 90m            | Request dedupe      | Background revalidation | Critical      |
| 25  | Markdown Editor Preview    | High        | Common           | Incremental parsing                     | Render pipeline         | High                   | Medium           | Preview semantics      | Mid-Senior       | 60m            | XSS sanitization    | Plugin support          | Medium        |
| 26  | Dynamic Form Builder       | Very High   | Common           | Schema engines                          | Config-driven UI        | Medium                 | High             | Validation UX          | Senior           | 90m            | Conditional fields  | JSON schema support     | High          |
| 27  | Drag-and-Drop Page Builder | Very High   | Increasing       | Layout engine                           | Composable architecture | Very High              | Medium           | Keyboard DnD           | Staff+           | 120m           | Nested drag zones   | Collaborative editing   | Critical      |
| 28  | Optimistic Mutation System | Very High   | Increasing       | Rollback systems                        | Async consistency       | Medium                 | Very High        | Error recovery         | Senior           | 75m            | Conflict handling   | Retry queues            | Critical      |
| 29  | Tabs/Popover/Menu System   | High        | Extremely Common | Compound components                     | UI infrastructure       | Medium                 | Low              | Very High              | Mid-Senior       | 45m            | Focus bugs          | Nested overlays         | Critical      |
| 30  | Real-Time Presence System  | Very High   | Increasing       | Presence sync                           | Distributed UI state    | High                   | Very High        | Live announcements     | Staff+           | 90m            | Disconnect recovery | Typing indicators       | High          |

---

# Final Conclusions

The modern frontend machine coding interview is no longer primarily a “React coding test.”

It is increasingly:

- a frontend systems engineering evaluation
- an architecture and scalability assessment
- a performance reasoning exercise
- a product engineering simulation

The strongest preparation path is no longer:

- memorizing component implementations

Instead:

- mastering rendering behavior
- understanding scalable state systems
- designing extensible abstractions
- practicing async resilience
- building production-realistic UI infrastructure

That is the direction the frontend hiring market has clearly moved toward from 2023–2026.
