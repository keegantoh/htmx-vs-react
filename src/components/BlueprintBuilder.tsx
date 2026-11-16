import React, { useMemo, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';

interface FeatureOption {
  id: string;
  label: string;
  summary: string;
}

const FEATURE_OPTIONS: FeatureOption[] = [
  { id: 'oob', label: 'HTMX 4 <hx-partial>', summary: '<hx-partial hx-target="#badge">' },
  { id: 'alpine', label: 'Alpine Focus & Toasts', summary: 'x-data + @notify.window bus' },
  { id: 'sse', label: 'SSE HTML Streaming', summary: 'hx-sse.js partial chunks' },
  { id: 'transitions', label: 'Native View Transitions', summary: 'transitions:true in htmx-config' },
];

export function BlueprintBuilder() {
  const [appName, setAppName] = useState('acme-hypermedia');
  const [selected, setSelected] = useState<string[]>(['oob', 'alpine', 'transitions']);
  const [copied, setCopied] = useState(false);

  const toggleFeature = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const generatedTempl = useMemo(() => {
    const cleanName = appName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'hypermedia-app';
    const hasAlpine = selected.includes('alpine');
    const hasOob = selected.includes('oob');
    const hasSse = selected.includes('sse');
    const hasTransitions = selected.includes('transitions');

    return `// ${cleanName}/components/layout.templ
package components

templ BaseShell(title string) {
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>{ title }</title>
      <script src="/static/htmx.min.js" defer></script>${
        hasAlpine
          ? `\n      <script src="/static/hx-alpine-compat.js" defer></script>\n      <script src="/static/alpine.min.js" defer></script>`
          : ''
      }${
        hasSse ? `\n      <script src="/static/hx-sse.js" defer></script>` : ''
      }${
        hasTransitions
          ? `\n      <meta name="htmx-config" content="transitions:true, defaultSwap:innerMorph" />`
          : ''
      }
    </head>
    <body${hasAlpine ? ` x-data="{ toasts: [] }" @notify.window="toasts.push($event.detail)"` : ''}>
      <header class="border-b px-6 py-4 flex justify-between">
        <strong>${cleanName}</strong>${
          hasOob ? `\n        <span id="header-badge-count" class="font-mono">0 active</span>` : ''
        }
      </header>
      <main id="app-stage" hx-boost:inherited="true">
        { children... }
      </main>${
        hasSse
          ? `\n      <section sse-connect="/events" sse-swap="step" hx-swap="beforeend"></section>`
          : ''
      }
    </body>
  </html>
}`;
  }, [appName, selected]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedTempl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedTempl], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.templ';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="blueprint" className="py-16 lg:py-24 border-b border-[#E2E2DE]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-medium text-[#1E40AF] mb-2">05. Starter Scaffold</div>
          <h2
            className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-[#111214]"
            style={{ textWrap: 'balance' }}
          >
            Compose a production Templ + HTMX shell in seconds.
          </h2>
          <p className="mt-3 text-base text-[#4B5563] leading-relaxed">
            Select the hypermedia primitives your application needs and download a clean <code className="font-mono text-xs bg-[#EFEFED] px-1.5 py-0.5 rounded">layout.templ</code> entrypoint.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-white border border-[#E2E2DE] rounded-xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <label htmlFor="scaffold-app-name" className="block text-xs font-medium text-[#111214] mb-1.5">
                  Project Module Name
                </label>
                <input
                  id="scaffold-app-name"
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-[#D4D4CE] rounded-lg focus:outline-none focus:border-[#1E40AF]"
                />
              </div>

              <div>
                <div className="text-xs font-medium text-[#111214] mb-3">Included Capabilities</div>
                <div className="space-y-2.5">
                  {FEATURE_OPTIONS.map((opt) => {
                    const checked = selected.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          checked ? 'border-[#1E40AF] bg-[#EEF2FF]/50' : 'border-[#E2E2DE] hover:bg-[#FAFAF8]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFeature(opt.id)}
                          className="mt-0.5 w-4 h-4 rounded border-[#D4D4CE] text-[#1E40AF] focus:ring-[#1E40AF]"
                        />
                        <div>
                          <div className="text-sm font-medium text-[#111214]">{opt.label}</div>
                          <div className="text-xs font-mono text-[#6B7280] mt-0.5">{opt.summary}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E2E2DE] flex items-center justify-between text-xs text-[#6B7280]">
              <span>Go 1.23+ · Templ v0.3</span>
              <span className="font-mono tabular-nums">{selected.length} modules enabled</span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#141518] text-[#E4E4E7] rounded-xl overflow-hidden border border-[#27272A] flex flex-col">
            <div className="px-5 py-3 border-b border-white/10 bg-[#0D0E10] flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-[#A1A1AA]">components/layout.templ</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-white/15 rounded-md hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1E40AF] text-white rounded-md hover:bg-[#1E3A8A] transition-colors whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .templ</span>
                </button>
              </div>
            </div>

            <pre className="p-5 text-xs font-mono text-[#E4E4E7] leading-relaxed overflow-x-auto flex-1">
              {generatedTempl}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
