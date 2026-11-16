import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { COMPARISON_ROWS } from '../data/componentSpecs';
import DESK_IMAGE from '../assets/images/editorial_compiler_desk_1794753277597.jpg';

export function ComparisonLedger() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="benchmarks" className="py-16 lg:py-24 border-b border-[#E2E2DE]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-12">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="text-xs font-medium text-[#1E40AF] mb-2">04. Engineering Ledger</div>
            <h2
              className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-[#111214]"
              style={{ textWrap: 'balance' }}
            >
              An honest comparison: where hypermedia wins—and where React still fits.
            </h2>
            <p className="mt-4 text-base text-[#4B5563] leading-relaxed">
              For CRUD applications, SaaS dashboards, internal tools, e-commerce, and content workflows, shipping
              compiled HTML fragments eliminates client state synchronization overhead. Yet architectural honesty
              matters: dense 60fps canvas editors and offline-first local apps remain React&apos;s home turf.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full min-h-[220px] rounded-xl overflow-hidden border border-[#E2E2DE] bg-white">
              {!imgError ? (
                <img
                  src={DESK_IMAGE}
                  alt="Overhead view of an engineer drafting desk with printed wireframe cards and mechanical keyboard"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#EFEFED] text-[#374151]">
                  <Layers className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">Architecture Craft &amp; Benchmarks</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clean Tabular Comparison */}
        <div className="bg-white border border-[#E2E2DE] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E2DE] bg-[#FAFAF8] text-xs font-semibold text-[#111214]">
                  <th className="py-3.5 px-5 w-48">Engineering Dimension</th>
                  <th className="py-3.5 px-5">HTMX 4.0 + Alpine + Templ</th>
                  <th className="py-3.5 px-5">React / Next.js SPA</th>
                  <th className="py-3.5 px-5 w-52">Practical Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0EC] text-sm">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.dimension} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-4 px-5 font-medium text-[#111214] align-top">{row.dimension}</td>
                    <td className="py-4 px-5 text-[#111214] align-top">{row.hypermedia}</td>
                    <td className="py-4 px-5 text-[#4B5563] align-top">{row.reactSpa}</td>
                    <td className="py-4 px-5 font-mono text-xs text-[#1E40AF] font-medium align-top">
                      {row.verdict}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
