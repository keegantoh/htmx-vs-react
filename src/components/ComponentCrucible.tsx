import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, RotateCcw } from 'lucide-react';
import { COMPONENT_SPECS } from '../data/componentSpecs';
import { mountHtmlStage, subscribeWireExchanges } from '../lib/hypermediaRuntime';
import type { ComponentDemoId, WireExchange } from '../types/hypermedia';

type InspectorTab = 'wire' | 'templ' | 'react';

export function ComponentCrucible() {
  const [activeId, setActiveId] = useState<ComponentDemoId>('command-palette');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('wire');
  const [wireLogs, setWireLogs] = useState<WireExchange[]>([]);
  const [loadingStage, setLoadingStage] = useState<boolean>(true);
  const [stageError, setStageError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeSpec = COMPONENT_SPECS.find((s) => s.id === activeId) || COMPONENT_SPECS[0];

  useEffect(() => {
    const unsubscribe = subscribeWireExchanges((exchange) => {
      if (!exchange.url.includes('/api/htmx/stress/')) {
        setWireLogs((prev) => [exchange, ...prev].slice(0, 12));
      }
    });
    return unsubscribe;
  }, []);

  const loadDemoHtml = async (id: ComponentDemoId, isReset = false) => {
    setLoadingStage(true);
    setStageError(null);
    const endpoint = isReset ? `/api/htmx/reset/${id}` : `/api/htmx/demo/${id}`;
    const method = isReset ? 'POST' : 'GET';
    const start = performance.now();

    try {
      const res = await fetch(endpoint, { method });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const html = await res.text();
      const durationMs = Math.max(1, Math.round(performance.now() - start));

      if (stageRef.current) {
        mountHtmlStage(stageRef.current, html);
      }

      setWireLogs((prev) => [
        {
          id: `mount-${Date.now()}`,
          method,
          url: endpoint,
          status: res.status,
          durationMs,
          bytes: new Blob([html]).size,
          hxTrigger: res.headers.get('HX-Trigger') || undefined,
          oobTargets: [],
          htmlPayload: html,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        },
        ...prev,
      ].slice(0, 12));
    } catch (err) {
      setStageError(err instanceof Error ? err.message : 'Failed to load HTMX partial');
    } finally {
      setLoadingStage(false);
    }
  };

  useEffect(() => {
    loadDemoHtml(activeId, false);
  }, [activeId]);

  const handleCopyCode = async () => {
    const text = inspectorTab === 'react' ? activeSpec.reactEquivalentCode : activeSpec.templCode;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="crucible" className="py-16 lg:py-24 border-b border-[#E2E2DE]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-[#1E40AF] mb-2">02. Live Component Crucible</div>
            <h2
              className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-[#111214]"
              style={{ textWrap: 'balance' }}
            >
              Seven React-grade UI patterns running on real HTMX 4.0 &amp; Alpine.
            </h2>
            <p className="mt-3 text-base text-[#4B5563] leading-relaxed">
              Every control inside the stage below executes real <code className="font-mono text-xs bg-[#EFEFED] px-1.5 py-0.5 rounded">fetch()</code> requests against Express HTML endpoints and
              updates the DOM through live <code className="font-mono text-xs bg-[#EFEFED] px-1.5 py-0.5 rounded">htmx.org@4.0.1</code> and{' '}
              <code className="font-mono text-xs bg-[#EFEFED] px-1.5 py-0.5 rounded">alpinejs</code> runtimes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => loadDemoHtml(activeId, true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-[#D4D4CE] bg-white text-[#111214] rounded-lg hover:border-[#111214] transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
            <a
              href="/standalone"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-[#111214] text-white rounded-lg hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Pure SSR Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Component Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#EFEFED] rounded-xl overflow-x-auto mb-8">
          {COMPONENT_SPECS.map((spec) => {
            const isActive = spec.id === activeId;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setActiveId(spec.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-[#111214] shadow-sm'
                    : 'text-[#4B5563] hover:text-[#111214]'
                }`}
              >
                {spec.index}. {spec.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Active Component Header Context */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#111214]">{activeSpec.title}</h3>
            <p className="text-sm text-[#4B5563] mt-1 max-w-3xl">{activeSpec.summary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#4B5563] shrink-0">
            <span>{activeSpec.templLines} lines Templ</span>
            <span aria-hidden="true">·</span>
            <span>vs {activeSpec.reactLines} lines React</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#1E40AF] font-medium">-{activeSpec.clientJsSavedKb} JS</span>
          </div>
        </div>

        {/* Live HTMX + Alpine Interactive Stage */}
        <div className="relative">
          {loadingStage && (
            <div className="mb-3 text-xs font-mono text-[#1E40AF]">Loading HTML partial from server...</div>
          )}
          {stageError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              Error loading HTMX component: {stageError}
            </div>
          )}
          <div ref={stageRef} id="htmx-stage" />
        </div>

        {/* Source & Live Wire Inspector */}
        <div className="mt-8 bg-[#141518] text-[#E4E4E7] rounded-xl overflow-hidden border border-[#27272A]">
          <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#0D0E10]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setInspectorTab('wire')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  inspectorTab === 'wire'
                    ? 'bg-[#1E40AF] text-white'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Live HTTP Wire ({wireLogs.length})
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('templ')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  inspectorTab === 'templ'
                    ? 'bg-[#1E40AF] text-white'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                {activeSpec.templFileName}
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('react')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  inspectorTab === 'react'
                    ? 'bg-[#1E40AF] text-white'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                React Equivalent ({activeSpec.reactLines} LOC)
              </button>
            </div>

            {inspectorTab !== 'wire' ? (
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E4E4E7] border border-white/15 rounded-md hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setWireLogs([])}
                className="text-xs text-[#A1A1AA] hover:text-white transition-colors whitespace-nowrap"
              >
                Clear Wire Log
              </button>
            )}
          </div>

          {inspectorTab === 'wire' && (
            <div className="p-5">
              {wireLogs.length === 0 ? (
                <p className="text-xs font-mono text-[#A1A1AA]">
                  Interact with the component above to inspect real HTML partials transmitted over HTTP.
                </p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-5 divide-y divide-white/10 border border-white/10 rounded-lg bg-[#0D0E10] max-h-[260px] overflow-y-auto">
                    {wireLogs.map((log, i) => (
                      <div key={log.id} className={`p-3 text-xs ${i === 0 ? 'bg-[#1E40AF]/15' : ''}`}>
                        <div className="flex items-center justify-between gap-2 font-mono">
                          <span className="text-[#93C5FD] font-semibold">
                            {log.method} {log.url}
                          </span>
                          <span className="tabular-nums text-emerald-400">{log.status}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-[#A1A1AA]">
                          <span className="tabular-nums">{log.durationMs} ms</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{log.bytes} B HTML</span>
                          {log.oobTargets.length > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#FBBF24]">OOB: {log.oobTargets.join(', ')}</span>
                            </>
                          )}
                        </div>
                        {log.hxTrigger && (
                          <div className="mt-1 text-[11px] font-mono text-emerald-300 truncate">
                            HX-Trigger: {log.hxTrigger}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="lg:col-span-7 border border-white/10 rounded-lg bg-[#0D0E10] p-4 max-h-[260px] overflow-auto">
                    <div className="text-[11px] font-mono text-[#A1A1AA] mb-2">
                      Latest Server HTML Partial ({wireLogs[0].bytes} bytes)
                    </div>
                    <pre className="text-xs font-mono text-[#D4D4D8] whitespace-pre-wrap break-all leading-relaxed">
                      {wireLogs[0].htmlPayload.slice(0, 1400)}
                      {wireLogs[0].htmlPayload.length > 1400 ? '\n... (truncated preview)' : ''}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {inspectorTab === 'templ' && (
            <pre className="p-5 text-xs font-mono text-[#E4E4E7] overflow-x-auto leading-relaxed max-h-[340px]">
              {activeSpec.templCode}
            </pre>
          )}

          {inspectorTab === 'react' && (
            <pre className="p-5 text-xs font-mono text-[#D4D4D8] overflow-x-auto leading-relaxed max-h-[340px]">
              {activeSpec.reactEquivalentCode}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
