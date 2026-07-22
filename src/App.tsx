import { useMemo, useState } from "react";
import { MarketEvent } from "./MarketEvent";
import { Timer } from "./Timer";
import { TeamPanel } from "./TeamPanel";
import { usePersistentState } from "./storage";
import { DEFAULT_TEAM_NAMES, MarketEventCard } from "./data";
import {
  GameState,
  isQuarterEnd,
  newId,
  quarterOf,
  ScoreKind,
  Team,
  teamTotal,
  TOTAL_ROUNDS,
} from "./model";

const EMPTY_GAME: GameState = {
  teams: [],
  round: 1,
  highDemandActive: false,
  eventLog: [],
  started: false,
};

export function App() {
  const [game, setGame] = usePersistentState<GameState>("bes-game", EMPTY_GAME);
  const [currentEvent, setCurrentEvent] = useState<MarketEventCard | null>(null);

  if (!game.started) {
    return <Setup onStart={(teams) => setGame({ ...EMPTY_GAME, teams, started: true })} />;
  }

  function drawEvent(card: MarketEventCard) {
    setCurrentEvent(card);
    const highDemand = card.name === "HIGH DEMAND YEAR";
    setGame((g) => ({
      ...g,
      highDemandActive: highDemand,
      eventLog: [
        { id: newId(), round: g.round, event: card.name, highDemand },
        ...g.eventLog,
      ],
    }));
  }

  function award(teamId: string, kind: ScoreKind, points: number, note: string) {
    setGame((g) => ({
      ...g,
      teams: g.teams.map((t) =>
        t.id === teamId
          ? { ...t, entries: [...t.entries, { id: newId(), kind, points, round: g.round, note }] }
          : t
      ),
    }));
  }

  function undo(teamId: string) {
    setGame((g) => ({
      ...g,
      teams: g.teams.map((t) =>
        t.id === teamId ? { ...t, entries: t.entries.slice(0, -1) } : t
      ),
    }));
  }

  function advanceRound() {
    setGame((g) => {
      if (g.round >= TOTAL_ROUNDS) return g;
      return { ...g, round: g.round + 1, highDemandActive: false };
    });
    setCurrentEvent(null);
  }

  function resetGame() {
    if (confirm("Reset the entire game? All scores will be lost.")) {
      setGame(EMPTY_GAME);
      setCurrentEvent(null);
    }
  }

  const ranked = useMemo(
    () => [...game.teams].sort((a, b) => teamTotal(b) - teamTotal(a)),
    [game.teams]
  );
  const rankById = new Map(ranked.map((t, i) => [t.id, i + 1]));

  const quarter = quarterOf(game.round);
  const atQuarterEnd = isQuarterEnd(game.round);
  const finalRound = game.round >= TOTAL_ROUNDS;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__logo">BES</span>
          <span className="topbar__sub">Business Experience Simulator</span>
        </div>
        <div className="topbar__progress">
          <div className="round-pill">
            Month <strong>{game.round}</strong> / {TOTAL_ROUNDS}
          </div>
          <div className="round-pill round-pill--q">Quarter {quarter} / 4</div>
          {game.highDemandActive && (
            <div className="round-pill round-pill--hot">HIGH DEMAND ×2</div>
          )}
        </div>
        <div className="topbar__actions">
          <button className="btn btn--primary" onClick={advanceRound} disabled={finalRound}>
            {finalRound ? "Final Month" : "Next Month →"}
          </button>
          <button className="btn btn--ghost" onClick={resetGame}>
            Reset
          </button>
        </div>
      </header>

      {atQuarterEnd && (
        <div className="banner">
          End of Quarter {quarter} — run 1-minute presentations and award each team a
          Quarter Review score (0–10).
        </div>
      )}
      {finalRound && (
        <div className="banner banner--final">
          Final month — evaluate Strategic Goals (30 pts each). Highest total wins!
        </div>
      )}

      <main className="grid">
        <section className="col">
          <MarketEvent round={game.round} current={currentEvent} onDraw={drawEvent} />
          <div className="panel">
            <h2>Round Timer</h2>
            <Timer />
          </div>
          <Leaderboard teams={ranked} />
        </section>

        <section className="col col--wide">
          <div className="teams">
            {game.teams.map((t) => (
              <TeamPanel
                key={t.id}
                team={t}
                rank={rankById.get(t.id) ?? 0}
                highDemandActive={game.highDemandActive}
                onAward={(kind, points, note) => award(t.id, kind, points, note)}
                onUndo={() => undo(t.id)}
                canUndo={t.entries.length > 0}
              />
            ))}
          </div>
          <EventLog game={game} />
        </section>
      </main>
    </div>
  );
}

function Leaderboard({ teams }: { teams: Team[] }) {
  const top = teams[0] ? teamTotal(teams[0]) : 0;
  return (
    <div className="panel">
      <h2>Leaderboard</h2>
      <ol className="leaderboard">
        {teams.map((t, i) => {
          const total = teamTotal(t);
          const pct = top > 0 ? (total / top) * 100 : 0;
          return (
            <li key={t.id} className="leaderboard__row">
              <span className="leaderboard__rank">{i + 1}</span>
              <span className="leaderboard__name">{t.name}</span>
              <span className="leaderboard__bar">
                <span className="leaderboard__bar-fill" style={{ width: `${pct}%` }} />
              </span>
              <span className="leaderboard__score">{total}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function EventLog({ game }: { game: GameState }) {
  if (game.eventLog.length === 0) return null;
  return (
    <div className="panel">
      <h2>Market Event Log</h2>
      <ul className="log">
        {game.eventLog.map((e) => (
          <li key={e.id} className="log__row">
            <span className="log__round">M{e.round}</span>
            <span className={`log__event ${e.highDemand ? "log__event--hot" : ""}`}>
              {e.event}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Setup({ onStart }: { onStart: (teams: Team[]) => void }) {
  const [names, setNames] = useState<string[]>([...DEFAULT_TEAM_NAMES]);

  function update(i: number, value: string) {
    setNames((n) => n.map((x, idx) => (idx === i ? value : x)));
  }
  function add() {
    setNames((n) => [...n, `Team ${n.length + 1}`]);
  }
  function remove(i: number) {
    setNames((n) => n.filter((_, idx) => idx !== i));
  }

  function start() {
    const teams: Team[] = names
      .map((n) => n.trim())
      .filter(Boolean)
      .map((name) => ({ id: newId(), name, entries: [] }));
    if (teams.length >= 2) onStart(teams);
  }

  const valid = names.filter((n) => n.trim()).length >= 2;

  return (
    <div className="setup">
      <div className="setup__card">
        <div className="setup__brand">
          <span className="topbar__logo">BES</span>
          <h1>Business Experience Simulator</h1>
          <p>Game Master companion — set up your teams to begin the business year.</p>
        </div>

        <div className="setup__teams">
          {names.map((name, i) => (
            <div key={i} className="setup__team">
              <input
                value={name}
                onChange={(e) => update(i, e.target.value)}
                placeholder={`Team ${i + 1}`}
              />
              {names.length > 2 && (
                <button className="btn btn--ghost" onClick={() => remove(i)}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="setup__actions">
          <button className="btn" onClick={add}>
            + Add team
          </button>
          <button className="btn btn--primary" onClick={start} disabled={!valid}>
            Start Business Year →
          </button>
        </div>
        {!valid && <p className="setup__hint">Enter at least two teams to start.</p>}
      </div>
    </div>
  );
}
