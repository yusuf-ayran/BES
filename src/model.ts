// BES (Business Experience Simulator) — data model
// Scoring rules mirror the official Refy Game Master prompt.

export type ScoreKind =
  | "objective"
  | "partnership"
  | "quarter"
  | "goal";

export interface ScoreEntry {
  id: string;
  kind: ScoreKind;
  points: number;
  /** Round in which the entry was awarded (1–12). */
  round: number;
  /** Short human-readable note, e.g. "15-pt objective (High Demand x2)". */
  note: string;
}

export interface Team {
  id: string;
  name: string;
  entries: ScoreEntry[];
}

export interface EventLogItem {
  id: string;
  round: number;
  event: string;
  /** True when this event was a HIGH DEMAND YEAR draw. */
  highDemand: boolean;
}

export interface GameState {
  teams: Team[];
  /** Current month/round, 1–12. */
  round: number;
  /** Whether a HIGH DEMAND YEAR is currently active (doubles objectives). */
  highDemandActive: boolean;
  eventLog: EventLogItem[];
  started: boolean;
}

export const TOTAL_ROUNDS = 12;

export function quarterOf(round: number): number {
  return Math.ceil(round / 3);
}

export function isQuarterEnd(round: number): boolean {
  return round % 3 === 0;
}

export function teamTotal(team: Team): number {
  return team.entries.reduce((sum, e) => sum + e.points, 0);
}

export function kindTotal(team: Team, kind: ScoreKind): number {
  return team.entries
    .filter((e) => e.kind === kind)
    .reduce((sum, e) => sum + e.points, 0);
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}
