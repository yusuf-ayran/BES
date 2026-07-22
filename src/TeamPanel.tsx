import { useState } from "react";
import { GOAL_POINTS } from "./data";
import { kindTotal, ScoreKind, Team, teamTotal } from "./model";

interface Props {
  team: Team;
  rank: number;
  highDemandActive: boolean;
  onAward: (kind: ScoreKind, points: number, note: string) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function TeamPanel({
  team,
  rank,
  highDemandActive,
  onAward,
  onUndo,
  canUndo,
}: Props) {
  const [partnership, setPartnership] = useState(10);
  const [quarter, setQuarter] = useState(8);

  function awardObjective(base: number) {
    const mult = highDemandActive ? 2 : 1;
    const pts = base * mult;
    const note = highDemandActive
      ? `${base}-pt objective (High Demand x2)`
      : `${base}-pt objective`;
    onAward("objective", pts, note);
  }

  const total = teamTotal(team);

  return (
    <div className="team">
      <div className="team__head">
        <span className={`team__rank team__rank--${rank}`}>#{rank}</span>
        <h3 className="team__name">{team.name}</h3>
        <span className="team__total">{total}</span>
      </div>

      <div className="team__breakdown">
        <Stat label="Objectives" value={kindTotal(team, "objective")} />
        <Stat label="Partnerships" value={kindTotal(team, "partnership")} />
        <Stat label="Quarters" value={kindTotal(team, "quarter")} />
        <Stat label="Goals" value={kindTotal(team, "goal")} />
      </div>

      <div className="team__actions">
        <div className="action-row">
          <span className="action-row__label">Objective</span>
          <button className="btn" onClick={() => awardObjective(10)}>
            +10{highDemandActive ? " → 20" : ""}
          </button>
          <button className="btn" onClick={() => awardObjective(15)}>
            +15{highDemandActive ? " → 30" : ""}
          </button>
        </div>

        <div className="action-row">
          <span className="action-row__label">Partnership</span>
          <input
            type="range"
            min={1}
            max={20}
            value={partnership}
            onChange={(e) => setPartnership(Number(e.target.value))}
          />
          <span className="action-row__value">{partnership}/20</span>
          <button
            className="btn"
            onClick={() => onAward("partnership", partnership, `Partnership ${partnership}/20`)}
          >
            Award
          </button>
        </div>

        <div className="action-row">
          <span className="action-row__label">Quarter</span>
          <input
            type="range"
            min={0}
            max={10}
            value={quarter}
            onChange={(e) => setQuarter(Number(e.target.value))}
          />
          <span className="action-row__value">{quarter}/10</span>
          <button
            className="btn"
            onClick={() => onAward("quarter", quarter, `Quarter review ${quarter}/10`)}
          >
            Award
          </button>
        </div>

        <div className="action-row">
          <span className="action-row__label">Strategic Goal</span>
          <button
            className="btn"
            onClick={() => onAward("goal", GOAL_POINTS, "Strategic goal completed")}
          >
            Completed +30
          </button>
        </div>
      </div>

      <div className="team__foot">
        <button className="btn btn--ghost" onClick={onUndo} disabled={!canUndo}>
          Undo last award
        </button>
        <span className="team__count">{team.entries.length} entries</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}
