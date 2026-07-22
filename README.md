# BES — Business Experience Simulator

**BES** is a fast-paced business simulation game where companies compete over one business year (12 months / 4 quarters). Teams make monthly decisions, react to market events, form partnerships, and pursue objectives and strategic goals. The company with the highest score at the end of the year wins.

This repository contains:

1. **[`bes-game-master-prompt.md`](./bes-game-master-prompt.md)** — the complete Game Master prompt for **Refy**, the AI referee that facilitates, narrates, and scores the game.
2. **A Game Master companion web app** — a React + TypeScript tool that helps a human (or AI) referee run a live BES session: draw market events, run the round timer, and track every team's score.

---

## The Game Master app

A single-page app for running a BES session in real time.

### Features

- **Team setup** — start a business year with 2+ teams.
- **Market Event deck** — draw a random event each month, including the special **HIGH DEMAND YEAR** card that automatically doubles objective points for the round.
- **Round timer** — presets for the 2-minute Decision phase, 1-minute Negotiation, and 1-minute Presentations, with a visual countdown and "TIME!" flag.
- **Live scoring** per the official rules:
  - **Objectives** — 10 or 15 points (doubled during High Demand Year)
  - **Partnerships** — 1–20 points via a slider
  - **Quarter Reviews** — 0–10 points at the end of each quarter
  - **Strategic Goals** — 30 points each at the end of the game
- **Leaderboard** with per-category breakdowns and a market-event log.
- **Auto-save** — the whole game persists in your browser (`localStorage`), so a refresh won't lose progress.

### Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

### Build for production

```bash
npm run build
npm run preview
```

### Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- No backend — all state lives in the browser.

---

## Scoring summary

| Source | Points | Max |
| --- | --- | --- |
| Objectives | 10–15 each (×2 on High Demand Year) | — |
| Quarter Reviews | 10 each × 4 quarters | 40 |
| Strategic Goals | 30 each × 2 goals | 60 |
| Partnerships | 1–20 each, per partnership presented | — |

See [`bes-game-master-prompt.md`](./bes-game-master-prompt.md) for the full rules, time structure, and referee guidelines.
