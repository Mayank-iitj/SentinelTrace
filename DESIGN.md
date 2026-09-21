# SentinelTrace — Design

## 1. Design Principles

- **Legible in 3 seconds.** A judge glancing at the dashboard mid-pitch should understand "something got flagged, here's why, here's how fast" without narration.
- **Evidence over assertion.** Every flag shows the exact triggering tool-call pair and matched technique — never just a red banner.
- **Minimal, high-contrast, no chrome.** Clean typographic hierarchy, generous whitespace, restrained color use — flat surfaces, no gradients/skeuomorphism, one accent color reserved solely for alerts.

## 2. Information Architecture

```
Dashboard
├── Live Feed (primary view)
│   ├── Session status (clean / flagged) — per active session
│   └── Flagged Event Card (expandable)
│       ├── Technique ID + name (e.g., "T1 — Privilege Escalation Chain")
│       ├── Severity badge
│       ├── Triggering tool-call pair (highlighted)
│       ├── Latency-to-detect (ms)
│       └── Confidence (from classifier)
├── Technique Reference Panel (side panel)
│   └── T1–T5 definitions, always visible for judge legibility
└── Metrics Strip (top bar)
    ├── False positive rate (clean sessions)
    ├── Avg detection latency
    └── Sessions monitored / events processed
```

## 3. Key Screens

**Screen 1 — Live Feed (default view)**
Central column of session cards. Clean sessions sit quiet and green. A flagged session animates into view with a single, deliberate transition (no flashing/strobing — keep it demo-safe) and expands to show the triggering pair.

**Screen 2 — Flagged Event Detail**
On click/expand: full trace window (last N events), the exact two-event pair that triggered the match, technique definition inline, severity, and a timestamp-to-detect readout in monospace for precision framing.

**Screen 3 — Metrics Strip**
Always visible, top of screen. Three numbers only: false-positive rate, avg latency, events processed. This is the strip judges will screenshot — keep it numerically honest and update live, not static.

## 4. Visual System

| Element | Treatment |
|---|---|
| Typography | One typeface, two weights (regular/bold) — system font stack or Inter, no decorative fonts |
| Color | Neutral dark/light base; single accent (red/amber) reserved exclusively for flagged severity — never used decoratively elsewhere |
| Layout | Flat cards, consistent 8px spacing grid, no drop shadows beyond a subtle 1px border for card separation |
| Motion | Minimal — one entrance transition for new flags, nothing else animates. Motion communicates state change, not decoration |
| Data density | Numbers in monospace where precision matters (latency, timestamps); everything else in default weight |

## 5. Interaction Patterns for Live Demo

- Flag detail expands on click, not hover — avoids accidental triggers while presenting
- Latency-to-detect number counts up from ingest timestamp in real time, so the audience watches the actual measurement happen rather than reading a static number
- Technique Reference Panel stays pinned so the audience can self-map T1/T2/T3 labels without you re-explaining them mid-pitch

## 6. What "Framer style" means here, applied

Clean single-purpose screens, restrained color, strong typographic hierarchy, no unnecessary chrome, motion used only to signal state — not to decorate. The dashboard should read like a product screenshot, not a hackathon debug console.
