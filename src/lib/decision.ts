import { GameVoteSummary, DecisionStrategy } from '../types';

export interface DecisionCandidate {
  id: string;
  name: string;
  score: number;
  weight: number;
  image_url?: string | null;
  last_played_at?: string | null;
}

/**
 * Calculates the weight for a game based on vote score and recency penalty.
 * Score: +2 (Quero muito), +1 (Quero), 0 (Indiferente), -1 (Não quero)
 */
export function calculateGameWeight(score: number, lastPlayedAt?: string | null): number {
  if (score <= 0) return 0; // Games with non-positive scores don't enter the wheel

  let baseWeight = score * 10;

  // Recency penalty: if played in the last 7 days, reduce weight by 50%
  if (lastPlayedAt) {
    const daysSincePlayed = (Date.now() - new Date(lastPlayedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePlayed < 7) {
      baseWeight = Math.max(1, Math.round(baseWeight * 0.5));
    } else if (daysSincePlayed < 14) {
      baseWeight = Math.max(1, Math.round(baseWeight * 0.75));
    }
  }

  return baseWeight;
}

/**
 * Strategy 1: Most Voted (Simple / Highest Score)
 * In case of tie, selects randomly among tied top games.
 */
export function getMostVoted(candidates: DecisionCandidate[]): DecisionCandidate | null {
  if (candidates.length === 0) return null;

  const maxScore = Math.max(...candidates.map((c) => c.score));
  if (maxScore <= 0) {
    // If no positive votes, pick random among all candidates
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  const topCandidates = candidates.filter((c) => c.score === maxScore);
  return topCandidates[Math.floor(Math.random() * topCandidates.length)];
}

/**
 * Strategy 2: Weighted Random Selection (Roleta Ponderada)
 * Probability of winning is proportional to the calculated weight.
 */
export function weightedRandomPick(candidates: DecisionCandidate[]): DecisionCandidate | null {
  const eligible = candidates.filter((c) => c.weight > 0);

  if (eligible.length === 0) {
    // Fallback if no games have positive votes: pick among all candidates
    return candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null;
  }

  if (eligible.length === 1) return eligible[0];

  const totalWeight = eligible.reduce((sum, c) => sum + c.weight, 0);
  let randomPoint = Math.random() * totalWeight;

  for (const candidate of eligible) {
    randomPoint -= candidate.weight;
    if (randomPoint <= 0) {
      return candidate;
    }
  }

  return eligible[eligible.length - 1];
}

/**
 * Decides winner using chosen strategy.
 */
export function decideWinner(
  summaries: GameVoteSummary[],
  strategy: DecisionStrategy = 'weighted_random'
): DecisionCandidate | null {
  const candidates: DecisionCandidate[] = summaries.map((s) => ({
    id: s.game.id,
    name: s.game.name,
    score: s.total_score,
    weight: calculateGameWeight(s.total_score, s.last_played),
    image_url: s.game.image_url,
    last_played_at: s.last_played,
  }));

  if (strategy === 'weighted_random') {
    return weightedRandomPick(candidates);
  } else {
    return getMostVoted(candidates);
  }
}
