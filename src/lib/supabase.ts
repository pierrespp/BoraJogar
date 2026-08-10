import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Group, Game, Session, Vote, PlayHistory, UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isRealSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isRealSupabaseConfigured
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock Store for Seamless AI Studio Live Demo Preview
const STORAGE_KEY = 'borajogar_db_v3';
const USER_SESSION_KEY = 'borajogar_active_user_v2';

export function getSavedUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading saved user session', e);
  }
  return null;
}

export function saveUserSession(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(USER_SESSION_KEY);
    } else {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Error saving user session', e);
  }
}

export const DEMO_USER: UserProfile = {
  id: 'user-demo-1',
  email: 'membro@borajogar.com',
  name: 'Gabriel (Você)',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
};

export const DEMO_USERS: UserProfile[] = [
  DEMO_USER,
  { id: 'user-demo-2', email: 'lucas@borajogar.com', name: 'Lucas', avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80' },
  { id: 'user-demo-3', email: 'felipe@borajogar.com', name: 'Felipe', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  { id: 'user-demo-4', email: 'matheus@borajogar.com', name: 'Matheus', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
];

interface DemoDB {
  groups: Group[];
  games: Game[];
  groupGames: { group_id: string; game_id: string }[];
  sessions: Session[];
  votes: Vote[];
  playHistory: PlayHistory[];
}

const DEFAULT_INITIAL_DATA: DemoDB = {
  groups: [],
  games: [],
  groupGames: [],
  sessions: [],
  votes: [],
  playHistory: [],
};

// Helper methods for state persistence
export function getDemoDB(): DemoDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading demo database', e);
  }
  saveDemoDB(DEFAULT_INITIAL_DATA);
  return DEFAULT_INITIAL_DATA;
}

export function saveDemoDB(db: DemoDB): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed saving demo database', e);
  }
}
