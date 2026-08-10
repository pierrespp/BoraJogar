-- ==============================================================================
-- BORA JOGAR — SCHEMA ATUALIZADO DO BANCO DE DADOS (SUPABASE POSTGRESQL)
-- ==============================================================================
-- Copie e cole este script no SQL Editor do Supabase para criar/atualizar a estrutura.
-- Os usuários são gerenciados pelo Supabase Auth (auth.users).

-- 1. TABELA DE GRUPOS
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  discord_webhook_url text,
  decision_mode text check (decision_mode in ('most_voted', 'weighted_random')) default 'weighted_random',
  max_session_duration_minutes integer default 15
);

-- Alterações de colunas caso a tabela já exista
alter table groups add column if not exists discord_webhook_url text;
alter table groups add column if not exists decision_mode text check (decision_mode in ('most_voted', 'weighted_random')) default 'weighted_random';
alter table groups add column if not exists max_session_duration_minutes integer default 15;

-- 2. TABELA DE MEMBROS DO GRUPO
create table if not exists group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  primary key (group_id, user_id)
);

-- 3. TABELA DE JOGOS
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  steam_appid integer,
  name text not null,
  image_url text,
  genres text[],
  min_players integer,
  max_players integer,
  source text check (source in ('steam', 'manual')) default 'manual',
  added_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  last_played_at timestamp with time zone
);

alter table games add column if not exists last_played_at timestamp with time zone;

-- 4. LINK DE JOGOS POR GRUPO
create table if not exists game_group_link (
  game_id uuid references games(id) on delete cascade,
  group_id uuid references groups(id) on delete cascade,
  primary key (game_id, group_id)
);

-- 5. TABELA DE SESSÕES DE VOTAÇÃO
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  status text check (status in ('open', 'closed')) default 'open',
  winner_game_id uuid references games(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  closed_at timestamp with time zone
);

alter table sessions add column if not exists created_by uuid references auth.users(id) on delete set null;

-- 6. TABELA DE VOTOS
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  game_id uuid references games(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  value integer default 1, -- +2: Quero muito, +1: Quero, 0: Tanto faz, -1: Não quero
  created_at timestamp with time zone default now(),
  unique (session_id, game_id, user_id)
);

-- 7. TABELA DE HISTÓRICO DE PARTIDAS
create table if not exists play_history (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  game_id uuid references games(id) on delete cascade,
  notes text,
  played_at timestamp with time zone default now()
);

alter table play_history add column if not exists notes text;

-- 8. ÍNDICES DE PERFORMANCE PARA BUSCAS RÁPIDAS
create index if not exists idx_group_members_user on group_members(user_id);
create index if not exists idx_game_group_link_group on game_group_link(group_id);
create index if not exists idx_sessions_group_status on sessions(group_id, status);
create index if not exists idx_votes_session_game on votes(session_id, game_id);
create index if not exists idx_play_history_group on play_history(group_id);
