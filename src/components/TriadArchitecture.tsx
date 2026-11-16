import React, { useState } from 'react';
import { Server } from 'lucide-react';
import SERVER_IMAGE from '../assets/images/craft_server_monolith_1794753276985.jpg';

export function TriadArchitecture() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="architecture" className="py-16 lg:py-24 border-b border-[#E2E2DE]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-medium text-[#1E40AF] mb-2">01. Division of Labor</div>
          <h2
            className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-[#111214]"
            style={{ textWrap: 'balance' }}
          >
            Three sharp primitives instead of a sprawling client framework.
          </h2>
          <p className="mt-4 text-base text-[#4B5563] leading-relaxed">
            Most React complexity stems from duplicating database state into client stores, syncing caches, and
            shipping JSON mappers. This triad assigns every concern to the exact layer built for it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Primary Marquee Bento Card */}
          <div className="lg:col-span-7 bg-white border border-[#E2E2DE] rounded-xl p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 text-xs text-[#6B7280] mb-4">
                <span>Network &amp; DOM Swapping</span>
                <span className="font-mono text-[#1E40AF]">htmx.org@4.0.1 · fetch()</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#111214]">
                HTMX 4.0 replaces XHR with fetch(), core morphing, and &lt;hx-partial&gt;
              </h3>
              <p className="mt-3 text-sm lg:text-base text-[#4B5563] leading-relaxed">
                HTMX 4.0.1 (published on npm under <code className="font-mono text-xs bg-[#F3F3F0] px-1.5 py-0.5 rounded">@next</code>)
                rewrites transport onto native <code className="font-mono text-xs bg-[#F3F3F0] px-1.5 py-0.5 rounded">fetch()</code>,
                builds Idiomorph into core via <code className="font-mono text-xs bg-[#F3F3F0] px-1.5 py-0.5 rounded">innerMorph</code>,
                requires explicit <code className="font-mono text-xs bg-[#F3F3F0] px-1.5 py-0.5 rounded">:inherited</code> modifiers,
                and ships official LLM agent skills in <code className="font-mono text-xs bg-[#F3F3F0] px-1.5 py-0.5 rounded">dist/skills/</code>.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E2E2DE] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-mono font-semibold text-[#111214]">&lt;hx-partial&gt;</div>
                <div className="text-[#6B7280] mt-1">Explicit multi-target updates with relative selectors</div>
              </div>
              <div>
                <div className="font-mono font-semibold text-[#111214]">innerMorph</div>
                <div className="text-[#6B7280] mt-1">Core DOM morphing preserves focus &amp; media state</div>
              </div>
              <div>
                <div className="font-mono font-semibold text-[#111214]">dist/skills/</div>
                <div className="text-[#6B7280] mt-1">Bundled guidance, migration &amp; debug skills for LLMs</div>
              </div>
            </div>
          </div>

          {/* Architectural Photo Card */}
          <div className="lg:col-span-5 bg-white border border-[#E2E2DE] rounded-xl overflow-hidden flex flex-col">
            <div className="flex-1 min-h-[220px] bg-[#E5E5E0]">
              {!imgError ? (
                <img
                  src={SERVER_IMAGE}
                  alt="Minimalist brushed aluminum server blades representing compiled Go and Templ rendering"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-[#374151]">
                  <Server className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">Compiled Go + Templ Server</span>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-[#E2E2DE]">
              <div className="text-xs text-[#6B7280] mb-1">Server Template Compiler · Go + Templ</div>
              <h3 className="font-display text-lg font-semibold text-[#111214]">
                Compile-time checked HTML partials
              </h3>
              <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
                Templ turns <code className="font-mono text-xs bg-[#F3F3F0] px-1 py-0.5 rounded">.templ</code> files
                into strongly-typed Go functions. Missing props or broken imports fail at compile time—never in user browsers.
              </p>
            </div>
          </div>

          {/* Alpine Card */}
          <div className="lg:col-span-5 bg-white border border-[#E2E2DE] rounded-xl p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-3">
                <span>Ephemeral Client UI</span>
                <span className="font-mono text-[#1E40AF]">Alpine.js 3.14</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#111214]">
                Instant local polish where network roundtrips do not belong
              </h3>
              <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">
                Dropdown open states, command-palette arrow navigation, slide-over drawer transitions, checkbox
                selections, and auto-dismissing toast timers execute locally with zero build step.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E2E2DE] font-mono text-xs text-[#111214]">
              x-data · x-show · x-transition · @notify.window
            </div>
          </div>

          {/* Code Flow Strip Card */}
          <div className="lg:col-span-7 bg-[#141518] text-[#E4E4E7] rounded-xl p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#93C5FD] mb-3">End-to-End Request Lifecycle</div>
              <h3 className="font-display text-xl font-semibold text-white">
                One request, one typed Go handler, zero client state drift
              </h3>
            </div>
            <pre className="mt-5 p-4 rounded-lg bg-[#0D0E10] border border-white/10 text-xs font-mono leading-relaxed overflow-x-auto text-[#D4D4D8]">
{`func HandleMoveTask(w http.ResponseWriter, r *http.Request) {
    tasks := store.MoveTask(r.FormValue("id"), r.FormValue("to"))
    w.Header().Set("HX-Trigger", \`{"notify":{"title":"Moved"}}\`)
    // Streams updated Kanban columns + hx-swap-oob summary directly:
    components.KanbanMoveResponse(tasks).Render(r.Context(), w)
}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
