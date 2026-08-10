export type SourceType = 'steam' | 'manual';
export type VoteValue = 2 | 1 | 0 | -1; // 2 = Quero muito, 1 = Quero, 0 = Indiferente, -1 = Não quero
export type DecisionStrategy = 'most_voted' | 'weighted_random';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  discord_webhook_url?: string | null;
  decision_mode?: DecisionStrategy;
  members_count?: number;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  joined_at: string;
  user_name?: string;
  user_email?: string;
}

export interface Game {
  id: string;
  steam_appid?: number | null;
  name: string;
  image_url?: string | null;
  genres?: string[] | null;
  min_players?: number | null;
  max_players?: number | null;
  source: SourceType;
  added_by?: string | null;
  created_at?: string;
  last_played_at?: string | null;
}

export interface Session {
  id: string;
  group_id: string;
  status: 'open' | 'closed';
  winner_game_id?: string | null;
  created_at: string;
  closed_at?: string | null;
  created_by?: string;
  duration_minutes?: number;
}

export interface Vote {
  id: string;
  session_id: string;
  game_id: string;
  user_id: string;
  value: VoteValue;
  created_at: string;
  user_name?: string;
}

export interface GameVoteSummary {
  game: Game;
  total_score: number;
  vote_count: number; // positive votes
  user_vote?: VoteValue;
  voters: { user_name: string; value: VoteValue }[];
  weight: number;
  last_played?: string | null;
}

export interface PlayHistory {
  id: string;
  group_id: string;
  game_id: string;
  game_name?: string;
  image_url?: string;
  played_at: string;
  notes?: string;
}
