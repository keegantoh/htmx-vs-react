import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { STRESS_TEST_SPECS } from '../data/stressSpecs';
import { mountHtmlStage, subscribeWireExchanges } from '../lib/hypermediaRuntime';
import type { StressTestId, WireExchange } from '../types/hypermedia';

export function StressTestLab() {
  const [activeId, setActiveId] = useState<StressTestId>('high-freq-sliders');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latestWire, setLatestWire] = useState<WireExchange | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const activeSpec = STRESS_TEST_SPECS.find((s) => s.id === activeId) || STRESS_TEST_SPECS[0];

  useEffect(() => {
    const unsubscribe = subscribeWireExchanges((exchange) => {
      if (exchange.url.includes('/api/htmx/stress/')) {
        setLatestWire(exchange);
      }
    });
    return unsubscribe;
  }, []);

  const loadStressDemo = async (id: StressTestId, isReset = false) => {
    setLoading(true);
    setError(null);
    const url = isReset ? `/api/htmx/stress/reset/${id}` : `/api/htmx/stress/demo/${id}`;
    const method = isReset ? 'POST' : 'GET';
    try {
      const res = await fetch(url, { method });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      if (stageRef.current) {
        mountHtmlStage(stageRef.current, html);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stress test');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStressDemo(activeId, false);
  }, [activeId]);

  return (
    <section id="stress-tests" className="py-16 lg:py-24 border-b border-[#E2E2DE] bg-[#F2F2EE]/60">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-[#B45309] mb-2">03. Live Stress Tests — Where HTMX Hurts</div>
            <h2
              className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-[#111214]"
              style={{ textWrap: 'balance' }}
            >
              Test the five hard edges before committing your architecture.
            </h2>
            <p className="mt-3 text-base text-[#4B5563] leading-relaxed">
              HTMX 4.0 solves CRUD and multi-region partials cleanly—but 60fps sliders, silent ID coupling, local
              media previews, multi-user ephemeral state, and accessible primitives expose real trade-offs. Try each
              one live below.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadStressDemo(activeId, true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-[#D4D4CE] bg-white text-[#111214] rounded-lg hover:border-[#111214] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stress Test</span>
          </button>
        </div>

        {/* Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#E6E6E0] rounded-xl overflow-x-auto mb-8">
          {STRESS_TEST_SPECS.map((spec) => {
            const isActive = spec.id === activeId;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setActiveId(spec.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-white text-[#111214] shadow-sm' : 'text-[#4B5563] hover:text-[#111214]'
                }`}
              >
                {spec.index}. {spec.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Context & Friction Summary */}
        <div className="mb-6 bg-white border border-[#E2E2DE] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
              <span className="font-medium text-[#B45309]">Friction Rating: {activeSpec.frictionLevel}</span>
              <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
              <span className="font-mono text-[#4B5563]">{activeSpec.customJsLines} lines custom JS/Alpine needed</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-[#111214]">{activeSpec.title}</h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">{activeSpec.problemSummary}</p>
          </div>
          {latestWire && (
            <div className="p-3.5 bg-[#141518] text-[#E4E4E7] rounded-lg text-xs font-mono shrink-0 min-w-[260px]">
              <div className="text-[#93C5FD] truncate">
                {latestWire.method} {latestWire.url}
              </div>
              <div className="mt-1 text-[#A1A1AA] flex items-center gap-2">
                <span className="tabular-nums text-emerald-400">{latestWire.status}</span>
                <span>·</span>
                <span className="tabular-nums">{latestWire.durationMs} ms</span>
                <span>·</span>
                <span className="tabular-nums">{latestWire.bytes} B</span>
              </div>
              {latestWire.oobTargets.length > 0 && (
                <div className="mt-1 text-[#FBBF24] truncate">{latestWire.oobTargets.join(' · ')}</div>
              )}
            </div>
          )}
        </div>

        {/* Live Stress Stage */}
        <div>
          {loading && <div className="mb-3 text-xs font-mono text-[#1E40AF]">Mounting live HTMX 4 stress stage...</div>}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              Error loading stress stage: {error}
            </div>
          )}
          <div ref={stageRef} id="htmx-stress-stage" />
        </div>

        {/* Verdict & HTMX 4 Analysis Strip */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-[#E2E2DE] rounded-xl p-5">
            <div className="text-xs font-medium text-[#1E40AF] mb-1.5">What HTMX 4.0 Improves</div>
            <p className="text-sm text-[#374151] leading-relaxed">{activeSpec.htmx4Help}</p>
          </div>
          <div className="bg-white border border-[#E2E2DE] rounded-xl p-5">
            <div className="text-xs font-medium text-[#111214] mb-1.5">The Honest Engineering Reality</div>
            <p className="text-sm text-[#374151] leading-relaxed">{activeSpec.whereCustomJsWins}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
