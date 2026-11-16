import htmx, { type HtmxEvent } from 'htmx.org';
import Alpine from 'alpinejs';
import type { WireExchange } from '../types/hypermedia';

declare global {
  interface Window {
    htmx: typeof htmx;
    Alpine: typeof Alpine;
    __geodesicCreativePreview?: {
      dataUrl: string;
      width: number;
      height: number;
      name: string;
    } | null;
    __geodesicReinjectPreview?: () => void;
  }
}

type WireListener = (exchange: WireExchange) => void;
const listeners = new Set<WireListener>();
let initialized = false;
const requestStartTimes = new WeakMap<EventTarget, number>();

export function subscribeWireExchanges(listener: WireListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function extractTargets(html: string): string[] {
  const matches = new Set<string>();
  const oobRegex = /id=["']([^"']+)["'][^>]*hx-swap-oob/g;
  let m: RegExpExecArray | null;
  while ((m = oobRegex.exec(html)) !== null) {
    matches.add(`oob:#${m[1]}`);
  }
  const partialRegex = /<hx-partial[^>]*hx-target=["']([^"']+)["']/g;
  while ((m = partialRegex.exec(html)) !== null) {
    matches.add(`partial:${m[1]}`);
  }
  return Array.from(matches);
}

export async function initHypermediaRuntime(): Promise<void> {
  if (initialized) return;
  initialized = true;

  window.htmx = htmx;
  window.Alpine = Alpine;

  // HTMX 4.0 configuration
  htmx.config.transitions = true;
  htmx.config.defaultSwap = 'innerHTML';
  htmx.config.history = false;

  // Load official HTMX 4 Alpine compatibility extension for morph state preservation
  try {
    await import('htmx.org/dist/ext/hx-alpine-compat.js');
  } catch {
    // Fallback cleanly if extension path unavailable
  }

  // Creative Compliance preview re-injection helper (demonstrating Stress Test 3 workaround)
  window.__geodesicReinjectPreview = () => {
    const data = window.__geodesicCreativePreview;
    const screen = document.getElementById('led-mockup-screen');
    if (data && screen) {
      screen.innerHTML = `<img src="${data.dataUrl}" alt="${data.name}" class="w-full h-full object-contain" />`;
    }
  };

  htmx.on('htmx:before:request', (evt: HtmxEvent<'htmx:before:request'>) => {
    const src = evt.detail?.ctx?.sourceElement;
    if (src) {
      requestStartTimes.set(src, performance.now());
    }
  });

  htmx.on('htmx:after:request', (evt: HtmxEvent<'htmx:after:request'>) => {
    const ctx = evt.detail?.ctx;
    if (!ctx) return;

    const start = ctx.sourceElement ? requestStartTimes.get(ctx.sourceElement) : undefined;
    const durationMs = start ? Math.max(1, Math.round(performance.now() - start)) : 4;
    const htmlPayload = ctx.text || '';
    const method = (ctx.request?.method || 'GET').toUpperCase();
    const url = ctx.request?.action || '/api/htmx';
    const status = ctx.response?.status ?? 200;
    const hxTrigger = ctx.response?.headers?.get('HX-Trigger') || undefined;

    const exchange: WireExchange = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      method,
      url,
      status,
      durationMs,
      bytes: new Blob([htmlPayload]).size,
      hxTrigger,
      oobTargets: extractTargets(htmlPayload),
      htmlPayload,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };

    listeners.forEach((fn) => fn(exchange));
  });

  htmx.on('htmx:after:swap', () => {
    const preserveMode = document.getElementById('creative-reinject-flag');
    if (preserveMode && preserveMode.getAttribute('data-reinject') === 'true') {
      window.__geodesicReinjectPreview?.();
    }
  });

  Alpine.start();
}

export function mountHtmlStage(container: HTMLElement, html: string): void {
  container.innerHTML = html;
  htmx.process(container);
  Alpine.initTree(container);
}
