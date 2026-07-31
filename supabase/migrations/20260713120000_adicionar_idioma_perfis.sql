-- Preferência de idioma escolhida pela pessoa no cadastro.
-- Contas existentes continuam em português.
alter table public.mwa_perfis
  add column if not exists idioma text not null default 'pt-BR';

alter table public.mwa_perfis
  drop constraint if exists mwa_perfis_idioma_check;

alter table public.mwa_perfis
  add constraint mwa_perfis_idioma_check
  check (idioma in ('pt-BR', 'en-US'));
