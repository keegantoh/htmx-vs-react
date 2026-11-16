import React from 'react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-sm border-b border-[#E2E2DE]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <a
          href="#"
          className="font-display text-lg font-bold tracking-tight text-[#111214] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF]"
        >
          Hypermedia Stack
        </a>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B5563]">
          <a
            href="#architecture"
            className="hover:text-[#111214] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF]"
          >
            HTMX 4.0
          </a>
          <a
            href="#crucible"
            className="hover:text-[#111214] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF]"
          >
            Components
          </a>
          <a
            href="#stress-tests"
            className="hover:text-[#111214] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF]"
          >
            Stress Tests
          </a>
          <a
            href="#benchmarks"
            className="hover:text-[#111214] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF]"
          >
            Benchmarks
          </a>
        </nav>

        <div className="shrink-0">
          <a
            href="#stress-tests"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
          >
            Run Stress Tests
          </a>
        </div>
      </div>
    </header>
  );
}
