import type { StressTestSpec } from '../types/hypermedia';

export const STRESS_TEST_SPECS: StressTestSpec[] = [
  {
    id: 'high-freq-sliders',
    index: '01',
    title: 'High-Frequency UI: Sliders, Live Math & SVG Charts',
    shortLabel: '60fps Sliders',
    frictionLevel: 'Painful',
    customJsLines: 38,
    problemSummary:
      'Budget/media-mix sliders, RM calculations, Mapbox/Leaflet panning, and chart scrubbing fire 30–60 events per second. Sending an HTMX request per tick saturates the network and feels laggy.',
    htmx4Help:
      'HTMX 4 switches to fetch() and adds hx-swap="innerMorph" so debounced server syncs no longer destroy slider focus.',
    whereCustomJsWins:
      'You still end up writing Alpine.js (or vanilla JS) to duplicate the RM math and SVG geometry locally—losing the "zero client logic" benefit on the hardest interactive widgets.',
  },
  {
    id: 'oob-fragility',
    index: '02',
    title: 'Multi-Region Sync Fragility (hx-swap-oob & <hx-partial>)',
    shortLabel: 'OOB ID Coupling',
    frictionLevel: 'High',
    customJsLines: 0,
    problemSummary:
      'When one action (like Emergency Pause) updates 4 disconnected zones—control bar, sidebar, alert banner, and uptime card—renaming a single HTML id in a template silently breaks synchronization.',
    htmx4Help:
      'HTMX 4 introduces explicit <hx-partial hx-target="..." hx-swap="..."> tags and relative selectors (closest, find) instead of overloaded hx-swap-oob attributes.',
    whereCustomJsWins:
      'Even with <hx-partial>, cross-region string IDs remain a compile-time blind spot unless you centralize ID constants in Go/Templ. React reactive state updates all 4 consumers automatically from one boolean.',
  },
  {
    id: 'media-preview',
    index: '03',
    title: 'Rich Media Previews & DOM Swap Survival',
    shortLabel: 'Media Preview',
    frictionLevel: 'High',
    customJsLines: 26,
    problemSummary:
      'Reading local image/video pixel dimensions and rendering inside an LED mockup uses browser FileReader/Canvas APIs. A naive HTMX innerHTML swap wipes that preview—forcing brittle window.__reinject hooks.',
    htmx4Help:
      'HTMX 4 bundles Idiomorph in core (hx-swap="innerMorph") plus hx-morph-skip, freezing client-owned media containers across server validation swaps without global window workarounds.',
    whereCustomJsWins:
      'For rich media timelines, crop boxes, or WebGL previews, maintaining an island with hx-morph-skip is mandatory; React owns the entire virtual DOM tree naturally without manual preservation boundaries.',
  },
  {
    id: 'session-collision',
    index: '04',
    title: 'Temporary UI State Across Users (Global vs. Session Store)',
    shortLabel: 'Multi-User State',
    frictionLevel: 'Medium-High',
    customJsLines: 0,
    problemSummary:
      'Tabs, search filters, and draft wizard inputs live in browser memory for free in React. A naive global store on an HTMX server leaks User A’s open tab and filter string straight into User B’s browser.',
    htmx4Help:
      'HTMX 4 adds hx-push-url / hx-replace-url and HX-Request-Type headers so servers know when to read/write URL query state cleanly.',
    whereCustomJsWins:
      'To avoid multi-user collisions in production, you must thread per-user session cookies, Redis keys, or URL query parameters into every partial handler—adding backend state complexity React never needs.',
  },
  {
    id: 'accessible-picker',
    index: '05',
    title: 'Third-Party UI Ecosystem (No shadcn/ui or Radix Primitives)',
    shortLabel: 'No shadcn/ui',
    frictionLevel: 'Painful',
    customJsLines: 54,
    problemSummary:
      'HTMX has no equivalent to shadcn/ui’s accessible Dialog, Combobox, Command Palette, or DateRangePicker. You have to build focus traps, keyboard roving, and ARIA attributes yourself in Alpine.js.',
    htmx4Help:
      'HTMX 4 ships hx-alpine-compat.js and official LLM skills (dist/skills/) to help generate correct markup and preserve Alpine state during morphs.',
    whereCustomJsWins:
      'Writing production-grade ARIA keyboard roving, range-hover calendars, and portal positioning by hand is where teams miss React + Radix/shadcn the most.',
  },
];
