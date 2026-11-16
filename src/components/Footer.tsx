import React from 'react';

export function Footer() {
  return (
    <footer className="py-12 bg-[#F7F7F5]">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm text-[#4B5563]">
        <div>
          <span className="font-display font-bold text-[#111214]">Hypermedia Stack</span>
          <span className="mx-2 text-[#D1D5DB]" aria-hidden="true">·</span>
          <span className="text-xs">HTMX 4.0.1 · Alpine.js 3.14 · Go Templ</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
          <a href="#architecture" className="hover:text-[#111214] transition-colors">HTMX 4.0</a>
          <a href="#crucible" className="hover:text-[#111214] transition-colors">Components</a>
          <a href="#stress-tests" className="hover:text-[#111214] transition-colors">Stress Tests</a>
          <a href="#benchmarks" className="hover:text-[#111214] transition-colors">Benchmarks</a>
          <a href="/standalone" className="hover:text-[#1E40AF] transition-colors">Pure SSR Demo</a>
        </div>
      </div>
    </footer>
  );
}
