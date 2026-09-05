-- Registra em jsonb as respostas de motivacao/habitos do onboarding
-- personalizado (foco, obstaculo, rotina, sentimento esperado, sono,
-- hidratacao, habitos alimentares, intestino, disposicao).
alter table public.mwa_perfis
  add column if not exists personalizacao jsonb not null default '{}'::jsonb;
