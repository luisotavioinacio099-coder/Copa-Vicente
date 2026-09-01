-- Copa Vicente 2026 - Setup do banco de dados Supabase
-- Rode este script no SQL Editor do Supabase (Dashboard -> SQL Editor)

-- Cria a tabela que guarda o estado completo do torneio (uma única linha)
create table if not exists public.copa_dados (
  id integer primary key default 1,
  dados jsonb,
  atualizado_em timestamptz default now()
);

-- Insere a linha inicial com o estado vazio (se ainda não existir)
insert into public.copa_dados (id, dados, atualizado_em)
values (1, '{}'::jsonb, now())
on conflict (id) do nothing;

-- Habilita acesso com a SERVICE ROLE KEY (usada pelas APIs da Vercel)
alter table public.copa_dados enable row level security;
create policy "service role full access"
  on public.copa_dados
  for all
  to service_role
  using (true)
  with check (true);
