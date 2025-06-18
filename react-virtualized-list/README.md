# Virtualized List Implementation

## Problem Statement

Create a React application to render a large list (100+ items) efficiently using virtualization. Implement two components: one using `react-virtuoso` and another built from scratch. Use TypeScript for type safety and CSS for styling.

## Requirements

- **Language**: TypeScript
- **Styling**: Pure CSS (no external libraries like Tailwind)
- **Components**:
  - `VirtuosoList`: Uses `react-virtuoso` for virtualization
  - `CustomVirtualList`: Custom virtualization logic
  - `App`: Main component to render both lists
- **Functionality**:
  - Render 1000+ items (e.g., simple text or cards)
  - Container height: 600px
  - Item height (custom): 50px (fixed for simplicity)
  - Optimize for performance (minimal DOM nodes)
- **Dependencies**: `react-virtuoso` for the library-based solution
- **Constraints**: No external CSS frameworks; ensure browser compatibility

## Implementation Details

### 1. VirtuosoList (Using `react-virtuoso`)

- **Approach**: Leverages `react-virtuoso` to handle virtualization, rendering only visible items plus a buffer.
- **Features**:
  - Supports dynamic item heights (though fixed heights used here).
  - Smooth scrolling with overscan.
  - Minimal configuration via `Virtuoso` component props (`data`, `itemContent`, `totalCount`).
- **Styling**: CSS for item padding, borders, and hover effects.
- **Props**: Accepts an array of items (`{ id: number, content: string }`).

### 2. CustomVirtualList (From Scratch)

- **Approach**: Custom logic to calculate visible items based on scroll position, item height, and container height.
- **Implementation**:
  - Tracks `scrollTop` using a `ref` on the scrollable container.
  - Calculates `startIndex` and `endIndex` with a buffer (5 items above/below).
  - Uses absolute positioning for items, with top/bottom padding to maintain scrollable height.
- **Styling**: Matches `VirtuosoList` for consistency (padding, borders, hover).
- **Props**: Accepts `items`, `itemHeight`, and `containerHeight`.

### 3. App (Main Component)

- **Purpose**: Renders both `VirtuosoList` and `CustomVirtualList` side-by-side.
- **Data**: Generates 1000 items centrally and passes to both components.
- **Layout**: Uses flexbox for responsive display (side-by-side or stacked).
- **Styling**: Minimal CSS for centering and spacing.

## Bonus Optimization Pointers

- **Dynamic Heights**: Extend `CustomVirtualList` to support variable item heights using `getBoundingClientRect` or `react-measure`.
- **Memoization**: Apply `React.memo` to list items to prevent unnecessary re-renders.
- **Debouncing**: Add debounce to scroll handler in `CustomVirtualList` for smoother performance during rapid scrolling.
- **Infinite Scroll**: Implement lazy loading for additional data on scroll end.
- **Accessibility**: Add ARIA attributes (`role="list"`, `aria-label`) for screen reader support.
- **Keyboard Navigation**: Support arrow key navigation for better UX.
- **Performance Testing**: Test with larger datasets (e.g., 10,000 items) to ensure scalability.

## Setup Instructions

1. Create a React + TypeScript project (`npx create-react-app my-app --template typescript`).
2. Install `react-virtuoso` (`npm install react-virtuoso`).
3. Add `App.tsx`, `VirtuosoList.tsx`, `CustomVirtualList.tsx`, and their CSS files to `src/`.
4. Run the app (`npm start`) and verify virtualization via browser DevTools.

## Notes

- **Performance**: Both solutions render ~15 items at a time (for 600px container), significantly reducing DOM nodes.
- **Extensibility**: Easily adapt for dynamic content or API-driven data.
- **Trade-offs**: `react-virtuoso` is simpler and production-ready; custom solution offers flexibility but requires more maintenance.
