import type { ComponentSpec, StressTestSpec } from '../types/hypermedia';

export const COMPONENT_SPECS: ComponentSpec[] = [
  {
    id: 'command-palette',
    index: '01',
    title: 'Command Palette & Instant Search',
    shortLabel: 'Command Palette',
    summary:
      'Keystroke-debounced server search powered by hx-get while Alpine.js manages arrow-key traversal and Enter selection with zero client-side search index.',
    htmxFeatures: ['hx-get', 'hx-trigger="keyup changed delay:160ms"', 'hx-indicator', 'hx-target'],
    alpineFeatures: ['x-data', '@keydown.arrow-down.prevent', '@keydown.enter.prevent', ':class'],
    templFileName: 'components/command_palette.templ',
    templLines: 38,
    reactLines: 142,
    clientJsSavedKb: '34 KB',
    templCode: `package components

templ CommandPalette(initial []PatternRecord) {
  <div
    x-data="{ activeIndex: 0, move(d) { ... } }"
    @keydown.arrow-down.prevent="move(1)"
    @keydown.arrow-up.prevent="move(-1)"
    @keydown.enter.prevent="selectActive()"
    class="bg-white border border-stone-200 rounded-xl overflow-hidden"
  >
    <input
      type="search"
      name="q"
      hx-get="/api/htmx/search"
      hx-trigger="keyup changed delay:160ms, search"
      hx-target="#cmd-results"
      hx-indicator="#cmd-spinner"
      @input="activeIndex = 0"
    />
    <div class="grid grid-cols-12">
      <div id="cmd-results" x-ref="results" class="col-span-7">
        @SearchResults(initial)
      </div>
      <div id="cmd-preview" class="col-span-5">
        @SearchPreview(initial[0])
      </div>
    </div>
  </div>
}

templ SearchResults(items []PatternRecord) {
  for i, item := range items {
    <button
      hx-get={ "/api/htmx/search/preview/" + item.ID }
      hx-target="#cmd-preview"
      :class={ fmt.Sprintf("activeIndex === %d ? 'bg-indigo-50' : 'bg-white'", i) }
    >
      <span>{ item.Title }</span>
      <span class="text-xs text-stone-500">{ item.Category }</span>
    </button>
  }
}`,
    reactEquivalentCode: `// React + TanStack Query + Fuse.js (~142 lines)
const [query, setQuery] = useState("");
const [activeIndex, setActiveIndex] = useState(0);
const [selectedId, setSelectedId] = useState(null);

const debouncedQuery = useDebounce(query, 160);
const { data, isFetching } = useQuery({
  queryKey: ["search", debouncedQuery],
  queryFn: ({ signal }) =>
    fetch(\`/api/search?q=\${debouncedQuery}\`, { signal }).then(r => r.json()),
});

useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { /* clamp + update state */ }
    if (e.key === "ArrowUp") { /* clamp + update state */ }
    if (e.key === "Enter") { setSelectedId(data[activeIndex]?.id); }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [data, activeIndex]);

// Plus JSON serializer on Go backend + TypeScript DTOs + detail query`,
  },
  {
    id: 'kanban-oob',
    index: '02',
    title: 'Kanban Board with HTMX 4 <hx-partial> Totals',
    shortLabel: 'Kanban + Partial',
    summary:
      'Moving or deleting a task dispatches one fetch() POST. Templ returns the updated columns plus an explicit HTMX 4 <hx-partial> header summary so counters stay synchronized.',
    htmxFeatures: ['hx-post', 'hx-delete', 'hx-vals', '<hx-partial>', 'transition:true'],
    alpineFeatures: ['x-data="{ adding: false }"', 'x-show', 'x-transition', '@kanban-added.window'],
    templFileName: 'components/kanban_board.templ',
    templLines: 44,
    reactLines: 176,
    clientJsSavedKb: '46 KB',
    templCode: `package components

templ KanbanMoveResponse(tasks []KanbanTask) {
  // Primary swap target: #kanban-board-columns
  for _, col := range []string{"backlog", "review", "shipped"} {
    @KanbanColumn(col, filterByColumn(tasks, col))
  }

  // HTMX 4 explicit partial swap: updates header summary anywhere in DOM
  <hx-partial hx-target="#kanban-oob-summary" hx-swap="innerHTML">
    <span>{ formatShippedSummary(tasks) }</span>
    <span>·</span>
    <span>{ formatPoints(tasks) } story points</span>
  </hx-partial>
}

templ KanbanCard(t KanbanTask) {
  <div class="bg-white border border-stone-200 rounded-lg p-3.5">
    <p>{ t.Title }</p>
    <button
      hx-post="/api/htmx/kanban/move"
      hx-vals={ templ.JSONString(map[string]string{"id": t.ID, "to": "shipped"}) }
      hx-target="#kanban-board-columns"
      hx-swap="innerHTML transition:true"
    >
      Advance →
    </button>
  </div>
}`,
    reactEquivalentCode: `// React + Optimistic Reducer / Zustand (~176 lines)
const moveTaskMutation = useMutation({
  mutationFn: (payload) => axios.post("/api/kanban/move", payload),
  onMutate: async (newMove) => {
    await queryClient.cancelQueries({ queryKey: ["kanban"] });
    const previous = queryClient.getQueryData(["kanban"]);
    queryClient.setQueryData(["kanban"], (old) => /* deep clone + update */);
    return { previous };
  },
  onError: (_err, _vars, ctx) => {
    queryClient.setQueryData(["kanban"], ctx.previous);
  },
  onSettled: () => queryClient.invalidateQueries(["kanban"]),
});
// Plus derived useMemo() counters & Framer Motion layoutId animations`,
  },
  {
    id: 'inline-grid',
    index: '03',
    title: 'Inline-Edit Billing Grid & Bulk Actions',
    shortLabel: 'Inline Grid',
    summary:
      'Click any row to swap only that <tr> into a server-rendered inline editor. Save via hx-patch to update the row and MRR footer, or use Alpine x-model checkboxes for bulk updates.',
    htmxFeatures: ['hx-get', 'hx-patch', 'hx-swap="outerHTML"', 'hx-include', 'hx-swap-oob="true"'],
    alpineFeatures: ['x-data="{ selected: [] }"', 'x-model', 'x-show', '@htmx:after-request'],
    templFileName: 'components/billing_grid.templ',
    templLines: 52,
    reactLines: 195,
    clientJsSavedKb: '58 KB',
    templCode: `package components

templ GridRow(m Member) {
  <tr id={ "grid-row-" + m.ID }>
    <td><input type="checkbox" name="selectedIds" value={ m.ID } x-model="selected" /></td>
    <td>{ m.Name }</td>
    <td>{ m.Role }</td>
    <td class="font-mono tabular-nums">{ formatUSD(m.MonthlyRate) }</td>
    <td>
      <button
        hx-get={ "/api/htmx/grid/edit/" + m.ID }
        hx-target={ "#grid-row-" + m.ID }
        hx-swap="outerHTML"
      >Edit Row</button>
    </td>
  </tr>
}

templ GridEditRow(m Member) {
  <tr id={ "grid-row-" + m.ID }>
    <form
      id={ "edit-" + m.ID }
      hx-patch={ "/api/htmx/grid/row/" + m.ID }
      hx-target={ "#grid-row-" + m.ID }
      hx-swap="outerHTML"
    ></form>
    <td><input form={ "edit-" + m.ID } name="role" value={ m.Role } /></td>
    <td><input form={ "edit-" + m.ID } type="number" name="monthlyRate" value={ m.MonthlyRate } /></td>
    <td><button form={ "edit-" + m.ID } type="submit">Save</button></td>
  </tr>
}`,
    reactEquivalentCode: `// React + TanStack Table + Form State (~195 lines)
const [editingRowId, setEditingRowId] = useState<string | null>(null);
const [draftValues, setDraftValues] = useState<Record<string, RowDraft>>({});
const [rowSelection, setRowSelection] = useState({});

const table = useReactTable({
  data,
  columns,
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
  getCoreRowModel: getCoreRowModel(),
});
// Plus controlled inputs per cell, dirty-state tracking,
// bulk mutation handlers, and manual MRR recalculation`,
  },
  {
    id: 'wizard-form',
    index: '04',
    title: 'Server-Validated Multi-Step Wizard',
    shortLabel: 'Deploy Wizard',
    summary:
      'Validation rules live exclusively on the Go server. Submitting each step posts form data via HTMX and swaps either inline field errors or the next compiled Templ step.',
    htmxFeatures: ['hx-post', 'hx-target="#wizard-frame"', 'hx-swap="outerHTML"', 'hx-vals'],
    alpineFeatures: ['Zero client JS needed (progressive enhancement)'],
    templFileName: 'components/deploy_wizard.templ',
    templLines: 49,
    reactLines: 164,
    clientJsSavedKb: '41 KB',
    templCode: `package components

templ WizardStepOne(state WizardState, errs map[string]string) {
  <div id="wizard-frame" class="bg-white border rounded-xl">
    <form hx-post="/api/htmx/wizard/step" hx-target="#wizard-frame" hx-swap="outerHTML">
      <input type="hidden" name="currentStep" value="1" />
      <label>Service Slug</label>
      <input
        type="text"
        name="serviceName"
        value={ state.ServiceName }
        class={ templ.KV("border-red-600", errs["serviceName"] != "") }
      />
      if msg, ok := errs["serviceName"]; ok {
        <p class="text-xs text-red-600">{ msg }</p>
      }
      <button type="submit">Continue to Sizing →</button>
    </form>
  </div>
}`,
    reactEquivalentCode: `// React Hook Form + Zod + Multi-Step Context (~164 lines)
const schema = z.object({
  serviceName: z.string().regex(/^[a-z0-9-]{4,32}$/),
  region: z.enum(["us-east-1", "eu-central-1", "ap-northeast-1"]),
});
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
// Must still duplicate the exact same validation rules on the Go API
// and map 422 JSON error keys back into setError() calls`,
  },
  {
    id: 'sse-stream',
    index: '05',
    title: 'SSE Live Stream & HX-Trigger Toast Bus',
    shortLabel: 'SSE + Toasts',
    summary:
      'Stream pre-rendered HTML log fragments directly over EventSource, and emit structured HX-Trigger response headers so Alpine.js renders animated toast notifications automatically.',
    htmxFeatures: ['EventSource SSE HTML', 'HX-Trigger response header', 'hx-post', 'hx-swap="none"'],
    alpineFeatures: ['@notify.window="addToast($event.detail)"', 'x-for', 'x-transition'],
    templFileName: 'components/pipeline_stream.templ',
    templLines: 36,
    reactLines: 138,
    clientJsSavedKb: '29 KB',
    templCode: `package components

// Go Handler emitting HX-Trigger header for Alpine
func HandleToastPing(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("HX-Trigger", \`{"notify":{"title":"HX-Trigger Received","message":"Server header fired Alpine toast."}}\`)
  w.WriteHeader(http.StatusNoContent)
}

templ ToastContainer() {
  <div x-data="{ toasts: [] }" @notify.window="toasts.push($event.detail)">
    <template x-for="t in toasts" :key="t.id">
      <div x-transition class="bg-zinc-900 text-white px-4 py-2 rounded-lg">
        <strong x-text="t.title"></strong>
        <span x-text="t.message"></span>
      </div>
    </template>
  </div>
}`,
    reactEquivalentCode: `// React + Custom EventEmitter / Sonner + SSE Parser (~138 lines)
useEffect(() => {
  const es = new EventSource("/api/events");
  es.addEventListener("step", (e) => {
    const parsed = JSON.parse(e.data);
    setLogs((prev) => [...prev, parsed]);
    if (parsed.done) toast.success("Pipeline complete");
  });
  return () => es.close();
}, []);`,
  },
  {
    id: 'drawer-feed',
    index: '06',
    title: 'Cursor-Paginated Feed & Slide-Over Drawer',
    shortLabel: 'Feed + Drawer',
    summary:
      'Append paginated audit rows directly into the DOM with outerHTML replacement on the cursor button, while Alpine animates a smooth slide-over inspector populated by HTMX.',
    htmxFeatures: ['hx-get', 'hx-target="#feed-more-trigger"', 'hx-swap="outerHTML"'],
    alpineFeatures: ['x-data="{ drawerOpen: false }"', 'x-show', 'x-transition:enter', '@keydown.escape.window'],
    templFileName: 'components/audit_drawer.templ',
    templLines: 42,
    reactLines: 151,
    clientJsSavedKb: '36 KB',
    templCode: `package components

templ AuditBatch(events []AuditEvent, nextCursor int, hasMore bool) {
  for _, e := range events {
    <div class="px-5 py-3.5 flex justify-between">
      <span>{ e.Actor } { e.Action } { e.Target }</span>
      <button
        hx-get={ "/api/htmx/feed/item/" + e.ID }
        hx-target="#drawer-content"
        @click="drawerOpen = true"
      >Inspect Event</button>
    </div>
  }
  if hasMore {
    <div id="feed-more-trigger">
      <button
        hx-get={ fmt.Sprintf("/api/htmx/feed/page?cursor=%d", nextCursor) }
        hx-target="#feed-more-trigger"
        hx-swap="outerHTML"
      >Load Older Audit Events</button>
    </div>
  }
}`,
    reactEquivalentCode: `// React + useInfiniteQuery + HeadlessUI Dialog (~151 lines)
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["audit-feed"],
  queryFn: ({ pageParam = 0 }) => fetchFeed(pageParam),
  getNextPageParam: (last) => last.nextCursor,
});
const [selectedEventId, setSelectedEventId] = useState(null);
// Separate detail query + <Transition.Root> portal boilerplate`,
  },
  {
    id: 'faceted-morph',
    index: '07',
    title: 'Faceted Filter & Native View Transitions',
    shortLabel: 'View Transitions',
    summary:
      'Filter and sort server-rendered grids using native browser document.startViewTransition() triggered automatically by HTMX 2.0 transition:true swaps.',
    htmxFeatures: ['hx-get', 'hx-swap="innerHTML transition:true"', 'hx-include', 'hx-vals'],
    alpineFeatures: ['x-data="{ activeLayer: \'All\' }"', ':class'],
    templFileName: 'components/pattern_catalog.templ',
    templLines: 34,
    reactLines: 118,
    clientJsSavedKb: '52 KB',
    templCode: `package components

templ PatternGrid(patterns []PatternCard) {
  for _, p := range patterns {
    <div
      class="bg-stone-50 border rounded-lg p-4"
      style={ fmt.Sprintf("view-transition-name: card-%s", p.ID) }
    >
      <h5>{ p.Title }</h5>
      <p>{ p.Summary }</p>
    </div>
  }
}

// Filter trigger button:
// hx-get="/api/htmx/catalog"
// hx-target="#catalog-grid"
// hx-swap="innerHTML transition:true"`,
    reactEquivalentCode: `// React + Framer Motion <AnimatePresence> (~118 lines)
const filtered = useMemo(() =>
  items.filter(i => layer === "All" || i.layer === layer)
       .sort(sortComparators[sort]),
[items, layer, sort]);

return (
  <LayoutGroup>
    {filtered.map(item => (
      <motion.div layout layoutId={item.id} key={item.id}>
        ...
      </motion.div>
    ))}
  </LayoutGroup>
);`,
  },
];

export interface ComparisonRow {
  dimension: string;
  hypermedia: string;
  reactSpa: string;
  verdict: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    dimension: 'Client Runtime Footprint',
    hypermedia: '14.2 KB gzipped (HTMX 2.0 + Alpine 3.14)',
    reactSpa: '142–210 KB gzipped (React + Router + Query + Zod)',
    verdict: '10× smaller JS parse & eval',
  },
  {
    dimension: 'State Synchronization',
    hypermedia: 'Single source of truth on server; OOB swaps update multiple DOM regions',
    reactSpa: 'Dual state: DB -> JSON API -> Client Cache -> Local Store -> DOM',
    verdict: 'Eliminates stale-cache bugs',
  },
  {
    dimension: 'Type Safety Across Wire',
    hypermedia: 'Templ compiles HTML into Go functions; server props checked at build time',
    reactSpa: 'Requires OpenAPI / tRPC / GraphQL codegen to keep DTOs aligned',
    verdict: 'Zero serialization mismatch',
  },
  {
    dimension: 'Hydration & First Input',
    hypermedia: '0 ms hydration; attributes activate on first byte',
    reactSpa: '120–450 ms main-thread hydration cost on mid-tier devices',
    verdict: 'Instant interactive paint',
  },
  {
    dimension: 'Build & Tooling Chain',
    hypermedia: 'templ generate && go build (1 static binary, ~11 MB)',
    reactSpa: 'Vite/Webpack + Node SSR or separate API + CDN deployment',
    verdict: 'Radically simpler ops',
  },
  {
    dimension: 'High-Frequency Canvas / Offline UI',
    hypermedia: 'Requires custom JS islands for 60fps local state (Figma, spreadsheets)',
    reactSpa: 'Excels at complex offline-first client state graphs and WebGL editors',
    verdict: 'React still wins here',
  },
];
