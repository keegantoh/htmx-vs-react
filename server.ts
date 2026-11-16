import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  createInitialStore,
  escapeHtml,
  renderCatalogCards,
  renderDemoById,
  renderFeedBatch,
  renderFeedDrawerDetail,
  renderGridBodyAndOob,
  renderGridEditRow,
  renderGridRow,
  renderKanbanColumnsHtml,
  renderSearchPreview,
  renderSearchResults,
  renderWizardHtml,
} from './server/templRenderer.ts';
import {
  createInitialStressStore,
  renderCreativeComplianceCard,
  renderOobFragilityShell,
  renderPauseSyncPayload,
  renderSessionCollisionShell,
  renderSessionPanelInner,
  renderSliderCalcResponse,
  renderSliderStressShell,
  renderStressDemoById,
} from './server/stressRenderer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let store = createInitialStore();
let stressStore = createInitialStressStore();

// Initial component stage mount
app.get('/api/htmx/demo/:id', (req, res) => {
  res.type('text/html').send(renderDemoById(req.params.id, store));
});

// Reset demo store and return fresh HTML partial
app.post('/api/htmx/reset/:id', (req, res) => {
  store = createInitialStore();
  res.setHeader('HX-Trigger', JSON.stringify({ notify: { title: 'State Reset', message: 'Demo dataset restored.' } }));
  res.type('text/html').send(renderDemoById(req.params.id, store));
});

// 1. Command Palette Search + Preview
app.get('/api/htmx/search', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  res.type('text/html').send(renderSearchResults(q));
});

app.get('/api/htmx/search/preview/:id', (req, res) => {
  res.type('text/html').send(renderSearchPreview(req.params.id));
});

// 2. Kanban Board + Out-of-Band Totals
app.post('/api/htmx/kanban/move', (req, res) => {
  const { id, to } = req.body as { id?: string; to?: 'backlog' | 'review' | 'shipped' };
  const task = store.kanban.find((t) => t.id === id);
  if (task && (to === 'backlog' || to === 'review' || to === 'shipped')) {
    task.column = to;
  }
  res.type('text/html').send(renderKanbanColumnsHtml(store.kanban, true));
});

app.post('/api/htmx/kanban/add', (req, res) => {
  const title = String(req.body.title || '').trim();
  const owner = String(req.body.owner || 'Alex').trim() || 'Alex';
  const points = Number(req.body.points) || 3;
  if (title) {
    store.kanban.unshift({
      id: `t-${Date.now()}`,
      title,
      owner,
      column: 'backlog',
      points,
    });
  }
  res.setHeader('HX-Trigger', JSON.stringify({ kanbanAdded: true }));
  res.type('text/html').send(renderKanbanColumnsHtml(store.kanban, true));
});

app.delete('/api/htmx/kanban/:id', (req, res) => {
  store.kanban = store.kanban.filter((t) => t.id !== req.params.id);
  res.type('text/html').send(renderKanbanColumnsHtml(store.kanban, true));
});

// 3. Inline-Edit Billing Grid + Bulk Actions
app.get('/api/htmx/grid/edit/:id', (req, res) => {
  const member = store.grid.find((m) => m.id === req.params.id);
  if (!member) {
    res.status(404).send('');
    return;
  }
  res.type('text/html').send(renderGridEditRow(member));
});

app.get('/api/htmx/grid/row/:id', (req, res) => {
  const member = store.grid.find((m) => m.id === req.params.id);
  if (!member) {
    res.status(404).send('');
    return;
  }
  res.type('text/html').send(renderGridRow(member));
});

app.patch('/api/htmx/grid/row/:id', (req, res) => {
  const member = store.grid.find((m) => m.id === req.params.id);
  if (!member) {
    res.status(404).send('');
    return;
  }
  const role = String(req.body.role || member.role).trim();
  const tier = req.body.tier;
  const rate = Number(req.body.monthlyRate);
  const active = req.body.active === 'true';

  if (role) member.role = role;
  if (tier === 'Core' || tier === 'Scale' || tier === 'Enterprise') member.tier = tier;
  if (!Number.isNaN(rate) && rate >= 100) member.monthlyRate = rate;
  member.active = active;

  const activeCount = store.grid.filter((m) => m.active).length;
  const totalMrr = store.grid.filter((m) => m.active).reduce((sum, m) => sum + m.monthlyRate, 0);
  const partialTotals = `<hx-partial hx-target="#grid-oob-totals" hx-swap="innerHTML">
    <span class="font-mono tabular-nums text-[#111214] font-medium">${activeCount} active seats</span>
    <span aria-hidden="true" class="text-[#D1D5DB]">·</span>
    <span class="font-mono tabular-nums text-[#1E40AF] font-medium">$${totalMrr.toLocaleString('en-US')}/mo committed</span>
  </hx-partial>`;

  res.type('text/html').send(renderGridRow(member) + partialTotals);
});

app.post('/api/htmx/grid/bulk', (req, res) => {
  const raw = req.body.selectedIds;
  const ids = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const action = req.body.action;
  store.grid.forEach((m) => {
    if (ids.includes(m.id)) {
      m.active = action === 'activate';
    }
  });
  res.setHeader('HX-Trigger', JSON.stringify({ gridBulkDone: true }));
  res.type('text/html').send(renderGridBodyAndOob(store.grid, true));
});

// 4. Server-Validated Multi-Step Wizard
app.post('/api/htmx/wizard/step', (req, res) => {
  const currentStep = Number(req.body.currentStep) || 1;
  const direction = req.body.direction;

  if (direction === 'back') {
    store.wizard.step = Math.max(1, currentStep - 1) as 1 | 2 | 3;
    res.type('text/html').send(renderWizardHtml(store.wizard));
    return;
  }

  const errors: Record<string, string> = {};

  if (currentStep === 1) {
    const serviceName = String(req.body.serviceName || '').trim();
    const region = String(req.body.region || 'us-east-1');
    store.wizard.serviceName = serviceName;
    store.wizard.region = region;

    if (!/^[a-z0-9-]{4,32}$/.test(serviceName)) {
      errors.serviceName = 'Use 4–32 lowercase letters, digits, or hyphens (no spaces).';
      res.type('text/html').send(renderWizardHtml(store.wizard, errors));
      return;
    }
    store.wizard.step = 2;
    res.type('text/html').send(renderWizardHtml(store.wizard));
    return;
  }

  if (currentStep === 2) {
    const replicas = String(req.body.replicas || '').trim();
    const numReplicas = Number(replicas);
    store.wizard.replicas = replicas;
    store.wizard.memoryMb = String(req.body.memoryMb || '512');
    store.wizard.enableSse = req.body.enableSse === 'true';

    if (Number.isNaN(numReplicas) || numReplicas < 1 || numReplicas > 16) {
      errors.replicas = 'Replica count must be between 1 and 16.';
      res.type('text/html').send(renderWizardHtml(store.wizard, errors));
      return;
    }
    store.wizard.step = 3;
    res.type('text/html').send(renderWizardHtml(store.wizard));
    return;
  }

  store.wizard.step = 4;
  res.type('text/html').send(renderWizardHtml(store.wizard));
});

app.post('/api/htmx/wizard/reset', (_req, res) => {
  store.wizard = createInitialStore().wizard;
  res.type('text/html').send(renderWizardHtml(store.wizard));
});

// 5. SSE Stream + HX-Trigger Toast Ping
app.post('/api/htmx/toast-ping', (_req, res) => {
  res.setHeader(
    'HX-Trigger',
    JSON.stringify({
      notify: {
        title: 'HX-Trigger Received',
        message: 'Server response header dispatched a native Alpine toast.',
      },
    })
  );
  res.status(204).send();
});

app.get('/api/htmx/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const steps = [
    { pct: 25, stage: 'templ generate', detail: 'Compiled 7 .templ files into Go render functions (18 ms)' },
    { pct: 50, stage: 'go build -ldflags="-s -w"', detail: 'Linked static hypermedia binary (11.4 MB)' },
    { pct: 75, stage: 'smoke check /api/htmx', detail: 'Verified OOB partial swaps and CSRF headers (9 ms)' },
    { pct: 100, stage: 'edge rollout', detail: 'Zero-hydration HTML fragments live across 3 regions' },
  ];

  let idx = 0;
  const timer = setInterval(() => {
    if (idx < steps.length) {
      const s = steps[idx];
      const rowHtml = `<div class="hx-enter px-4 py-2.5 flex items-center justify-between gap-4 text-xs"><div class="flex items-center gap-3 min-w-0"><span class="font-mono text-[#1E40AF] font-medium shrink-0">${escapeHtml(s.stage)}</span><span class="text-[#4B5563] truncate">${escapeHtml(s.detail)}</span></div><span class="font-mono tabular-nums text-[#0F766E] shrink-0">OK</span></div>`;
      const progressHtml = `<div class="flex items-center justify-between text-xs text-[#6B7280] mb-1.5"><span>Running: ${escapeHtml(s.stage)}</span><span class="font-mono tabular-nums">${s.pct}%</span></div><div class="w-full h-2 bg-[#EFEFED] rounded-full overflow-hidden"><div class="h-full bg-[#1E40AF] transition-all duration-300" style="width:${s.pct}%"></div></div>`;

      res.write(`event: step\ndata: ${rowHtml}\n\n`);
      if (idx === steps.length - 1) {
        const doneProgress = `<div class="flex items-center justify-between text-xs text-[#0F766E] font-medium mb-1.5"><span>Build Complete</span><span class="font-mono tabular-nums">100%</span></div><div class="w-full h-2 bg-[#EFEFED] rounded-full overflow-hidden"><div class="h-full bg-[#0F766E] transition-all duration-300" style="width:100%"></div></div>`;
        res.write(`event: done\ndata: ${doneProgress}\n\n`);
        clearInterval(timer);
        res.end();
      } else {
        res.write(`event: progress\ndata: ${progressHtml}\n\n`);
      }
      idx += 1;
    }
  }, 550);

  req.on('close', () => {
    clearInterval(timer);
  });
});

// 6. Cursor Feed + Drawer Detail
app.get('/api/htmx/feed/page', (req, res) => {
  const cursor = Number(req.query.cursor) || 0;
  res.type('text/html').send(renderFeedBatch(cursor));
});

app.get('/api/htmx/feed/item/:id', (req, res) => {
  res.type('text/html').send(renderFeedDrawerDetail(req.params.id));
});

// 7. Faceted Filter + Sortable Cards
app.get('/api/htmx/catalog', (req, res) => {
  const layer = typeof req.query.layer === 'string' ? req.query.layer : 'All';
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'impact';
  store.catalogLayer = layer;
  store.catalogSort = sort;
  res.type('text/html').send(renderCatalogCards(layer, sort));
});

// 8. GEODESIC PAIN-POINT STRESS TESTS
app.get('/api/htmx/stress/demo/:id', (req, res) => {
  res.type('text/html').send(renderStressDemoById(req.params.id, stressStore));
});

app.post('/api/htmx/stress/reset/:id', (req, res) => {
  stressStore = createInitialStressStore();
  res.type('text/html').send(renderStressDemoById(req.params.id, stressStore));
});

app.post('/api/htmx/stress/slider-mode', (req, res) => {
  stressStore.sliderMode = req.body.mode === 'hybrid' ? 'hybrid' : 'naive';
  res.type('text/html').send(renderSliderStressShell(stressStore));
});

app.get('/api/htmx/stress/slider-calc', (req, res) => {
  const budgetRm = Number(req.query.budgetRm) || stressStore.budgetRm;
  const doohPct = Number(req.query.doohPct) || stressStore.doohPct;
  const transitPct = Number(req.query.transitPct) || stressStore.transitPct;
  const mallPct = Number(req.query.mallPct) || stressStore.mallPct;
  stressStore.budgetRm = budgetRm;
  stressStore.doohPct = doohPct;
  stressStore.transitPct = transitPct;
  stressStore.mallPct = mallPct;
  res.type('text/html').send(renderSliderCalcResponse(budgetRm, doohPct, transitPct, mallPct, stressStore.sliderMode));
});

app.post('/api/htmx/stress/pause-config', (req, res) => {
  if (req.body.protocol === 'partial' || req.body.protocol === 'oob') {
    stressStore.pauseProtocol = req.body.protocol;
  }
  if (req.body.toggleBug === 'true') {
    stressStore.brokenIdBug = !stressStore.brokenIdBug;
  }
  res.type('text/html').send(renderOobFragilityShell(stressStore));
});

app.post('/api/htmx/stress/pause-toggle', (_req, res) => {
  stressStore.emergencyPaused = !stressStore.emergencyPaused;
  res.type('text/html').send(renderPauseSyncPayload(stressStore.emergencyPaused, stressStore.pauseProtocol));
});

app.post('/api/htmx/stress/creative-validate', (req, res) => {
  const dims = String(req.body.dims || 'No file loaded');
  const aspect = String(req.body.aspect || '—');
  const fileName = String(req.body.fileName || '');
  const strategy = String(req.body.strategy || 'wipe');
  res.type('text/html').send(renderCreativeComplianceCard(dims, aspect, fileName, strategy));
});

app.get('/api/htmx/stress/session-mode', (req, res) => {
  const mode = req.query.mode === 'scoped' ? 'scoped' : 'global';
  res.type('text/html').send(renderSessionCollisionShell(stressStore, mode));
});

app.get('/api/htmx/stress/session-panel', (req, res) => {
  const session = req.query.session === 'B' ? 'B' : 'A';
  const mode = req.query.mode === 'scoped' ? 'scoped' : 'global';
  const state = mode === 'global' ? stressStore.globalSession : stressStore.userSessions[session];
  res.type('text/html').send(renderSessionPanelInner(session, mode, state));
});

app.post('/api/htmx/stress/session-panel', (req, res) => {
  const session = req.body.session === 'B' ? 'B' : 'A';
  const mode = req.body.mode === 'scoped' ? 'scoped' : 'global';
  const tab = String(req.body.tab || 'inventory');
  const query = String(req.body.query ?? '');
  if (mode === 'global') {
    stressStore.globalSession = { tab, query };
    res.type('text/html').send(renderSessionPanelInner(session, mode, stressStore.globalSession));
  } else {
    stressStore.userSessions[session] = { tab, query };
    res.type('text/html').send(renderSessionPanelInner(session, mode, stressStore.userSessions[session]));
  }
});

app.post('/api/htmx/stress/picker-submit', (req, res) => {
  const startDay = escapeHtml(req.body.startDay || '4');
  const endDay = escapeHtml(req.body.endDay || '11');
  const placement = escapeHtml(req.body.placement || 'Bukit Bintang Flagship LED');
  res.type('text/html').send(
    `<div class="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs text-[#065F46]">Reserved <strong>${placement}</strong> for <strong>Nov ${startDay} – Nov ${endDay}, 2026</strong> via server POST.</div>`
  );
});

app.get('/vendor/htmx.min.js', (_req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules/htmx.org/dist/htmx.min.js'));
});

app.get('/vendor/alpine.min.js', (_req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules/alpinejs/dist/cdn.min.js'));
});

// Standalone zero-React SSR page proving pure HTMX + Alpine + Templ output
app.get('/standalone', (_req, res) => {
  res.type('text/html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pure HTMX + Alpine Standalone SSR Proof</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #F7F7F5; color: #111214; padding: 2rem; }
    .wrap { max-width: 1080px; margin: 0 auto; }
    .top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding-bottom: 1.5rem; margin-bottom: 2rem; border-bottom: 1px solid #E2E2DE; }
    .btn-back { display: inline-block; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; background: #111214; color: #fff; text-decoration: none; border-radius: 0.5rem; }
    .stack { display: grid; gap: 2rem; }
    .bg-white { background: #fff; }
    .bg-\\[\\#FAFAF8\\] { background: #FAFAF8; }
    .bg-\\[\\#111214\\] { background: #111214; color: #fff; }
    .bg-\\[\\#1E40AF\\] { background: #1E40AF; color: #fff; }
    .border { border: 1px solid #E2E2DE; }
    .border-b { border-bottom: 1px solid #E2E2DE; }
    .border-t { border-top: 1px solid #E2E2DE; }
    .rounded-xl { border-radius: 0.75rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-md { border-radius: 0.375rem; }
    .rounded { border-radius: 0.25rem; }
    .p-5 { padding: 1.25rem; }
    .p-4 { padding: 1rem; }
    .p-3\\.5 { padding: 0.875rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .px-3\\.5 { padding-left: 0.875rem; padding-right: 0.875rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .pb-4 { padding-bottom: 1rem; }
    .mb-5 { margin-bottom: 1.25rem; }
    .mt-3 { margin-top: 0.75rem; }
    .mt-1 { margin-top: 0.25rem; }
    .flex { display: flex; }
    .flex-wrap { flex-wrap: wrap; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-between { justify-content: space-between; }
    .gap-4 { gap: 1rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-2\\.5 { gap: 0.625rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-1\\.5 { gap: 0.375rem; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    @media (min-width: 768px) { .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    .w-full { width: 100%; }
    .overflow-hidden { overflow: hidden; }
    .overflow-x-auto { overflow-x: auto; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .text-base { font-size: 1rem; }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .font-mono { font-family: ui-monospace, monospace; font-variant-numeric: tabular-nums; }
    .text-white { color: #fff; }
    .text-\\[\\#111214\\] { color: #111214; }
    .text-\\[\\#6B7280\\] { color: #6B7280; }
    .text-\\[\\#4B5563\\] { color: #4B5563; }
    .text-\\[\\#1E40AF\\] { color: #1E40AF; }
    .text-\\[\\#0F766E\\] { color: #0F766E; }
    button { cursor: pointer; font-family: inherit; }
    table { border-collapse: collapse; width: 100%; }
    tr { border-bottom: 1px solid #F0F0EC; }
    input, select { font-family: inherit; }
  </style>
  <script src="/vendor/htmx.min.js" defer></script>
  <script src="/vendor/alpine.min.js" defer></script>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <h1 style="margin:0; font-size:1.5rem; letter-spacing:-0.02em;">Zero-React Pure Hypermedia Page</h1>
        <p style="margin:0.35rem 0 0; font-size:0.875rem; color:#4B5563;">Served directly as server-rendered HTML powered exclusively by HTMX 2.0 and Alpine.js 3.14.</p>
      </div>
      <a href="/" class="btn-back">Back to Showcase</a>
    </div>
    <div class="stack">
      ${renderDemoById('kanban-oob', store)}
      ${renderDemoById('inline-grid', store)}
    </div>
  </div>
</body>
</html>`);
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hypermedia server listening on http://localhost:${PORT}`);
  });
}

startServer();
