export interface KanbanTask {
  id: string;
  title: string;
  owner: string;
  column: 'backlog' | 'review' | 'shipped';
  points: number;
}

export interface GridMember {
  id: string;
  name: string;
  role: string;
  tier: 'Core' | 'Scale' | 'Enterprise';
  monthlyRate: number;
  active: boolean;
}

export interface FeedEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  region: string;
  durationMs: number;
  timestamp: string;
  diffSummary: string;
  payloadBytes: number;
}

export interface CatalogPattern {
  id: string;
  title: string;
  layer: 'HTMX' | 'Alpine' | 'Templ';
  latencyMs: number;
  bundleKb: number;
  impactScore: number;
  summary: string;
  attributes: string;
}

export interface WizardState {
  step: 1 | 2 | 3 | 4;
  serviceName: string;
  region: string;
  replicas: string;
  memoryMb: string;
  enableSse: boolean;
}

export interface DemoStore {
  kanban: KanbanTask[];
  grid: GridMember[];
  wizard: WizardState;
  catalogLayer: string;
  catalogSort: string;
}

export function escapeHtml(input: string | number | boolean | undefined | null): string {
  const str = String(input ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SEARCH_RECORDS = [
  {
    id: 'rec-1',
    title: 'Out-of-Band Partial Swaps (hx-swap-oob)',
    category: 'HTMX 2.0 Core',
    endpoint: '/api/htmx/kanban/move',
    detail:
      'Update multiple unrelated DOM regions—like a Kanban card and its column counter—from a single server HTML response without client state stores.',
  },
  {
    id: 'rec-2',
    title: 'Type-Safe Templ Component Composition',
    category: 'Templ Compiler',
    endpoint: 'components/grid.templ',
    detail:
      'Compile HTML fragments directly into Go functions with static type checking, context propagation, and sub-50 microsecond buffer streaming.',
  },
  {
    id: 'rec-3',
    title: 'Alpine.js Ephemeral Focus & Keyboard Trap',
    category: 'Alpine 3.14',
    endpoint: 'x-data / @keydown',
    detail:
      'Handle arrow navigation, Escape dismissal, and modal focus rings locally in 12 lines of declarative attributes while HTMX fetches filtered HTML.',
  },
  {
    id: 'rec-4',
    title: 'Native Browser View Transitions',
    category: 'HTMX 2.0 Swap',
    endpoint: 'hx-swap="innerHTML transition:true"',
    detail:
      'Trigger the native document.startViewTransition() API automatically on HTMX swaps for smooth layout morphing without Framer Motion.',
  },
  {
    id: 'rec-5',
    title: 'Server-Sent Events (SSE) HTML Streaming',
    category: 'HTMX SSE Extension',
    endpoint: '/api/htmx/events',
    detail:
      'Push pre-rendered HTML fragments over standard EventSource connections so live progress bars and audit feeds update with zero JSON parsing.',
  },
  {
    id: 'rec-6',
    title: 'HX-Trigger Cross-Island Event Bus',
    category: 'HTTP Response Header',
    endpoint: 'HX-Trigger: {"notify": ...}',
    detail:
      'Emit structured DOM custom events directly from Go HTTP response headers so Alpine toast stacks react instantaneously to server mutations.',
  },
  {
    id: 'rec-7',
    title: 'Inline Row Editing via hx-patch',
    category: 'Data Grid Pattern',
    endpoint: '/api/htmx/grid/row/:id',
    detail:
      'Swap an individual table row into a validated inline form on click, persist changes via HTTP PATCH, and return both the updated row and OOB totals.',
  },
  {
    id: 'rec-8',
    title: 'Zero-Hydration First Meaningful Paint',
    category: 'Performance Metric',
    endpoint: '14.2 KB total runtime',
    detail:
      'Eliminate client hydration waterfalls. Interactive attributes activate immediately as HTML arrives from the server.',
  },
];

const FEED_EVENTS: FeedEvent[] = [
  {
    id: 'evt-101',
    actor: 'Elena Vance',
    action: 'deployed templ binary',
    target: 'edge-us-east-04',
    region: 'iad-1',
    durationMs: 14,
    timestamp: '2m ago',
    diffSummary: 'Updated billing_row.templ · Removed 48 KB client JSON mapper',
    payloadBytes: 612,
  },
  {
    id: 'evt-102',
    actor: 'Marcus Chen',
    action: 'enabled OOB counters',
    target: 'sprint-board-v2',
    region: 'fra-2',
    durationMs: 9,
    timestamp: '11m ago',
    diffSummary: 'Replaced Redux slice with hx-swap-oob="true" on column headers',
    payloadBytes: 488,
  },
  {
    id: 'evt-103',
    actor: 'Priya Nair',
    action: 'streamed SSE build log',
    target: 'release-pipeline-88',
    region: 'sin-1',
    durationMs: 18,
    timestamp: '26m ago',
    diffSummary: 'Switched polling interval to EventSource HTML fragment push',
    payloadBytes: 390,
  },
  {
    id: 'evt-104',
    actor: 'Jonah Lindqvist',
    action: 'migrated wizard validation',
    target: 'onboarding-flow',
    region: 'arn-1',
    durationMs: 11,
    timestamp: '44m ago',
    diffSummary: 'Moved Zod schema duplication into single Go validator + Templ errors',
    payloadBytes: 740,
  },
  {
    id: 'evt-105',
    actor: 'Sora Takahashi',
    action: 'activated View Transitions',
    target: 'catalog-index',
    region: 'hnd-1',
    durationMs: 7,
    timestamp: '1h ago',
    diffSummary: 'Added transition:true to faceted hx-get grid swap',
    payloadBytes: 825,
  },
  {
    id: 'evt-106',
    actor: 'David Okafor',
    action: 'audited bundle footprint',
    target: 'checkout-portal',
    region: 'lhr-1',
    durationMs: 12,
    timestamp: '2h ago',
    diffSummary: 'Reduced client JS from 184 KB to 14.2 KB gzipped',
    payloadBytes: 530,
  },
];

const CATALOG_PATTERNS: CatalogPattern[] = [
  {
    id: 'pat-1',
    title: 'Debounced Server Search',
    layer: 'HTMX',
    latencyMs: 14,
    bundleKb: 0.0,
    impactScore: 96,
    summary: 'Keystroke-debounced HTML fragment replacement with automatic request cancellation.',
    attributes: 'hx-get hx-trigger="keyup changed delay:180ms"',
  },
  {
    id: 'pat-2',
    title: 'Atomic OOB Multi-Swaps',
    layer: 'HTMX',
    latencyMs: 11,
    bundleKb: 0.0,
    impactScore: 98,
    summary: 'Synchronize headers, badges, and tables in one HTTP response without global stores.',
    attributes: 'hx-swap-oob="true"',
  },
  {
    id: 'pat-3',
    title: 'Keyboard Focus Trap',
    layer: 'Alpine',
    latencyMs: 1,
    bundleKb: 7.1,
    impactScore: 91,
    summary: 'Zero-roundtrip modal visibility, Escape dismissal, and arrow-key list traversal.',
    attributes: 'x-data x-show @keydown.escape.window',
  },
  {
    id: 'pat-4',
    title: 'Type-Safe Partial Streaming',
    layer: 'Templ',
    latencyMs: 2,
    bundleKb: 0.0,
    impactScore: 99,
    summary: 'Compile-time checked Go HTML components rendered straight to an HTTP response writer.',
    attributes: '@templ.Component(props)',
  },
  {
    id: 'pat-5',
    title: 'Optimistic Toggle & Toast Bus',
    layer: 'Alpine',
    latencyMs: 1,
    bundleKb: 0.2,
    impactScore: 93,
    summary: 'Listen to HX-Trigger response headers natively with @notify.window directives.',
    attributes: '@notify.window x-transition',
  },
  {
    id: 'pat-6',
    title: 'Context-Aware Error Boundaries',
    layer: 'Templ',
    latencyMs: 3,
    bundleKb: 0.0,
    impactScore: 95,
    summary: 'Return inline field validation partials with preserved user input and HTTP 422/200 swap.',
    attributes: 'templ.Render(ctx, w)',
  },
];

export function createInitialStore(): DemoStore {
  return {
    kanban: [
      { id: 't-1', title: 'Replace client router with hx-boost', owner: 'Elena', column: 'backlog', points: 3 },
      { id: 't-2', title: 'Stream audit logs via SSE partial', owner: 'Marcus', column: 'backlog', points: 5 },
      { id: 't-3', title: 'Add OOB counter sync to billing grid', owner: 'Priya', column: 'review', points: 2 },
      { id: 't-4', title: 'Wire Alpine command palette shortcuts', owner: 'Jonah', column: 'shipped', points: 3 },
    ],
    grid: [
      { id: 'm-1', name: 'Elena Vance', role: 'Staff Platform Eng', tier: 'Enterprise', monthlyRate: 4200, active: true },
      { id: 'm-2', name: 'Marcus Chen', role: 'Systems Architect', tier: 'Scale', monthlyRate: 2800, active: true },
      { id: 'm-3', name: 'Priya Nair', role: 'Product Designer', tier: 'Core', monthlyRate: 1650, active: true },
      { id: 'm-4', name: 'Jonah Lindqvist', role: 'Go Compiler Lead', tier: 'Enterprise', monthlyRate: 3900, active: false },
    ],
    wizard: {
      step: 1,
      serviceName: 'checkout-hypermedia',
      region: 'us-east-1',
      replicas: '3',
      memoryMb: '512',
      enableSse: true,
    },
    catalogLayer: 'All',
    catalogSort: 'impact',
  };
}

// 1. COMMAND PALETTE DEMO
export function renderCommandPaletteShell(): string {
  return `
  <div
    class="hx-enter bg-white border border-[#E2E2DE] rounded-xl overflow-hidden"
    x-data="{
      activeIndex: 0,
      selectedTitle: 'Out-of-Band Partial Swaps (hx-swap-oob)',
      move(delta) {
        const rows = this.$refs.results?.querySelectorAll('[data-cmd-row]') || [];
        if (!rows.length) return;
        this.activeIndex = (this.activeIndex + delta + rows.length) % rows.length;
      },
      selectActive() {
        const rows = this.$refs.results?.querySelectorAll('[data-cmd-row]') || [];
        if (rows[this.activeIndex]) rows[this.activeIndex].click();
      }
    }"
    @keydown.arrow-down.prevent="move(1)"
    @keydown.arrow-up.prevent="move(-1)"
    @keydown.enter.prevent="selectActive()"
  >
    <div class="px-5 py-3.5 border-b border-[#E2E2DE] flex items-center justify-between gap-4 bg-[#FAFAF8]">
      <div class="flex items-center gap-3 flex-1">
        <svg class="w-4 h-4 text-[#6B7280] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          type="search"
          name="q"
          placeholder="Search HTMX patterns, Templ directives, or endpoints (use ↑ ↓ Enter)..."
          autocomplete="off"
          class="w-full bg-transparent text-sm text-[#111214] placeholder:text-[#71717A] focus:outline-none"
          hx-get="/api/htmx/search"
          hx-trigger="keyup changed delay:160ms, search"
          hx-target="#cmd-results"
          hx-indicator="#cmd-spinner"
          @input="activeIndex = 0"
        />
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <span id="cmd-spinner" class="htmx-indicator text-xs font-mono text-[#1E40AF]">Fetching HTML...</span>
        <kbd class="text-[11px] font-mono text-[#52525B] border border-[#E2E2DE] bg-white px-2 py-0.5 rounded">↑ ↓ ↵</kbd>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E2DE]">
      <div id="cmd-results" x-ref="results" class="lg:col-span-7 divide-y divide-[#F0F0EC] max-h-[320px] overflow-y-auto">
        ${renderSearchResults('')}
      </div>
      <div id="cmd-preview" class="lg:col-span-5 p-5 bg-[#FAFAF8] flex flex-col justify-between min-h-[240px]">
        ${renderSearchPreview(SEARCH_RECORDS[0].id)}
      </div>
    </div>
  </div>
  `;
}

export function renderSearchResults(query: string): string {
  const q = query.trim().toLowerCase();
  const matches = q
    ? SEARCH_RECORDS.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.detail.toLowerCase().includes(q)
      )
    : SEARCH_RECORDS;

  if (matches.length === 0) {
    return `
      <div class="p-8 text-center">
        <p class="text-sm font-medium text-[#111214]">No hypermedia patterns match "${escapeHtml(query)}"</p>
        <p class="text-xs text-[#6B7280] mt-1">Try searching for "OOB", "Templ", "Alpine", or "SSE".</p>
      </div>
    `;
  }

  return matches
    .map(
      (item, idx) => `
      <button
        type="button"
        data-cmd-row
        hx-get="/api/htmx/search/preview/${escapeHtml(item.id)}"
        hx-target="#cmd-preview"
        hx-swap="innerHTML"
        @mouseenter="activeIndex = ${idx}"
        @click="activeIndex = ${idx}; selectedTitle = '${escapeHtml(item.title)}'"
        :class="activeIndex === ${idx} ? 'bg-[#EEF2FF]' : 'bg-white hover:bg-[#FAFAF8]'"
        class="w-full text-left px-5 py-3.5 transition-colors flex items-start justify-between gap-4 focus:outline-none"
      >
        <div class="min-w-0">
          <div class="text-sm font-medium text-[#111214] truncate">${escapeHtml(item.title)}</div>
          <div class="text-xs text-[#6B7280] mt-0.5 flex items-center gap-2">
            <span>${escapeHtml(item.category)}</span>
            <span aria-hidden="true">·</span>
            <span class="font-mono text-[11px]">${escapeHtml(item.endpoint)}</span>
          </div>
        </div>
        <span
          :class="activeIndex === ${idx} ? 'text-[#1E40AF] opacity-100' : 'text-[#9CA3AF] opacity-0'"
          class="text-xs font-mono shrink-0 mt-0.5 transition-opacity"
        >Select →</span>
      </button>
    `
    )
    .join('');
}

export function renderSearchPreview(id: string): string {
  const record = SEARCH_RECORDS.find((r) => r.id === id) || SEARCH_RECORDS[0];
  return `
    <div class="hx-enter">
      <div class="text-xs text-[#6B7280] flex items-center gap-2 mb-2">
        <span>${escapeHtml(record.category)}</span>
        <span aria-hidden="true">·</span>
        <span class="font-mono text-[#1E40AF]">${escapeHtml(record.endpoint)}</span>
      </div>
      <h4 class="text-base font-semibold text-[#111214] leading-snug">${escapeHtml(record.title)}</h4>
      <p class="text-sm text-[#4B5563] leading-relaxed mt-3">${escapeHtml(record.detail)}</p>
    </div>
    <div class="pt-4 mt-6 border-t border-[#E2E2DE] flex items-center justify-between text-xs text-[#6B7280]">
      <span>Rendered by server partial</span>
      <span class="font-mono tabular-nums">0 B client JSON</span>
    </div>
  `;
}

// 2. KANBAN BOARD WITH OOB SWAPS
function getKanbanSummary(tasks: KanbanTask[]) {
  const total = tasks.length;
  const shipped = tasks.filter((t) => t.column === 'shipped').length;
  const points = tasks.reduce((sum, t) => sum + t.points, 0);
  const pct = total === 0 ? 0 : Math.round((shipped / total) * 100);
  return { total, shipped, points, pct };
}

function renderKanbanSummaryInner(tasks: KanbanTask[]): string {
  const s = getKanbanSummary(tasks);
  return `
    <span class="font-mono tabular-nums text-[#111214] font-medium">${s.shipped}/${s.total} shipped (${s.pct}%)</span>
    <span aria-hidden="true" class="text-[#D1D5DB]">·</span>
    <span class="font-mono tabular-nums text-[#6B7280]">${s.points} story points</span>
  `;
}

function renderKanbanColumnInner(tasks: KanbanTask[], column: 'backlog' | 'review' | 'shipped'): string {
  const items = tasks.filter((t) => t.column === column);
  if (items.length === 0) {
    return `<div class="p-4 text-xs text-[#6B7280] border border-dashed border-[#D4D4CE] rounded-lg text-center">No tasks in this stage</div>`;
  }
  return items
    .map((task) => {
      const prevCol = column === 'shipped' ? 'review' : column === 'review' ? 'backlog' : null;
      const nextCol = column === 'backlog' ? 'review' : column === 'review' ? 'shipped' : null;
      return `
      <div class="bg-white border border-[#E2E2DE] rounded-lg p-3.5 transition-all">
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm font-medium text-[#111214] leading-snug">${escapeHtml(task.title)}</p>
          <button
            type="button"
            title="Delete task"
            hx-delete="/api/htmx/kanban/${escapeHtml(task.id)}"
            hx-target="#kanban-board-columns"
            hx-swap="innerHTML transition:true"
            class="text-xs text-[#6B7280] hover:text-[#DC2626] px-1.5 py-0.5 rounded transition-colors shrink-0"
          >×</button>
        </div>
        <div class="mt-3 flex items-center justify-between gap-2 text-xs text-[#6B7280]">
          <span>${escapeHtml(task.owner)} · <span class="font-mono tabular-nums">${task.points} pt</span></span>
          <div class="flex items-center gap-1.5">
            ${
              prevCol
                ? `<button
                    type="button"
                    hx-post="/api/htmx/kanban/move"
                    hx-vals='{"id":"${escapeHtml(task.id)}","to":"${prevCol}"}'
                    hx-target="#kanban-board-columns"
                    hx-swap="innerHTML transition:true"
                    class="px-2 py-1 text-xs font-medium border border-[#E2E2DE] rounded hover:bg-[#F3F3F0] text-[#374151] transition-colors whitespace-nowrap"
                  >← Back</button>`
                : ''
            }
            ${
              nextCol
                ? `<button
                    type="button"
                    hx-post="/api/htmx/kanban/move"
                    hx-vals='{"id":"${escapeHtml(task.id)}","to":"${nextCol}"}'
                    hx-target="#kanban-board-columns"
                    hx-swap="innerHTML transition:true"
                    class="px-2 py-1 text-xs font-medium bg-[#111214] text-white rounded hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
                  >Advance →</button>`
                : ''
            }
          </div>
        </div>
      </div>
      `;
    })
    .join('');
}

export function renderKanbanColumnsHtml(tasks: KanbanTask[], includeOobSummary = false): string {
  const cols: Array<{ key: 'backlog' | 'review' | 'shipped'; label: string }> = [
    { key: 'backlog', label: 'Backlog' },
    { key: 'review', label: 'In Review' },
    { key: 'shipped', label: 'Shipped' },
  ];

  const columnsHtml = cols
    .map((col) => {
      const count = tasks.filter((t) => t.column === col.key).length;
      return `
      <div class="bg-[#FAFAF8] border border-[#E2E2DE] rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold text-[#111214]">${col.label}</h4>
          <span class="text-xs font-mono tabular-nums text-[#52525B]">${count} items</span>
        </div>
        <div class="flex flex-col gap-2.5">
          ${renderKanbanColumnInner(tasks, col.key)}
        </div>
      </div>
      `;
    })
    .join('');

  const partialHtml = includeOobSummary
    ? `<hx-partial hx-target="#kanban-oob-summary" hx-swap="innerHTML">${renderKanbanSummaryInner(tasks)}</hx-partial>`
    : '';

  return columnsHtml + partialHtml;
}

export function renderKanbanShell(tasks: KanbanTask[]): string {
  return `
  <div class="hx-enter bg-white border border-[#E2E2DE] rounded-xl p-5" x-data="{ adding: false, title: '' }">
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E2E2DE]">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">Sprint Board with Out-of-Band Totals</h4>
        <div id="kanban-oob-summary" class="flex items-center gap-2 text-xs mt-1">
          ${renderKanbanSummaryInner(tasks)}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="adding = !adding"
          class="px-3.5 py-2 text-xs font-medium bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors whitespace-nowrap"
          x-text="adding ? 'Cancel' : 'Add Task'"
        >Add Task</button>
      </div>
    </div>

    <form
      x-show="adding"
      x-transition
      hx-post="/api/htmx/kanban/add"
      hx-target="#kanban-board-columns"
      hx-swap="innerHTML transition:true"
      @kanban-added.window="title = ''; adding = false;"
      class="mb-5 p-4 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg flex flex-wrap items-end gap-3"
    >
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-[#374151] mb-1">Task Title</label>
        <input
          type="text"
          name="title"
          x-model="title"
          required
          placeholder="e.g., Implement hx-preserve on video player"
          class="w-full px-3 py-2 text-sm bg-white border border-[#D4D4CE] rounded-md focus:outline-none focus:border-[#1E40AF]"
        />
      </div>
      <div class="w-32">
        <label class="block text-xs font-medium text-[#374151] mb-1">Owner</label>
        <input
          type="text"
          name="owner"
          value="Alex"
          class="w-full px-3 py-2 text-sm bg-white border border-[#D4D4CE] rounded-md focus:outline-none focus:border-[#1E40AF]"
        />
      </div>
      <div class="w-24">
        <label class="block text-xs font-medium text-[#374151] mb-1">Points</label>
        <select name="points" class="w-full px-3 py-2 text-sm bg-white border border-[#D4D4CE] rounded-md focus:outline-none focus:border-[#1E40AF]">
          <option value="1">1 pt</option>
          <option value="3" selected>3 pt</option>
          <option value="5">5 pt</option>
        </select>
      </div>
      <button
        type="submit"
        class="px-4 py-2 text-xs font-medium bg-[#111214] text-white rounded-md hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
      >Save Task</button>
    </form>

    <div id="kanban-board-columns" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${renderKanbanColumnsHtml(tasks, false)}
    </div>
  </div>
  `;
}

// 3. INLINE-EDIT DATA GRID + BULK ACTIONS
function getGridSummary(members: GridMember[]): string {
  const activeCount = members.filter((m) => m.active).length;
  const totalMrr = members.filter((m) => m.active).reduce((sum, m) => sum + m.monthlyRate, 0);
  return `
    <span class="font-mono tabular-nums text-[#111214] font-medium">${activeCount} active seats</span>
    <span aria-hidden="true" class="text-[#D1D5DB]">·</span>
    <span class="font-mono tabular-nums text-[#1E40AF] font-medium">$${totalMrr.toLocaleString('en-US')}/mo committed</span>
  `;
}

export function renderGridRow(member: GridMember): string {
  const statusText = member.active ? 'Active' : 'Paused';
  const statusClass = member.active ? 'text-[#0F766E]' : 'text-[#6B7280]';
  return `
  <tr id="grid-row-${escapeHtml(member.id)}" class="hover:bg-[#FAFAF8] transition-colors">
    <td class="py-3 px-4">
      <input
        type="checkbox"
        name="selectedIds"
        value="${escapeHtml(member.id)}"
        x-model="selected"
        aria-label="Select ${escapeHtml(member.name)}"
        class="w-4 h-4 rounded border-[#D4D4CE] text-[#1E40AF] focus:ring-[#1E40AF]"
      />
    </td>
    <td class="py-3 px-4 text-sm font-medium text-[#111214]">${escapeHtml(member.name)}</td>
    <td class="py-3 px-4 text-sm text-[#4B5563]">${escapeHtml(member.role)}</td>
    <td class="py-3 px-4 text-xs text-[#52525B]">${escapeHtml(member.tier)}</td>
    <td class="py-3 px-4 text-sm font-mono tabular-nums text-[#111214] text-right">$${member.monthlyRate.toLocaleString('en-US')}</td>
    <td class="py-3 px-4 text-xs font-medium ${statusClass}">${statusText}</td>
    <td class="py-3 px-4 text-right">
      <button
        type="button"
        hx-get="/api/htmx/grid/edit/${escapeHtml(member.id)}"
        hx-target="#grid-row-${escapeHtml(member.id)}"
        hx-swap="outerHTML"
        class="px-2.5 py-1 text-xs font-medium border border-[#E2E2DE] rounded-md text-[#111214] hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors whitespace-nowrap"
      >Edit Row</button>
    </td>
  </tr>
  `;
}

export function renderGridEditRow(member: GridMember): string {
  const formId = `edit-form-${escapeHtml(member.id)}`;
  return `
  <tr id="grid-row-${escapeHtml(member.id)}" class="bg-[#EEF2FF]/60">
    <td class="py-2.5 px-4">
      <span class="text-xs font-mono text-[#1E40AF]">Edit</span>
    </td>
    <td class="py-2.5 px-4 text-sm font-medium text-[#111214]">
      ${escapeHtml(member.name)}
      <form id="${formId}" hx-patch="/api/htmx/grid/row/${escapeHtml(member.id)}" hx-target="#grid-row-${escapeHtml(member.id)}" hx-swap="outerHTML"></form>
    </td>
    <td class="py-2.5 px-4">
      <input
        form="${formId}"
        type="text"
        name="role"
        value="${escapeHtml(member.role)}"
        required
        class="w-full px-2.5 py-1.5 text-xs bg-white border border-[#1E40AF] rounded focus:outline-none"
      />
    </td>
    <td class="py-2.5 px-4">
      <select form="${formId}" name="tier" class="px-2 py-1.5 text-xs bg-white border border-[#D4D4CE] rounded focus:outline-none">
        <option value="Core" ${member.tier === 'Core' ? 'selected' : ''}>Core</option>
        <option value="Scale" ${member.tier === 'Scale' ? 'selected' : ''}>Scale</option>
        <option value="Enterprise" ${member.tier === 'Enterprise' ? 'selected' : ''}>Enterprise</option>
      </select>
    </td>
    <td class="py-2.5 px-4 text-right">
      <input
        form="${formId}"
        type="number"
        name="monthlyRate"
        value="${member.monthlyRate}"
        min="100"
        step="50"
        class="w-24 px-2.5 py-1.5 text-xs font-mono tabular-nums text-right bg-white border border-[#D4D4CE] rounded focus:outline-none"
      />
    </td>
    <td class="py-2.5 px-4">
      <select form="${formId}" name="active" class="px-2 py-1.5 text-xs bg-white border border-[#D4D4CE] rounded focus:outline-none">
        <option value="true" ${member.active ? 'selected' : ''}>Active</option>
        <option value="false" ${!member.active ? 'selected' : ''}>Paused</option>
      </select>
    </td>
    <td class="py-2.5 px-4 text-right">
      <div class="inline-flex items-center gap-1.5">
        <button
          form="${formId}"
          type="submit"
          class="px-2.5 py-1 text-xs font-medium bg-[#1E40AF] text-white rounded hover:bg-[#1E3A8A] transition-colors whitespace-nowrap"
        >Save</button>
        <button
          type="button"
          hx-get="/api/htmx/grid/row/${escapeHtml(member.id)}"
          hx-target="#grid-row-${escapeHtml(member.id)}"
          hx-swap="outerHTML"
          class="px-2.5 py-1 text-xs font-medium border border-[#D4D4CE] bg-white text-[#374151] rounded hover:bg-[#F3F3F0] transition-colors whitespace-nowrap"
        >Cancel</button>
      </div>
    </td>
  </tr>
  `;
}

export function renderGridBodyAndOob(members: GridMember[], includeOob = false): string {
  const rows = members.map(renderGridRow).join('');
  const partial = includeOob
    ? `<hx-partial hx-target="#grid-oob-totals" hx-swap="innerHTML">${getGridSummary(members)}</hx-partial>`
    : '';
  return rows + partial;
}

export function renderGridShell(members: GridMember[]): string {
  return `
  <div class="hx-enter bg-white border border-[#E2E2DE] rounded-xl overflow-hidden" x-data="{ selected: [] }" @grid-bulk-done.window="selected = []">
    <div class="px-5 py-4 border-b border-[#E2E2DE] flex flex-wrap items-center justify-between gap-4 bg-[#FAFAF8]">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">Inline-Edit Billing Grid</h4>
        <div id="grid-oob-totals" class="flex items-center gap-2 text-xs mt-1">
          ${getGridSummary(members)}
        </div>
      </div>
      <div class="flex items-center gap-2" x-show="selected.length > 0" x-transition>
        <span class="text-xs font-mono text-[#52525B]" x-text="selected.length + ' selected'"></span>
        <button
          type="button"
          hx-post="/api/htmx/grid/bulk"
          hx-include="#grid-table-body input[name='selectedIds']"
          hx-vals='{"action":"activate"}'
          hx-target="#grid-table-body"
          hx-swap="innerHTML"
          class="px-3 py-1.5 text-xs font-medium bg-[#111214] text-white rounded-md hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
        >Set Active</button>
        <button
          type="button"
          hx-post="/api/htmx/grid/bulk"
          hx-include="#grid-table-body input[name='selectedIds']"
          hx-vals='{"action":"pause"}'
          hx-target="#grid-table-body"
          hx-swap="innerHTML"
          class="px-3 py-1.5 text-xs font-medium border border-[#D4D4CE] bg-white text-[#111214] rounded-md hover:bg-[#F3F3F0] transition-colors whitespace-nowrap"
        >Pause Selected</button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-[#E2E2DE] text-xs font-medium text-[#6B7280] bg-white">
            <th class="py-3 px-4 w-10"></th>
            <th class="py-3 px-4">Engineer</th>
            <th class="py-3 px-4">Role</th>
            <th class="py-3 px-4">Tier</th>
            <th class="py-3 px-4 text-right">Monthly Rate</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody id="grid-table-body" class="divide-y divide-[#F0F0EC]">
          ${renderGridBodyAndOob(members, false)}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

// 4. SERVER-VALIDATED MULTI-STEP WIZARD
export function renderWizardHtml(state: WizardState, errors: Record<string, string> = {}): string {
  const stepLabels = ['1. Service Identity', '2. Cluster Sizing', '3. Review & Launch'];

  const stepHeader = `
    <div class="px-5 py-4 border-b border-[#E2E2DE] bg-[#FAFAF8] flex flex-wrap items-center justify-between gap-4">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">Server-Validated Deployment Wizard</h4>
        <p class="text-xs text-[#6B7280] mt-0.5">Validation rules live once in Go; Templ returns inline field errors on POST.</p>
      </div>
      <div class="flex items-center gap-3 text-xs">
        ${stepLabels
          .map((label, idx) => {
            const num = idx + 1;
            const active = state.step === num;
            const done = state.step > num;
            return `<span class="${
              active
                ? 'text-[#1E40AF] font-semibold'
                : done
                ? 'text-[#0F766E] font-medium'
                : 'text-[#9CA3AF]'
            } whitespace-nowrap">${label}</span>`;
          })
          .join('<span class="text-[#D1D5DB]">/</span>')}
      </div>
    </div>
  `;

  if (state.step === 4) {
    return `
      <div id="wizard-frame" class="hx-enter bg-white border border-[#E2E2DE] rounded-xl overflow-hidden">
        ${stepHeader}
        <div class="p-8 text-center max-w-lg mx-auto">
          <div class="text-xs font-mono text-[#0F766E] mb-2">Deployment Manifest Confirmed</div>
          <h4 class="text-xl font-semibold text-[#111214]">${escapeHtml(state.serviceName)} is queued for ${escapeHtml(state.region)}</h4>
          <p class="text-sm text-[#4B5563] mt-2">
            Provisioning ${escapeHtml(state.replicas)} Go+Templ replicas (${escapeHtml(state.memoryMb)} MB RAM each)${
              state.enableSse ? ' with live SSE telemetry enabled' : ''
            }.
          </p>
          <button
            type="button"
            hx-post="/api/htmx/wizard/reset"
            hx-target="#wizard-frame"
            hx-swap="outerHTML"
            class="mt-6 px-4 py-2 text-xs font-medium bg-[#111214] text-white rounded-lg hover:bg-[#1E40AF] transition-colors"
          >Run Another Manifest</button>
        </div>
      </div>
    `;
  }

  if (state.step === 1) {
    return `
      <div id="wizard-frame" class="hx-enter bg-white border border-[#E2E2DE] rounded-xl overflow-hidden">
        ${stepHeader}
        <form hx-post="/api/htmx/wizard/step" hx-target="#wizard-frame" hx-swap="outerHTML" class="p-6 space-y-5">
          <input type="hidden" name="currentStep" value="1" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-medium text-[#111214] mb-1.5">Service Slug (lowercase, min 4 chars)</label>
              <input
                type="text"
                name="serviceName"
                value="${escapeHtml(state.serviceName)}"
                class="w-full px-3.5 py-2.5 text-sm bg-white border ${
                  errors.serviceName ? 'border-[#DC2626]' : 'border-[#D4D4CE]'
                } rounded-lg focus:outline-none focus:border-[#1E40AF]"
              />
              ${
                errors.serviceName
                  ? `<p class="text-xs text-[#DC2626] mt-1.5">${escapeHtml(errors.serviceName)}</p>`
                  : `<p class="text-xs text-[#6B7280] mt-1.5">Clear the input or type spaces to test server validation.</p>`
              }
            </div>
            <div>
              <label class="block text-xs font-medium text-[#111214] mb-1.5">Primary Cloud Region</label>
              <select name="region" class="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D4D4CE] rounded-lg focus:outline-none focus:border-[#1E40AF]">
                <option value="us-east-1" ${state.region === 'us-east-1' ? 'selected' : ''}>us-east-1 (Virginia)</option>
                <option value="eu-central-1" ${state.region === 'eu-central-1' ? 'selected' : ''}>eu-central-1 (Frankfurt)</option>
                <option value="ap-northeast-1" ${state.region === 'ap-northeast-1' ? 'selected' : ''}>ap-northeast-1 (Tokyo)</option>
              </select>
            </div>
          </div>
          <div class="pt-3 border-t border-[#F0F0EC] flex justify-end">
            <button type="submit" class="px-5 py-2.5 text-xs font-medium bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors">
              Continue to Sizing →
            </button>
          </div>
        </form>
      </div>
    `;
  }

  if (state.step === 2) {
    return `
      <div id="wizard-frame" class="hx-enter bg-white border border-[#E2E2DE] rounded-xl overflow-hidden">
        ${stepHeader}
        <form hx-post="/api/htmx/wizard/step" hx-target="#wizard-frame" hx-swap="outerHTML" class="p-6 space-y-5">
          <input type="hidden" name="currentStep" value="2" />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label class="block text-xs font-medium text-[#111214] mb-1.5">Replicas (1–16)</label>
              <input
                type="number"
                name="replicas"
                value="${escapeHtml(state.replicas)}"
                class="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border ${
                  errors.replicas ? 'border-[#DC2626]' : 'border-[#D4D4CE]'
                } rounded-lg focus:outline-none focus:border-[#1E40AF]"
              />
              ${errors.replicas ? `<p class="text-xs text-[#DC2626] mt-1.5">${escapeHtml(errors.replicas)}</p>` : ''}
            </div>
            <div>
              <label class="block text-xs font-medium text-[#111214] mb-1.5">Memory per Instance</label>
              <select name="memoryMb" class="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-[#D4D4CE] rounded-lg focus:outline-none focus:border-[#1E40AF]">
                <option value="256" ${state.memoryMb === '256' ? 'selected' : ''}>256 MB</option>
                <option value="512" ${state.memoryMb === '512' ? 'selected' : ''}>512 MB</option>
                <option value="1024" ${state.memoryMb === '1024' ? 'selected' : ''}>1024 MB</option>
              </select>
            </div>
            <div class="flex items-end pb-2">
              <label class="flex items-center gap-2.5 text-sm text-[#111214] cursor-pointer">
                <input type="checkbox" name="enableSse" value="true" ${state.enableSse ? 'checked' : ''} class="w-4 h-4 rounded border-[#D4D4CE] text-[#1E40AF]" />
                <span>Enable SSE HTML Streaming</span>
              </label>
            </div>
          </div>
          <div class="pt-3 border-t border-[#F0F0EC] flex items-center justify-between">
            <button
              type="button"
              hx-post="/api/htmx/wizard/step"
              hx-vals='{"currentStep":"2","direction":"back"}'
              hx-target="#wizard-frame"
              hx-swap="outerHTML"
              class="px-4 py-2 text-xs font-medium border border-[#D4D4CE] text-[#111214] rounded-lg hover:bg-[#FAFAF8] transition-colors"
            >← Back</button>
            <button type="submit" class="px-5 py-2.5 text-xs font-medium bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors">
              Review Manifest →
            </button>
          </div>
        </form>
      </div>
    `;
  }

  return `
    <div id="wizard-frame" class="hx-enter bg-white border border-[#E2E2DE] rounded-xl overflow-hidden">
      ${stepHeader}
      <form hx-post="/api/htmx/wizard/step" hx-target="#wizard-frame" hx-swap="outerHTML" class="p-6 space-y-5">
        <input type="hidden" name="currentStep" value="3" />
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg text-sm">
          <div>
            <div class="text-xs text-[#6B7280]">Service</div>
            <div class="font-mono font-medium text-[#111214] mt-0.5">${escapeHtml(state.serviceName)}</div>
          </div>
          <div>
            <div class="text-xs text-[#6B7280]">Region</div>
            <div class="font-mono font-medium text-[#111214] mt-0.5">${escapeHtml(state.region)}</div>
          </div>
          <div>
            <div class="text-xs text-[#6B7280]">Capacity</div>
            <div class="font-mono tabular-nums font-medium text-[#111214] mt-0.5">${escapeHtml(state.replicas)} × ${escapeHtml(state.memoryMb)} MB</div>
          </div>
          <div>
            <div class="text-xs text-[#6B7280]">Streaming</div>
            <div class="font-mono font-medium text-[#111214] mt-0.5">${state.enableSse ? 'SSE Active' : 'Standard'}</div>
          </div>
        </div>
        <div class="pt-3 border-t border-[#F0F0EC] flex items-center justify-between">
          <button
            type="button"
            hx-post="/api/htmx/wizard/step"
            hx-vals='{"currentStep":"3","direction":"back"}'
            hx-target="#wizard-frame"
            hx-swap="outerHTML"
            class="px-4 py-2 text-xs font-medium border border-[#D4D4CE] text-[#111214] rounded-lg hover:bg-[#FAFAF8] transition-colors"
          >← Back</button>
          <button type="submit" class="px-5 py-2.5 text-xs font-medium bg-[#111214] text-white rounded-lg hover:bg-[#1E40AF] transition-colors">
            Confirm & Launch
          </button>
        </div>
      </form>
    </div>
  `;
}

// 5. LIVE SSE STREAM + HX-TRIGGER TOAST STACK
export function renderSseDemoShell(): string {
  return `
  <div
    class="hx-enter bg-white border border-[#E2E2DE] rounded-xl p-5 relative"
    x-data="{
      toasts: [],
      streaming: false,
      source: null,
      addToast(detail) {
        const id = Date.now() + Math.random();
        this.toasts.push({ id, title: detail.title || 'Server Event', message: detail.message || '' });
        setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 3600);
      },
      startStream() {
        if (this.source) this.source.close();
        this.streaming = true;
        const container = document.getElementById('sse-log-rows');
        container.innerHTML = '';
        this.source = new EventSource('/api/htmx/events');
        this.source.addEventListener('step', (e) => {
          container.insertAdjacentHTML('beforeend', e.data);
        });
        this.source.addEventListener('done', (e) => {
          document.getElementById('sse-progress-box').innerHTML = e.data;
          this.streaming = false;
          this.source.close();
          this.source = null;
          this.addToast({ title: 'Pipeline Complete', message: '4 Templ partials streamed over EventSource.' });
        });
        this.source.addEventListener('progress', (e) => {
          document.getElementById('sse-progress-box').innerHTML = e.data;
        });
      }
    }"
    @notify.window="addToast($event.detail)"
  >
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E2DE]">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">Live SSE HTML Stream & HX-Trigger Toast Bus</h4>
        <p class="text-xs text-[#6B7280] mt-0.5">Server pushes compiled HTML chunks over EventSource while HX-Trigger headers drive Alpine notifications.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          hx-post="/api/htmx/toast-ping"
          hx-swap="none"
          class="px-3.5 py-2 text-xs font-medium border border-[#D4D4CE] bg-white text-[#111214] rounded-lg hover:bg-[#FAFAF8] transition-colors whitespace-nowrap"
        >Fire HX-Trigger Toast</button>
        <button
          type="button"
          @click="startStream()"
          :disabled="streaming"
          class="px-4 py-2 text-xs font-medium bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] disabled:opacity-50 transition-colors whitespace-nowrap"
          x-text="streaming ? 'Streaming HTML...' : 'Start SSE Pipeline'"
        >Start SSE Pipeline</button>
      </div>
    </div>

    <div id="sse-progress-box" class="mt-4">
      <div class="flex items-center justify-between text-xs text-[#6B7280] mb-1.5">
        <span>Pipeline idle</span>
        <span class="font-mono tabular-nums">0%</span>
      </div>
      <div class="w-full h-2 bg-[#EFEFED] rounded-full overflow-hidden">
        <div class="h-full bg-[#1E40AF] w-0 transition-all duration-300"></div>
      </div>
    </div>

    <div id="sse-log-rows" class="mt-4 divide-y divide-[#F0F0EC] border border-[#E2E2DE] rounded-lg bg-[#FAFAF8] min-h-[140px]">
      <div class="p-6 text-center text-xs text-[#6B7280]">
        Click "Start SSE Pipeline" to stream live server-rendered HTML log rows, or "Fire HX-Trigger Toast" to see response headers trigger Alpine.
      </div>
    </div>

    <!-- Alpine Toast Stack -->
    <div class="mt-4 space-y-2" aria-live="polite">
      <template x-for="toast in toasts" :key="toast.id">
        <div
          x-transition
          class="flex items-center justify-between gap-4 px-4 py-2.5 bg-[#111214] text-white rounded-lg text-xs"
        >
          <div>
            <span class="font-semibold" x-text="toast.title"></span>
            <span class="text-[#A1A1AA] ml-2" x-text="toast.message"></span>
          </div>
          <button type="button" @click="toasts = toasts.filter(t => t.id !== toast.id)" class="text-[#A1A1AA] hover:text-white">×</button>
        </div>
      </template>
    </div>
  </div>
  `;
}

// 6. CURSOR PAGINATED FEED + SLIDE-OVER DRAWER
export function renderFeedBatch(cursor: number): string {
  const pageSize = 3;
  const slice = FEED_EVENTS.slice(cursor, cursor + pageSize);
  const nextCursor = cursor + pageSize;
  const hasMore = nextCursor < FEED_EVENTS.length;

  const rowsHtml = slice
    .map(
      (evt) => `
      <div class="hx-enter px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAFAF8] transition-colors">
        <div class="min-w-0">
          <div class="text-sm text-[#111214]">
            <span class="font-medium">${escapeHtml(evt.actor)}</span>
            <span class="text-[#4B5563]"> ${escapeHtml(evt.action)} </span>
            <span class="font-mono text-xs text-[#1E40AF]">${escapeHtml(evt.target)}</span>
          </div>
          <div class="text-xs text-[#6B7280] mt-0.5 flex items-center gap-2">
            <span>${escapeHtml(evt.region)}</span>
            <span aria-hidden="true">·</span>
            <span class="font-mono tabular-nums">${evt.durationMs} ms</span>
            <span aria-hidden="true">·</span>
            <span>${escapeHtml(evt.timestamp)}</span>
          </div>
        </div>
        <button
          type="button"
          hx-get="/api/htmx/feed/item/${escapeHtml(evt.id)}"
          hx-target="#drawer-content"
          hx-swap="innerHTML"
          @click="drawerOpen = true"
          class="px-3 py-1.5 text-xs font-medium border border-[#E2E2DE] rounded-md text-[#111214] hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors whitespace-nowrap shrink-0"
        >Inspect Event</button>
      </div>
    `
    )
    .join('');

  const loadMoreHtml = hasMore
    ? `
      <div id="feed-more-trigger" class="p-4 text-center bg-[#FAFAF8]">
        <button
          type="button"
          hx-get="/api/htmx/feed/page?cursor=${nextCursor}"
          hx-target="#feed-more-trigger"
          hx-swap="outerHTML"
          class="px-4 py-2 text-xs font-medium border border-[#D4D4CE] bg-white text-[#111214] rounded-lg hover:border-[#1E40AF] transition-colors"
        >Load Older Audit Events (${FEED_EVENTS.length - nextCursor} remaining)</button>
      </div>
    `
    : `<div class="p-3 text-center text-xs text-[#6B7280] bg-[#FAFAF8]">All ${FEED_EVENTS.length} audit events loaded</div>`;

  return rowsHtml + loadMoreHtml;
}

export function renderFeedDrawerDetail(id: string): string {
  const evt = FEED_EVENTS.find((e) => e.id === id) || FEED_EVENTS[0];
  return `
    <div class="hx-enter space-y-5">
      <div>
        <div class="text-xs text-[#6B7280] flex items-center gap-2">
          <span class="font-mono">${escapeHtml(evt.id)}</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHtml(evt.timestamp)}</span>
        </div>
        <h4 class="text-lg font-semibold text-[#111214] mt-1">${escapeHtml(evt.actor)} — ${escapeHtml(evt.action)}</h4>
      </div>
      <div class="grid grid-cols-2 gap-3 p-4 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg text-xs">
        <div>
          <span class="text-[#6B7280] block">Target Cluster</span>
          <span class="font-mono text-[#111214] font-medium mt-0.5 block">${escapeHtml(evt.target)}</span>
        </div>
        <div>
          <span class="text-[#6B7280] block">Swap Duration</span>
          <span class="font-mono tabular-nums text-[#111214] font-medium mt-0.5 block">${evt.durationMs} ms (${evt.payloadBytes} B)</span>
        </div>
      </div>
      <div>
        <div class="text-xs font-medium text-[#111214] mb-1.5">Engineering Diff Note</div>
        <p class="text-sm text-[#4B5563] leading-relaxed">${escapeHtml(evt.diffSummary)}</p>
      </div>
    </div>
  `;
}

export function renderDrawerFeedShell(): string {
  return `
  <div
    class="hx-enter bg-white border border-[#E2E2DE] rounded-xl overflow-hidden relative"
    x-data="{ drawerOpen: false }"
    @keydown.escape.window="drawerOpen = false"
  >
    <div class="px-5 py-4 border-b border-[#E2E2DE] bg-[#FAFAF8] flex items-center justify-between">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">Cursor-Paginated Audit Feed & Slide-Over Drawer</h4>
        <p class="text-xs text-[#6B7280] mt-0.5">HTMX appends partial batches seamlessly while Alpine animates the slide-over inspector.</p>
      </div>
    </div>

    <div id="feed-list" class="divide-y divide-[#F0F0EC]">
      ${renderFeedBatch(0)}
    </div>

    <!-- Alpine Slide-Over Backdrop & Panel -->
    <div
      x-show="drawerOpen"
      x-transition.opacity
      @click="drawerOpen = false"
      class="fixed inset-0 bg-black/30 z-40"
      style="display: none;"
    ></div>
    <aside
      x-show="drawerOpen"
      x-transition:enter="transition ease-out duration-200"
      x-transition:enter-start="translate-x-full"
      x-transition:enter-end="translate-x-0"
      x-transition:leave="transition ease-in duration-150"
      x-transition:leave-start="translate-x-0"
      x-transition:leave-end="translate-x-full"
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-[#E2E2DE] z-50 p-6 flex flex-col justify-between shadow-xl"
      style="display: none;"
    >
      <div>
        <div class="flex items-center justify-between pb-4 mb-5 border-b border-[#E2E2DE]">
          <span class="text-xs font-mono text-[#6B7280]">Server-Rendered Detail Drawer</span>
          <button
            type="button"
            @click="drawerOpen = false"
            class="px-2.5 py-1 text-xs font-medium border border-[#E2E2DE] rounded-md hover:bg-[#FAFAF8]"
          >Close</button>
        </div>
        <div id="drawer-content">
          <p class="text-xs text-[#6B7280]">Loading fragment...</p>
        </div>
      </div>
      <div class="pt-4 border-t border-[#E2E2DE] text-xs text-[#6B7280]">
        Press Esc or click outside to close
      </div>
    </aside>
  </div>
  `;
}

// 7. FACETED FILTER + VIEW TRANSITIONS
export function renderCatalogCards(layer: string, sort: string): string {
  let items = layer === 'All' ? [...CATALOG_PATTERNS] : CATALOG_PATTERNS.filter((p) => p.layer === layer);
  if (sort === 'latency') {
    items.sort((a, b) => a.latencyMs - b.latencyMs);
  } else if (sort === 'bundle') {
    items.sort((a, b) => a.bundleKb - b.bundleKb);
  } else {
    items.sort((a, b) => b.impactScore - a.impactScore);
  }

  return items
    .map(
      (p) => `
      <div class="bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg p-4 flex flex-col justify-between" style="view-transition-name: card-${p.id}">
        <div>
          <div class="text-xs text-[#6B7280] flex items-center justify-between gap-2 mb-2">
            <span>${escapeHtml(p.layer)} Layer</span>
            <span class="font-mono tabular-nums">${p.latencyMs} ms · ${p.bundleKb.toFixed(1)} KB</span>
          </div>
          <h5 class="text-sm font-semibold text-[#111214]">${escapeHtml(p.title)}</h5>
          <p class="text-xs text-[#4B5563] leading-relaxed mt-1.5">${escapeHtml(p.summary)}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-[#E2E2DE] font-mono text-[11px] text-[#1E40AF] truncate">
          ${escapeHtml(p.attributes)}
        </div>
      </div>
    `
    )
    .join('');
}

export function renderCatalogShell(layer: string, sort: string): string {
  const layers = ['All', 'HTMX', 'Alpine', 'Templ'];
  return `
  <div class="hx-enter bg-white border border-[#E2E2DE] rounded-xl p-5" x-data="{ activeLayer: '${escapeHtml(layer)}' }">
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E2E2DE]">
      <div class="flex items-center gap-1 p-1 bg-[#F3F3F0] rounded-lg">
        ${layers
          .map(
            (l) => `
          <button
            type="button"
            hx-get="/api/htmx/catalog"
            hx-vals='js:{layer: "${l}", sort: document.getElementById("catalog-sort-select").value}'
            hx-target="#catalog-grid"
            hx-swap="innerHTML transition:true"
            @click="activeLayer = '${l}'"
            :class="activeLayer === '${l}' ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B] hover:text-[#111214]'"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
          >${l}</button>
        `
          )
          .join('')}
      </div>
      <div class="flex items-center gap-2">
        <label for="catalog-sort-select" class="text-xs text-[#6B7280]">Sort by</label>
        <select
          id="catalog-sort-select"
          name="sort"
          hx-get="/api/htmx/catalog"
          hx-vals='js:{layer: document.querySelector("[data-active-layer]")?.dataset.activeLayer || "All"}'
          hx-include="this"
          hx-target="#catalog-grid"
          hx-swap="innerHTML transition:true"
          :data-active-layer="activeLayer"
          class="px-3 py-1.5 text-xs bg-white border border-[#D4D4CE] rounded-md text-[#111214] focus:outline-none focus:border-[#1E40AF]"
        >
          <option value="impact" ${sort === 'impact' ? 'selected' : ''}>Impact</option>
          <option value="latency" ${sort === 'latency' ? 'selected' : ''}>Lowest Latency</option>
          <option value="bundle" ${sort === 'bundle' ? 'selected' : ''}>Smallest Bundle</option>
        </select>
      </div>
    </div>

    <div id="catalog-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${renderCatalogCards(layer, sort)}
    </div>
  </div>
  `;
}

export function renderDemoById(id: string, store: DemoStore): string {
  switch (id) {
    case 'command-palette':
      return renderCommandPaletteShell();
    case 'kanban-oob':
      return renderKanbanShell(store.kanban);
    case 'inline-grid':
      return renderGridShell(store.grid);
    case 'wizard-form':
      return renderWizardHtml(store.wizard);
    case 'sse-stream':
      return renderSseDemoShell();
    case 'drawer-feed':
      return renderDrawerFeedShell();
    case 'faceted-morph':
      return renderCatalogShell(store.catalogLayer, store.catalogSort);
    default:
      return renderCommandPaletteShell();
  }
}
