import { escapeHtml } from './templRenderer.ts';

export interface StressStore {
  sliderMode: 'naive' | 'hybrid';
  budgetRm: number;
  doohPct: number;
  transitPct: number;
  mallPct: number;
  emergencyPaused: boolean;
  pauseProtocol: 'partial' | 'oob';
  brokenIdBug: boolean;
  globalSession: { tab: string; query: string };
  userSessions: Record<string, { tab: string; query: string }>;
}

export function createInitialStressStore(): StressStore {
  return {
    sliderMode: 'naive',
    budgetRm: 85000,
    doohPct: 50,
    transitPct: 30,
    mallPct: 20,
    emergencyPaused: false,
    pauseProtocol: 'partial',
    brokenIdBug: false,
    globalSession: { tab: 'inventory', query: '' },
    userSessions: {
      A: { tab: 'inventory', query: 'klcc-led-01' },
      B: { tab: 'billing', query: 'penang-mall' },
    },
  };
}

function renderBudgetChartSvg(budgetRm: number, doohPct: number, transitPct: number, mallPct: number): string {
  const total = Math.max(1, doohPct + transitPct + mallPct);
  const dW = Math.round((doohPct / total) * 100);
  const tW = Math.round((transitPct / total) * 100);
  const mW = Math.max(0, 100 - dW - tW);

  const dRm = Math.round((budgetRm * dW) / 100);
  const tRm = Math.round((budgetRm * tW) / 100);
  const mRm = Math.max(0, budgetRm - dRm - tRm);
  const estImpressions = Math.round(budgetRm * 14.2);

  return `
    <div class="space-y-3">
      <div class="grid grid-cols-3 gap-3 text-xs">
        <div class="p-3 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg">
          <div class="text-[#6B7280]">Digital OOH (${dW}%)</div>
          <div class="font-mono tabular-nums font-semibold text-[#111214] mt-0.5">RM ${dRm.toLocaleString('en-US')}</div>
        </div>
        <div class="p-3 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg">
          <div class="text-[#6B7280]">Transit LED (${tW}%)</div>
          <div class="font-mono tabular-nums font-semibold text-[#111214] mt-0.5">RM ${tRm.toLocaleString('en-US')}</div>
        </div>
        <div class="p-3 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg">
          <div class="text-[#6B7280]">Mall Screens (${mW}%)</div>
          <div class="font-mono tabular-nums font-semibold text-[#111214] mt-0.5">RM ${mRm.toLocaleString('en-US')}</div>
        </div>
      </div>

      <div class="p-4 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-medium text-[#111214]">Media-Mix Allocation Bar</span>
          <span class="font-mono tabular-nums text-[#1E40AF]">Est. ${estImpressions.toLocaleString('en-US')} monthly views</span>
        </div>
        <svg viewBox="0 0 400 24" class="w-full h-6 rounded overflow-hidden" role="img" aria-label="Media mix allocation chart">
          <rect x="0" y="0" width="${dW * 4}" height="24" fill="#1E40AF" />
          <rect x="${dW * 4}" y="0" width="${tW * 4}" height="24" fill="#0F766E" />
          <rect x="${(dW + tW) * 4}" y="0" width="${mW * 4}" height="24" fill="#D97706" />
        </svg>
        <div class="flex items-center gap-4 text-[11px] text-[#4B5563] mt-2">
          <span>Blue: Digital OOH</span>
          <span>Teal: Transit LED</span>
          <span>Amber: Mall Screens</span>
        </div>
      </div>
    </div>
  `;
}

// STRESS TEST 1: HIGH-FREQUENCY SLIDERS & LIVE RM MATH
export function renderSliderStressShell(store: StressStore): string {
  const isHybrid = store.sliderMode === 'hybrid';
  return `
  <div
    id="stress-slider-root"
    class="hx-enter bg-white border border-[#E2E2DE] rounded-xl p-5"
    x-data="{
      mode: '${store.sliderMode}',
      reqCount: 0,
      budgetRm: ${store.budgetRm},
      doohPct: ${store.doohPct},
      transitPct: ${store.transitPct},
      mallPct: ${store.mallPct},
      get totalW() { return Math.max(1, Number(this.doohPct) + Number(this.transitPct) + Number(this.mallPct)); },
      get dW() { return Math.round((Number(this.doohPct) / this.totalW) * 100); },
      get tW() { return Math.round((Number(this.transitPct) / this.totalW) * 100); },
      get mW() { return Math.max(0, 100 - this.dW - this.tW); },
      get dRm() { return Math.round((Number(this.budgetRm) * this.dW) / 100); },
      get tRm() { return Math.round((Number(this.budgetRm) * this.tW) / 100); },
      get mRm() { return Math.max(0, Number(this.budgetRm) - this.dRm - this.tRm); },
      get estViews() { return Math.round(Number(this.budgetRm) * 14.2); }
    }"
    hx-on:htmx:after:request="if(event.detail?.ctx?.request?.action?.includes('slider-calc')) { const scope = Alpine.$data(this); if(scope) scope.reqCount++; }"
  >
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E2E2DE]">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">GEODESIC Media-Mix &amp; RM Budget Allocator</h4>
        <p class="text-xs text-[#6B7280] mt-0.5">Drag the sliders continuously to feel HTTP roundtrip saturation vs. local Alpine JS duplication.</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-mono tabular-nums px-2.5 py-1 bg-[#F3F3F0] rounded text-[#111214]">
          HTTP Swaps: <strong x-text="reqCount">0</strong>
        </span>
        <div class="flex items-center gap-1 p-1 bg-[#F3F3F0] rounded-lg">
          <button
            type="button"
            hx-post="/api/htmx/stress/slider-mode"
            hx-vals='{"mode":"naive"}'
            hx-target="#stress-slider-root"
            hx-swap="outerHTML"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              !isHybrid ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B] hover:text-[#111214]'
            }"
          >Pure HTMX (Every Tick)</button>
          <button
            type="button"
            hx-post="/api/htmx/stress/slider-mode"
            hx-vals='{"mode":"hybrid"}'
            hx-target="#stress-slider-root"
            hx-swap="outerHTML"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              isHybrid ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B] hover:text-[#111214]'
            }"
          >Alpine 60fps + Debounced Sync</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form
        id="slider-mix-form"
        class="lg:col-span-5 space-y-4"
        ${
          isHybrid
            ? `hx-get="/api/htmx/stress/slider-calc" hx-trigger="change delay:250ms from:input" hx-target="#slider-server-output" hx-include="this"`
            : `hx-get="/api/htmx/stress/slider-calc" hx-trigger="input from:input" hx-target="#slider-server-output" hx-include="this"`
        }
      >
        <div>
          <div class="flex justify-between text-xs font-medium mb-1">
            <span>Total Campaign Budget</span>
            <span class="font-mono tabular-nums text-[#1E40AF]">RM <span x-text="Number(budgetRm).toLocaleString('en-US')"></span></span>
          </div>
          <input
            type="range"
            name="budgetRm"
            min="10000"
            max="250000"
            step="2500"
            x-model="budgetRm"
            class="w-full accent-[#1E40AF]"
          />
        </div>

        <div>
          <div class="flex justify-between text-xs font-medium mb-1">
            <span>Digital OOH Weight</span>
            <span class="font-mono tabular-nums" x-text="doohPct"></span>
          </div>
          <input type="range" name="doohPct" min="5" max="100" x-model="doohPct" class="w-full accent-[#1E40AF]" />
        </div>

        <div>
          <div class="flex justify-between text-xs font-medium mb-1">
            <span>Transit LED Weight</span>
            <span class="font-mono tabular-nums" x-text="transitPct"></span>
          </div>
          <input type="range" name="transitPct" min="5" max="100" x-model="transitPct" class="w-full accent-[#0F766E]" />
        </div>

        <div>
          <div class="flex justify-between text-xs font-medium mb-1">
            <span>Mall Screens Weight</span>
            <span class="font-mono tabular-nums" x-text="mallPct"></span>
          </div>
          <input type="range" name="mallPct" min="5" max="100" x-model="mallPct" class="w-full accent-[#D97706]" />
        </div>
      </form>

      <div class="lg:col-span-7 flex flex-col justify-between gap-4">
        ${
          isHybrid
            ? `
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-3 text-xs">
              <div class="p-3 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg">
                <div class="text-[#6B7280]">Digital OOH (<span x-text="dW"></span>%)</div>
                <div class="font-mono tabular-nums font-semibold text-[#111214] mt-0.5">RM <span x-text="dRm.toLocaleString('en-US')"></span></div>
              </div>
              <div class="p-3 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg">
                <div class="text-[#6B7280]">Transit LED (<span x-text="tW"></span>%)</div>
                <div class="font-mono tabular-nums font-semibold text-[#111214] mt-0.5">RM <span x-text="tRm.toLocaleString('en-US')"></span></div>
              </div>
              <div class="p-3 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg">
                <div class="text-[#6B7280]">Mall Screens (<span x-text="mW"></span>%)</div>
                <div class="font-mono tabular-nums font-semibold text-[#111214] mt-0.5">RM <span x-text="mRm.toLocaleString('en-US')"></span></div>
              </div>
            </div>
            <div class="p-4 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg">
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="font-medium text-[#111214]">60fps Client SVG Allocation (Alpine)</span>
                <span class="font-mono tabular-nums text-[#1E40AF]">Est. <span x-text="estViews.toLocaleString('en-US')"></span> views</span>
              </div>
              <svg viewBox="0 0 400 24" class="w-full h-6 rounded overflow-hidden">
                <rect x="0" y="0" :width="dW * 4" height="24" fill="#1E40AF" />
                <rect :x="dW * 4" y="0" :width="tW * 4" height="24" fill="#0F766E" />
                <rect :x="(dW + tW) * 4" y="0" :width="mW * 4" height="24" fill="#D97706" />
              </svg>
            </div>
            <div id="slider-server-output" class="text-xs font-mono text-[#0F766E]">
              Server sync idle · releases slider to commit RM allocation
            </div>
          </div>
          `
            : `
          <div id="slider-server-output">
            ${renderBudgetChartSvg(store.budgetRm, store.doohPct, store.transitPct, store.mallPct)}
          </div>
          <div class="text-xs text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-3">
            Notice: Every single pixel dragged triggers an HTTP GET to <code class="font-mono">/api/htmx/stress/slider-calc</code> and swaps the entire SVG DOM. Under 80ms network RTT, fast dragging lags and wastes server cycles.
          </div>
          `
        }
      </div>
    </div>
  </div>
  `;
}

export function renderSliderCalcResponse(budgetRm: number, doohPct: number, transitPct: number, mallPct: number, mode: string): string {
  if (mode === 'hybrid') {
    return `<span class="text-xs font-mono text-[#0F766E]">Server persisted: RM ${budgetRm.toLocaleString('en-US')} (${doohPct}/${transitPct}/${mallPct} weights) at ${new Date().toLocaleTimeString()}</span>`;
  }
  return renderBudgetChartSvg(budgetRm, doohPct, transitPct, mallPct);
}

// STRESS TEST 2: MULTI-REGION SYNC FRAGILITY (OOB vs HTMX 4 <hx-partial>)
function getZoneBadge(paused: boolean, label: string): string {
  return paused
    ? `<span class="font-mono text-xs font-semibold text-[#B91C1C]">PAUSED · ${escapeHtml(label)}</span>`
    : `<span class="font-mono text-xs font-semibold text-[#0F766E]">LIVE · ${escapeHtml(label)}</span>`;
}

export function renderOobFragilityShell(store: StressStore): string {
  const p = store.emergencyPaused;
  const uptimeId = store.brokenIdBug ? 'geodesic-uptime-panel' : 'geodesic-uptime-card';
  return `
  <div id="stress-oob-root" class="hx-enter bg-white border border-[#E2E2DE] rounded-xl p-5">
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E2E2DE]">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">GEODESIC Emergency Pause: 4-Zone Multi-Target Sync</h4>
        <p class="text-xs text-[#6B7280] mt-0.5">Toggle Emergency Pause, then check "Simulate Renamed ID Bug" to see how OOB / partial ID coupling silently fails.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-1 p-1 bg-[#F3F3F0] rounded-lg">
          <button
            type="button"
            hx-post="/api/htmx/stress/pause-config"
            hx-vals='{"protocol":"partial"}'
            hx-target="#stress-oob-root"
            hx-swap="outerHTML"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              store.pauseProtocol === 'partial' ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B]'
            }"
          >HTMX 4 &lt;hx-partial&gt;</button>
          <button
            type="button"
            hx-post="/api/htmx/stress/pause-config"
            hx-vals='{"protocol":"oob"}'
            hx-target="#stress-oob-root"
            hx-swap="outerHTML"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              store.pauseProtocol === 'oob' ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B]'
            }"
          >HTMX 2 hx-swap-oob</button>
        </div>

        <button
          type="button"
          hx-post="/api/htmx/stress/pause-toggle"
          hx-swap="none"
          class="px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            p ? 'bg-[#0F766E] text-white hover:bg-[#0D625B]' : 'bg-[#B91C1C] text-white hover:bg-[#991B1B]'
          }"
        >${p ? 'Resume All Screens' : 'Trigger Emergency Pause'}</button>
      </div>
    </div>

    <div class="mb-5 p-3.5 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg flex flex-wrap items-center justify-between gap-4">
      <label class="flex items-center gap-2.5 text-xs font-medium text-[#111214] cursor-pointer">
        <input
          type="checkbox"
          ${store.brokenIdBug ? 'checked' : ''}
          hx-post="/api/htmx/stress/pause-config"
          hx-vals='{"toggleBug":"true"}'
          hx-target="#stress-oob-root"
          hx-swap="outerHTML"
          class="w-4 h-4 rounded border-[#D4D4CE] text-[#1E40AF]"
        />
        <span>Simulate Renamed ID Bug (renames <code class="font-mono">#geodesic-uptime-card</code> → <code class="font-mono">#geodesic-uptime-panel</code>)</span>
      </label>
      <span class="text-xs font-mono text-[#6B7280]">
        Active Uptime DOM ID: <strong class="text-[#111214]">#${uptimeId}</strong>
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 border border-[#E2E2DE] rounded-lg bg-[#FAFAF8]">
        <div class="text-xs text-[#6B7280] mb-1">Zone 1 · #geodesic-ctrl-bar</div>
        <div id="geodesic-ctrl-bar">${getZoneBadge(p, 'Control Bar Armed')}</div>
      </div>

      <div class="p-4 border border-[#E2E2DE] rounded-lg bg-[#FAFAF8]">
        <div class="text-xs text-[#6B7280] mb-1">Zone 2 · #geodesic-sidebar-state</div>
        <div id="geodesic-sidebar-state">${getZoneBadge(p, 'Sidebar Fleet Sync')}</div>
      </div>

      <div class="p-4 border border-[#E2E2DE] rounded-lg bg-[#FAFAF8]">
        <div class="text-xs text-[#6B7280] mb-1">Zone 3 · #geodesic-alert-banner</div>
        <div id="geodesic-alert-banner">
          ${
            p
              ? `<span class="text-xs font-medium text-[#B91C1C]">Emergency Broadcast Halted — 142 LED displays blanked.</span>`
              : `<span class="text-xs font-medium text-[#0F766E]">All 142 LED displays serving scheduled campaign playlists.</span>`
          }
        </div>
      </div>

      <div class="p-4 border ${store.brokenIdBug ? 'border-[#DC2626]' : 'border-[#E2E2DE]'} rounded-lg bg-[#FAFAF8]">
        <div class="text-xs text-[#6B7280] mb-1">Zone 4 · #${uptimeId}</div>
        <div id="${uptimeId}">${getZoneBadge(p, '99.98% SLA Uptime')}</div>
        ${
          store.brokenIdBug
            ? `<div class="text-[11px] text-[#B91C1C] mt-1.5">ID mismatch! Server still targets #geodesic-uptime-card; this zone silently freezes with zero error.</div>`
            : ''
        }
      </div>
    </div>
  </div>
  `;
}

export function renderPauseSyncPayload(paused: boolean, protocol: 'partial' | 'oob'): string {
  const bannerHtml = paused
    ? `<span class="text-xs font-medium text-[#B91C1C]">Emergency Broadcast Halted — 142 LED displays blanked.</span>`
    : `<span class="text-xs font-medium text-[#0F766E]">All 142 LED displays serving scheduled campaign playlists.</span>`;

  if (protocol === 'partial') {
    return `
      <hx-partial hx-target="#geodesic-ctrl-bar" hx-swap="innerHTML">${getZoneBadge(paused, 'Control Bar Armed')}</hx-partial>
      <hx-partial hx-target="#geodesic-sidebar-state" hx-swap="innerHTML">${getZoneBadge(paused, 'Sidebar Fleet Sync')}</hx-partial>
      <hx-partial hx-target="#geodesic-alert-banner" hx-swap="innerHTML">${bannerHtml}</hx-partial>
      <hx-partial hx-target="#geodesic-uptime-card" hx-swap="innerHTML">${getZoneBadge(paused, '99.98% SLA Uptime')}</hx-partial>
    `;
  }

  return `
    <div id="geodesic-ctrl-bar" hx-swap-oob="innerHTML">${getZoneBadge(paused, 'Control Bar Armed')}</div>
    <div id="geodesic-sidebar-state" hx-swap-oob="innerHTML">${getZoneBadge(paused, 'Sidebar Fleet Sync')}</div>
    <div id="geodesic-alert-banner" hx-swap-oob="innerHTML">${bannerHtml}</div>
    <div id="geodesic-uptime-card" hx-swap-oob="innerHTML">${getZoneBadge(paused, '99.98% SLA Uptime')}</div>
  `;
}

// STRESS TEST 3: RICH MEDIA & FILE PREVIEWS + DOM SWAP PRESERVATION
export function renderMediaPreviewShell(): string {
  return `
  <div
    class="hx-enter bg-white border border-[#E2E2DE] rounded-xl p-5"
    x-data="{
      swapStrategy: 'wipe',
      dims: 'No file loaded',
      aspect: '—',
      fileName: '',
      loadSample(w, h, label) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, '#111827');
          grad.addColorStop(1, '#1E40AF');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold ' + Math.round(h * 0.09) + 'px sans-serif';
          ctx.fillText('GEODESIC LED', Math.round(w * 0.08), Math.round(h * 0.48));
          ctx.fillStyle = '#93C5FD';
          ctx.font = Math.round(h * 0.05) + 'px monospace';
          ctx.fillText(w + 'x' + h + ' · ' + label, Math.round(w * 0.08), Math.round(h * 0.62));
        }
        const dataUrl = canvas.toDataURL('image/png');
        this.applyMedia(dataUrl, w, h, label + '.png');
      },
      handleFile(evt) {
        const file = evt.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = String(e.target?.result || '');
          const img = new Image();
          img.onload = () => this.applyMedia(dataUrl, img.naturalWidth, img.naturalHeight, file.name);
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      },
      applyMedia(dataUrl, w, h, name) {
        this.dims = w + ' × ' + h + ' px';
        this.aspect = (w / h).toFixed(2) + ':1';
        this.fileName = name;
        window.__geodesicCreativePreview = { dataUrl, width: w, height: h, name };
        window.__geodesicReinjectPreview?.();
      }
    }"
  >
    <div id="creative-reinject-flag" :data-reinject="swapStrategy === 'reinject' ? 'true' : 'false'" class="hidden"></div>

    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E2E2DE]">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">Creative Compliance &amp; LED Mockup Preview</h4>
        <p class="text-xs text-[#6B7280] mt-0.5">Load a creative asset via browser Canvas/FileReader, then run a server swap to test DOM state survival.</p>
      </div>
      <div class="flex items-center gap-1 p-1 bg-[#F3F3F0] rounded-lg">
        <button type="button" @click="swapStrategy = 'wipe'" :class="swapStrategy === 'wipe' ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B]'" class="px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap">1. Naive Swap (Wipes Preview)</button>
        <button type="button" @click="swapStrategy = 'reinject'" :class="swapStrategy === 'reinject' ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B]'" class="px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap">2. Window Hook Re-inject</button>
        <button type="button" @click="swapStrategy = 'morph'" :class="swapStrategy === 'morph' ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B]'" class="px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap">3. HTMX 4 Morph + Skip</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-5 space-y-4">
        <div class="p-4 bg-[#FAFAF8] border border-[#E2E2DE] rounded-lg space-y-3">
          <label class="block text-xs font-medium text-[#111214]">Pick Local Image or Sample Creative</label>
          <input type="file" accept="image/*" @change="handleFile($event)" class="block w-full text-xs text-[#4B5563]" />
          <div class="flex flex-wrap gap-2 pt-1">
            <button type="button" @click="loadSample(1920, 1080, 'Landscape 16:9')" class="px-3 py-1.5 text-xs font-medium border border-[#D4D4CE] bg-white rounded-md hover:border-[#1E40AF]">Load 1920×1080</button>
            <button type="button" @click="loadSample(1080, 1350, 'Portrait 4:5')" class="px-3 py-1.5 text-xs font-medium border border-[#D4D4CE] bg-white rounded-md hover:border-[#1E40AF]">Load 1080×1350</button>
          </div>
        </div>

        <form
          hx-post="/api/htmx/stress/creative-validate"
          hx-target="#creative-compliance-card"
          :hx-swap="swapStrategy === 'morph' ? 'innerMorph' : 'innerHTML'"
          class="space-y-3"
        >
          <input type="hidden" name="dims" :value="dims" />
          <input type="hidden" name="aspect" :value="aspect" />
          <input type="hidden" name="fileName" :value="fileName" />
          <input type="hidden" name="strategy" :value="swapStrategy" />
          <button type="submit" class="w-full px-4 py-2.5 text-xs font-medium bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors">
            Run Server Compliance Check (HTMX POST)
          </button>
        </form>
      </div>

      <div id="creative-compliance-card" class="lg:col-span-7">
        ${renderCreativeComplianceCard('No file loaded', '—', '', 'wipe')}
      </div>
    </div>
  </div>
  `;
}

export function renderCreativeComplianceCard(dims: string, aspect: string, fileName: string, strategy: string): string {
  const checked = dims !== 'No file loaded';
  const passed = dims.includes('1920');
  return `
    <div class="p-4 border border-[#E2E2DE] rounded-xl bg-[#FAFAF8] space-y-4">
      <div class="flex items-center justify-between text-xs">
        <span class="font-medium text-[#111214]">LED Billboard Mockup Container</span>
        <span class="font-mono text-[#6B7280]">Strategy: ${escapeHtml(strategy)}</span>
      </div>

      <div
        id="led-mockup-screen"
        ${strategy === 'morph' ? 'hx-morph-skip' : ''}
        class="w-full aspect-video bg-[#141518] rounded-lg border border-[#27272A] flex items-center justify-center overflow-hidden text-xs text-[#A1A1AA]"
      >
        <span>Empty LED Frame (load a creative above)</span>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E2DE] text-xs">
        <span class="font-mono tabular-nums text-[#111214]">${escapeHtml(fileName || 'Awaiting asset')} · ${escapeHtml(dims)} (${escapeHtml(aspect)})</span>
        <span class="font-medium ${!checked ? 'text-[#6B7280]' : passed ? 'text-[#0F766E]' : 'text-[#B45309]'}">
          ${
            !checked
              ? 'Pending server check'
              : passed
              ? 'Server Verdict: 16:9 LED Compliant'
              : 'Server Verdict: Aspect mismatch for 16:9 LED'
          }
        </span>
      </div>
    </div>
  `;
}

// STRESS TEST 4: TEMPORARY UI STATE COLLISION (GLOBAL vs SESSION SCOPED)
export function renderSessionPanelInner(sessionId: string, mode: 'global' | 'scoped', state: { tab: string; query: string }): string {
  const tabs = ['inventory', 'alerts', 'billing'];
  return `
    <div class="p-4 border border-[#E2E2DE] rounded-xl bg-[#FAFAF8] space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs font-mono text-[#1E40AF]">Browser Session: User ${escapeHtml(sessionId)}</div>
          <div class="text-sm font-semibold text-[#111214]">${sessionId === 'A' ? 'Kuala Lumpur Ops' : 'Penang Ops'}</div>
        </div>
        <button
          type="button"
          hx-get="/api/htmx/stress/session-panel?session=${escapeHtml(sessionId)}&mode=${mode}"
          hx-target="#session-panel-${escapeHtml(sessionId)}"
          hx-swap="innerHTML"
          class="px-2.5 py-1 text-xs font-medium border border-[#D4D4CE] bg-white rounded-md hover:border-[#111214]"
        >Refresh Panel</button>
      </div>

      <div class="flex items-center gap-1 p-1 bg-[#EAEAE6] rounded-lg">
        ${tabs
          .map(
            (t) => `
          <button
            type="button"
            hx-post="/api/htmx/stress/session-panel"
            hx-vals='{"session":"${escapeHtml(sessionId)}","mode":"${mode}","tab":"${t}","query":"${escapeHtml(state.query)}"}'
            hx-target="#session-panel-${escapeHtml(sessionId)}"
            hx-swap="innerHTML"
            class="flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md capitalize ${
              state.tab === t ? 'bg-white text-[#111214] shadow-sm' : 'text-[#52525B]'
            }"
          >${t}</button>
        `
          )
          .join('')}
      </div>

      <div>
        <input
          type="text"
          name="query"
          value="${escapeHtml(state.query)}"
          placeholder="Type filter query for User ${escapeHtml(sessionId)}..."
          hx-post="/api/htmx/stress/session-panel"
          hx-trigger="keyup changed delay:200ms"
          hx-vals='{"session":"${escapeHtml(sessionId)}","mode":"${mode}","tab":"${escapeHtml(state.tab)}"}'
          hx-target="#session-panel-${escapeHtml(sessionId)}"
          hx-swap="innerHTML"
          class="w-full px-3 py-2 text-xs bg-white border border-[#D4D4CE] rounded-md focus:outline-none focus:border-[#1E40AF]"
        />
      </div>

      <div class="p-3 bg-white border border-[#E2E2DE] rounded-md text-xs text-[#4B5563]">
        Server rendered tab <strong class="text-[#111214]">${escapeHtml(state.tab)}</strong> with filter <code class="font-mono text-[#1E40AF]">"${escapeHtml(state.query || '(empty)')}"</code>
      </div>
    </div>
  `;
}

export function renderSessionCollisionShell(store: StressStore, mode: 'global' | 'scoped'): string {
  const stateA = mode === 'global' ? store.globalSession : store.userSessions.A;
  const stateB = mode === 'global' ? store.globalSession : store.userSessions.B;

  return `
  <div id="stress-session-root" class="hx-enter bg-white border border-[#E2E2DE] rounded-xl p-5">
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E2E2DE]">
      <div>
        <h4 class="text-base font-semibold text-[#111214]">Multi-User Ephemeral State: Global Store vs. Session Isolation</h4>
        <p class="text-xs text-[#6B7280] mt-0.5">Change tab or filter in User A, then click "Refresh Panel" in User B to observe state leakage vs. isolation.</p>
      </div>
      <div class="flex items-center gap-1 p-1 bg-[#F3F3F0] rounded-lg">
        <button
          type="button"
          hx-get="/api/htmx/stress/session-mode?mode=global"
          hx-target="#stress-session-root"
          hx-swap="outerHTML"
          class="px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            mode === 'global' ? 'bg-white text-[#B91C1C] shadow-sm' : 'text-[#52525B]'
          }"
        >Global Store (Leaks Across Users)</button>
        <button
          type="button"
          hx-get="/api/htmx/stress/session-mode?mode=scoped"
          hx-target="#stress-session-root"
          hx-swap="outerHTML"
          class="px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            mode === 'scoped' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-[#52525B]'
          }"
        >Per-Session + URL State</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div id="session-panel-A">${renderSessionPanelInner('A', mode, stateA)}</div>
      <div id="session-panel-B">${renderSessionPanelInner('B', mode, stateB)}</div>
    </div>
  </div>
  `;
}

// STRESS TEST 5: DIY ACCESSIBLE DATE RANGE PICKER & COMBOBOX (NO SHADCN/RADIX)
export function renderAccessiblePickerShell(): string {
  return `
  <div
    class="hx-enter bg-white border border-[#E2E2DE] rounded-xl p-5"
    x-data="{
      calOpen: false,
      comboOpen: false,
      startDay: 4,
      endDay: 11,
      hoverDay: null,
      focusedDay: 4,
      activeComboIdx: 0,
      selectedTier: 'Bukit Bintang Flagship LED',
      tiers: ['Bukit Bintang Flagship LED', 'KL Sentral Transit Concourse', 'Pavilion Digital Atrium', 'Penang Bridge Approach'],
      pickDay(d) {
        if (!this.startDay || (this.startDay && this.endDay)) {
          this.startDay = d;
          this.endDay = null;
        } else if (d < this.startDay) {
          this.endDay = this.startDay;
          this.startDay = d;
        } else {
          this.endDay = d;
          this.calOpen = false;
        }
      },
      isInRange(d) {
        const end = this.endDay ?? this.hoverDay;
        if (!this.startDay || !end) return false;
        const lo = Math.min(this.startDay, end);
        const hi = Math.max(this.startDay, end);
        return d >= lo && d <= hi;
      },
      moveDay(delta) {
        this.focusedDay = Math.min(28, Math.max(1, this.focusedDay + delta));
      },
      moveCombo(delta) {
        this.activeComboIdx = (this.activeComboIdx + delta + this.tiers.length) % this.tiers.length;
      }
    }"
    @keydown.escape.window="calOpen = false; comboOpen = false"
  >
    <div class="pb-4 mb-5 border-b border-[#E2E2DE]">
      <h4 class="text-base font-semibold text-[#111214]">Hand-Rolled Accessible Date Range Picker &amp; Combobox (Alpine + ARIA)</h4>
      <p class="text-xs text-[#6B7280] mt-0.5">Without Radix/shadcn, keyboard roving, <code class="font-mono">aria-activedescendant</code>, and range-hover state must be wired manually.</p>
    </div>

    <form hx-post="/api/htmx/stress/picker-submit" hx-target="#picker-server-receipt" hx-swap="innerHTML" class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
      <div class="md:col-span-5 relative">
        <label class="block text-xs font-medium text-[#111214] mb-1.5">Flight Date Range (Nov 2026)</label>
        <input type="hidden" name="startDay" :value="startDay || ''" />
        <input type="hidden" name="endDay" :value="endDay || startDay || ''" />
        <button
          type="button"
          @click="calOpen = !calOpen; comboOpen = false"
          :aria-expanded="calOpen"
          aria-haspopup="dialog"
          class="w-full px-3.5 py-2.5 text-left text-xs font-mono bg-white border border-[#D4D4CE] rounded-lg hover:border-[#1E40AF] flex items-center justify-between"
        >
          <span x-text="startDay ? ('Nov ' + startDay + ' → Nov ' + (endDay || startDay)) : 'Select flight dates'"></span>
          <span class="text-[#6B7280]">Calendar</span>
        </button>

        <div
          x-show="calOpen"
          x-transition
          role="dialog"
          aria-label="Flight date picker"
          @keydown.arrow-right.prevent="moveDay(1)"
          @keydown.arrow-left.prevent="moveDay(-1)"
          @keydown.arrow-down.prevent="moveDay(7)"
          @keydown.arrow-up.prevent="moveDay(-7)"
          @keydown.enter.prevent="pickDay(focusedDay)"
          class="absolute left-0 mt-2 w-72 bg-white border border-[#D4D4CE] rounded-xl shadow-lg p-3 z-20"
          style="display: none;"
        >
          <div class="text-xs font-semibold text-[#111214] mb-2 flex justify-between">
            <span>November 2026</span>
            <span class="font-mono text-[#6B7280]">Arrows + Enter</span>
          </div>
          <div class="grid grid-cols-7 gap-1 text-center text-xs" role="grid">
            ${Array.from({ length: 28 }, (_, i) => i + 1)
              .map(
                (day) => `
              <button
                type="button"
                @click="pickDay(${day})"
                @mouseenter="hoverDay = ${day}; focusedDay = ${day}"
                :class="startDay === ${day} || endDay === ${day} ? 'bg-[#1E40AF] text-white font-semibold' : isInRange(${day}) ? 'bg-[#EEF2FF] text-[#1E40AF]' : focusedDay === ${day} ? 'ring-1 ring-[#1E40AF] text-[#111214]' : 'hover:bg-[#F3F3F0] text-[#111214]'"
                class="py-1.5 rounded font-mono tabular-nums text-xs transition-colors"
              >${day}</button>
            `
              )
              .join('')}
          </div>
        </div>
      </div>

      <div class="md:col-span-5 relative">
        <label class="block text-xs font-medium text-[#111214] mb-1.5">Billboard Placement (ARIA Listbox)</label>
        <input type="hidden" name="placement" :value="selectedTier" />
        <button
          type="button"
          role="combobox"
          :aria-expanded="comboOpen"
          :aria-activedescendant="'tier-opt-' + activeComboIdx"
          @click="comboOpen = !comboOpen; calOpen = false"
          @keydown.arrow-down.prevent="comboOpen = true; moveCombo(1)"
          @keydown.arrow-up.prevent="comboOpen = true; moveCombo(-1)"
          @keydown.enter.prevent="if(comboOpen){ selectedTier = tiers[activeComboIdx]; comboOpen = false; }"
          class="w-full px-3.5 py-2.5 text-left text-xs bg-white border border-[#D4D4CE] rounded-lg hover:border-[#1E40AF] flex items-center justify-between"
        >
          <span x-text="selectedTier" class="truncate"></span>
          <span class="text-[#6B7280] font-mono">↕</span>
        </button>

        <ul
          x-show="comboOpen"
          x-transition
          role="listbox"
          class="absolute left-0 right-0 mt-2 bg-white border border-[#D4D4CE] rounded-xl shadow-lg py-1 z-20"
          style="display: none;"
        >
          <template x-for="(tier, idx) in tiers" :key="tier">
            <li
              :id="'tier-opt-' + idx"
              role="option"
              :aria-selected="selectedTier === tier"
              @mouseenter="activeComboIdx = idx"
              @click="selectedTier = tier; comboOpen = false"
              :class="activeComboIdx === idx ? 'bg-[#EEF2FF] text-[#1E40AF]' : 'text-[#111214]'"
              class="px-3.5 py-2 text-xs cursor-pointer"
              x-text="tier"
            ></li>
          </template>
        </ul>
      </div>

      <div class="md:col-span-2">
        <button type="submit" class="w-full px-4 py-2.5 text-xs font-medium bg-[#111214] text-white rounded-lg hover:bg-[#1E40AF] transition-colors whitespace-nowrap">
          Book Slot
        </button>
      </div>
    </form>

    <div id="picker-server-receipt" class="mt-4 text-xs text-[#6B7280]">
      Choose a flight range &amp; placement, then submit to server.
    </div>
  </div>
  `;
}

export function renderStressDemoById(id: string, store: StressStore): string {
  switch (id) {
    case 'high-freq-sliders':
      return renderSliderStressShell(store);
    case 'oob-fragility':
      return renderOobFragilityShell(store);
    case 'media-preview':
      return renderMediaPreviewShell();
    case 'session-collision':
      return renderSessionCollisionShell(store, 'global');
    case 'accessible-picker':
      return renderAccessiblePickerShell();
    default:
      return renderSliderStressShell(store);
  }
}
