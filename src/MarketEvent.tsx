import { useState } from "react";
import { MARKET_EVENTS, MarketEventCard } from "./data";

interface Props {
  round: number;
  onDraw: (card: MarketEventCard) => void;
  current: MarketEventCard | null;
}

export function MarketEvent({ round, onDraw, current }: Props) {
  const [spinning, setSpinning] = useState(false);

  function draw() {
    setSpinning(true);
    // brief shuffle animation before settling on a card
    const settle = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
    window.setTimeout(() => {
      setSpinning(false);
      onDraw(settle);
    }, 450);
  }

  return (
    <div className="market">
      <div className="market__head">
        <h2>Market Event</h2>
        <button className="btn btn--primary" onClick={draw} disabled={spinning}>
          {spinning ? "Drawing…" : current ? "Draw New Event" : "Reveal Market Event"}
        </button>
      </div>

      {current ? (
        <div className={`event-card event-card--${current.tone} ${spinning ? "event-card--spin" : ""}`}>
          <div className="event-card__round">Month {round}</div>
          <div className="event-card__name">{current.name}</div>
          <div className="event-card__desc">{current.description}</div>
          {current.name === "HIGH DEMAND YEAR" && (
            <div className="event-card__badge">OBJECTIVES SCORE DOUBLE THIS ROUND</div>
          )}
        </div>
      ) : (
        <div className="event-card event-card--empty">
          Reveal the market event to begin the month.
        </div>
      )}
    </div>
  );
}
