export type ComponentDemoId =
  | 'command-palette'
  | 'kanban-oob'
  | 'inline-grid'
  | 'wizard-form'
  | 'sse-stream'
  | 'drawer-feed'
  | 'faceted-morph';

export type StressTestId =
  | 'high-freq-sliders'
  | 'oob-fragility'
  | 'media-preview'
  | 'session-collision'
  | 'accessible-picker';

export interface WireExchange {
  id: string;
  method: string;
  url: string;
  status: number;
  durationMs: number;
  bytes: number;
  hxTrigger?: string;
  oobTargets: string[];
  htmlPayload: string;
  timestamp: string;
}

export interface ComponentSpec {
  id: ComponentDemoId;
  index: string;
  title: string;
  shortLabel: string;
  summary: string;
  htmxFeatures: string[];
  alpineFeatures: string[];
  templFileName: string;
  templCode: string;
  reactEquivalentCode: string;
  reactLines: number;
  templLines: number;
  clientJsSavedKb: string;
}

export interface StressTestSpec {
  id: StressTestId;
  index: string;
  title: string;
  shortLabel: string;
  frictionLevel: 'Medium-High' | 'High' | 'Painful';
  problemSummary: string;
  htmx4Help: string;
  whereCustomJsWins: string;
  customJsLines: number;
}
