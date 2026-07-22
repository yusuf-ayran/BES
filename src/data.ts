// Static game content for BES.

export interface MarketEventCard {
  name: string;
  description: string;
  /** Rough sentiment for coloring the card. */
  tone: "good" | "bad" | "neutral";
}

// The full Market Event deck. A HIGH DEMAND YEAR card is included and, when
// drawn, doubles every completed objective (handled in the app).
export const MARKET_EVENTS: MarketEventCard[] = [
  { name: "Inflation", description: "Costs rise across the board. Money buys less this month.", tone: "bad" },
  { name: "High Demand", description: "Customers are hungry. Sales opportunities everywhere.", tone: "good" },
  { name: "HIGH DEMAND YEAR", description: "Booming market! Every completed objective earns DOUBLE POINTS this round.", tone: "good" },
  { name: "Supply Shortage", description: "Materials are scarce. Production is harder to sustain.", tone: "bad" },
  { name: "Supply Chain Delay", description: "Shipments are late. Distribution slows down.", tone: "bad" },
  { name: "Technology Boom", description: "New tech unlocks efficiency for those who invest.", tone: "good" },
  { name: "Technology Breakthrough", description: "A breakthrough rewards companies with strong R&D.", tone: "good" },
  { name: "Government Grant", description: "Public funding is available to qualifying businesses.", tone: "good" },
  { name: "Government Subsidy", description: "Subsidies lower the cost of doing business this month.", tone: "good" },
  { name: "New Competitor", description: "A rival enters the market. Expect pressure on share.", tone: "bad" },
  { name: "Consumer Trend", description: "Tastes shift. Agile companies can ride the wave.", tone: "neutral" },
  { name: "Economic Crisis", description: "The economy contracts. Cash and caution matter.", tone: "bad" },
  { name: "Tax Increase", description: "Higher taxes squeeze margins this month.", tone: "bad" },
  { name: "Investor Boom", description: "Investors are eager. Capital is easier to raise.", tone: "good" },
  { name: "Labor Strike", description: "Workforce disruption slows operations.", tone: "bad" },
  { name: "Fuel Price Increase", description: "Logistics and production costs climb.", tone: "bad" },
  { name: "Currency Crash", description: "Exchange rates swing. International plays get risky.", tone: "bad" },
  { name: "Viral Social Media Trend", description: "A trend goes viral. Marketing pays off big.", tone: "good" },
];

export const OBJECTIVE_VALUES = [10, 15];
export const GOAL_POINTS = 30;
export const MAX_QUARTER_SCORE = 10;
export const MAX_PARTNERSHIP_SCORE = 20;

export const DEFAULT_TEAM_NAMES = [
  "Team Alpha",
  "Team Beta",
  "Team Gamma",
  "Team Delta",
];
