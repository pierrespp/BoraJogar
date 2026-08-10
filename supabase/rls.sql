-- ==============================================================================
-- BORA JOGAR — POLITICAS RLS (ROW LEVEL SECURITY)
-- ==============================================================================
-- Execute no SQL Editor do Supabase após aplicar o schema.sql.

-- 1. HABILITAR RLS EM TODAS AS TABELAS
alter table groups enable row level security;
alter table group_members enable row level security;
alter table games enable row level security;
alter table game_group_link enable row level security;
alter table sessions enable row level security;
alter table votes enable row level security;
alter table play_history enable row level security;

-- 2. LIMPAR POLITICAS ANTIGAS
drop policy if exists "Membros podem ver seus grupos" on groups;
drop policy if exists "Usuários autenticados podem criar grupos" on groups;
drop policy if exists "Membros podem atualizar seus grupos" on groups;
drop policy if exists "Ver membros do grupo" on group_members;
drop policy if exists "Usuários podem se adicionar aos grupos" on group_members;
drop policy if exists "Ver jogos" on games;
drop policy if exists "Usuários autenticados podem adicionar jogos" on games;
drop policy if exists "Ver links de jogos do grupo" on game_group_link;
drop policy if exists "Vincular jogo ao grupo" on game_group_link;
drop policy if exists "Remover vinculo de jogo do grupo" on game_group_link;
drop policy if exists "Ver sessões do grupo" on sessions;
drop policy if exists "Criar e atualizar sessões do grupo" on sessions;
drop policy if exists "Ver votos da sessão" on votes;
drop policy if exists "Gerenciar seus próprios votos" on votes;
drop policy if exists "Ver histórico do grupo" on play_history;
drop policy if exists "Inserir no histórico do grupo" on play_history;

-- 3. FUNÇÃO HELPER SECURITY DEFINER (EVITA RECURSÃO INFINITA)
create or replace function public.is_group_member(_group_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from group_members
    where group_id = _group_id
      and user_id = auth.uid()
  );
$$;

-- 4. POLÍTICAS PARA GROUPS
create policy "Membros podem ver seus grupos"
  on groups for select
  using (
    public.is_group_member(id)
    or invite_code is not null
  );

create policy "Usuários autenticados podem criar grupos"
  on groups for insert
  with check (auth.role() = 'authenticated');

create policy "Membros podem atualizar seus grupos"
  on groups for update
  using (public.is_group_member(id));

-- 5. POLÍTICAS PARA GROUP_MEMBERS
create policy "Ver membros do grupo"
  on group_members for select
  using (
    user_id = auth.uid()
    or public.is_group_member(group_id)
  );

create policy "Usuários podem se adicionar aos grupos"
  on group_members for insert
  with check (user_id = auth.uid());

-- 6. POLÍTICAS PARA GAMES
create policy "Ver jogos"
  on games for select
  using (true);

create policy "Usuários autenticados podem adicionar jogos"
  on games for insert
  with check (auth.role() = 'authenticated');

-- 7. POLÍTICAS PARA GAME_GROUP_LINK
create policy "Ver links de jogos do grupo"
  on game_group_link for select
  using (public.is_group_member(group_id));

create policy "Vincular jogo ao grupo"
  on game_group_link for insert
  with check (public.is_group_member(group_id));

create policy "Remover vinculo de jogo do grupo"
  on game_group_link for delete
  using (public.is_group_member(group_id));

-- 8. POLÍTICAS PARA SESSIONS
create policy "Ver sessões do grupo"
  on sessions for select
  using (public.is_group_member(group_id));

create policy "Criar e atualizar sessões do grupo"
  on sessions for all
  using (public.is_group_member(group_id));

-- 9. POLÍTICAS PARA VOTES
create policy "Ver votos da sessão"
  on votes for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from sessions s
      where s.id = votes.session_id
        and public.is_group_member(s.group_id)
    )
  );

create policy "Gerenciar seus próprios votos"
  on votes for all
  using (user_id = auth.uid());

-- 10. POLÍTICAS PARA PLAY_HISTORY
create policy "Ver histórico do grupo"
  on play_history for select
  using (public.is_group_member(group_id));

create policy "Inserir no histórico do grupo"
  on play_history for insert
  with check (public.is_group_member(group_id));
