import React, { useState } from 'react';
import { ArrowRight, Code2 } from 'lucide-react';
import HERO_IMAGE from '../assets/images/hero_hypermedia_blueprint_1794753276398.jpg';

const PROOF_METRICS = [
  {
    value: '14.2 KB',
    label: 'Gzipped JS Runtime',
    context: 'HTMX 4.0.1 + Alpine 3.14 combined',
  },
  {
    value: '0 ms',
    label: 'Hydration Blocking',
    context: 'Interactive on first HTML byte',
  },
  {
    value: '12',
    label: 'Live Components & Stress Tests',
    context: 'Executed over real fetch() HTML swaps',
  },
  {
    value: '1 Binary',
    label: 'Deployment Artifact',
    context: 'Go + Templ compiled server output',
  },
];

export function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E2E2DE]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#4B5563] mb-5">
                <span>HTMX 4.0.1</span>
                <span aria-hidden="true">·</span>
                <span>Alpine.js 3.14</span>
                <span aria-hidden="true">·</span>
                <span>Go Templ</span>
              </div>

              <h1
                className="font-display font-bold tracking-tight text-[#111214] leading-[1.06]"
                style={{ fontSize: 'clamp(2.35rem, 4.1vw, 3.85rem)', textWrap: 'balance' }}
              >
                Modern UI velocity without the JavaScript tax.
              </h1>

              <p className="mt-6 text-base lg:text-[17px] text-[#374151] leading-relaxed max-w-[60ch]">
                Command palettes, Kanban boards with atomic out-of-band counters, inline-editable data grids,
                and live SSE streams—shipped as type-safe HTML fragments straight from your server.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#crucible"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
              >
                <span>Explore Live Crucible</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#benchmarks"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#111214] hover:text-[#1E40AF] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Compare with React</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex">
            <div className="w-full rounded-xl overflow-hidden border border-[#E2E2DE] bg-white flex flex-col">
              <div className="relative flex-1 min-h-[260px] lg:min-h-[340px] bg-[#141518]">
                {!imgError ? (
                  <img
                    src={HERO_IMAGE}
                    alt="Letterpress metal blocks and architectural blueprint paper representing direct hypermedia transmission"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full lg:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-[#E4E4E7] bg-gradient-to-br from-[#18191D] to-[#111214]">
                    <Code2 className="w-10 h-10 text-[#60A5FA] mb-3" />
                    <span className="text-sm font-medium">Hypermedia Transmission Blueprint</span>
                  </div>
                )}
              </div>
              <div className="px-5 py-3.5 border-t border-[#E2E2DE] bg-white flex items-center justify-between gap-4 text-xs text-[#4B5563]">
                <span>Server-rendered HTML over the wire</span>
                <span className="font-mono tabular-nums text-[#111214]">text/html · 0% hydration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Strip */}
        <div className="mt-12 pt-10 border-t border-[#E2E2DE] grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PROOF_METRICS.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="font-mono tabular-nums text-2xl lg:text-3xl font-semibold tracking-tight text-[#111214]">
                {item.value}
              </div>
              <div className="text-sm font-medium text-[#111214]">{item.label}</div>
              <div className="text-xs text-[#6B7280]">{item.context}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
