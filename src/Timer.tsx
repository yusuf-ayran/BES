import { useEffect, useRef, useState } from "react";

interface Preset {
  label: string;
  seconds: number;
}

const PRESETS: Preset[] = [
  { label: "Decision (2:00)", seconds: 120 },
  { label: "Negotiation (1:00)", seconds: 60 },
  { label: "Presentation (1:00)", seconds: 60 },
];

function fmt(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Timer() {
  const [remaining, setRemaining] = useState(120);
  const [duration, setDuration] = useState(120);
  const [running, setRunning] = useState(false);
  const tick = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [running]);

  function load(seconds: number) {
    setRunning(false);
    setDuration(seconds);
    setRemaining(seconds);
  }

  const done = remaining === 0;
  const pct = duration > 0 ? (remaining / duration) * 100 : 0;

  return (
    <div className={`timer ${done ? "timer--done" : ""}`}>
      <div className="timer__display">{fmt(remaining)}</div>
      <div className="timer__bar">
        <div className="timer__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="timer__controls">
        <button onClick={() => setRunning((r) => !r)} disabled={done}>
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={() => load(duration)}>Reset</button>
      </div>
      <div className="timer__presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={duration === p.seconds ? "chip chip--on" : "chip"}
            onClick={() => load(p.seconds)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {done && <div className="timer__flag">TIME! — all teams stop.</div>}
    </div>
  );
}
