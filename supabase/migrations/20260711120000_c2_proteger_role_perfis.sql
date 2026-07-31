-- C2 — Proteção da coluna role em mwa_perfis (bloqueio de escalação para admin)
--
-- Problema: a policy "proprio perfil" (ALL) permite UPDATE da própria linha,
-- inclusive da coluna `role`. Qualquer usuário podia executar
-- `update mwa_perfis set role='admin'` e assumir o painel admin.
--
-- Solução: função is_admin (SECURITY DEFINER, evita recursão de RLS) + trigger
-- que impede alterar/definir `role` a menos que o autor seja admin ou a operação
-- venha do backend (service_role / SQL direto, onde auth.uid() é null).
--
-- Afeta apenas objetos mwa_*. Nenhuma tabela de outro sistema é tocada.

-- Função utilitária: o usuário é admin?
create or replace function public.mwa_is_admin(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.mwa_perfis where id = uid and role = 'admin'
  );
$$;

revoke all on function public.mwa_is_admin(uuid) from public;
grant execute on function public.mwa_is_admin(uuid) to authenticated, anon, service_role;

-- Trigger de proteção da coluna role
create or replace function public.mwa_proteger_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() null = contexto de backend (service_role) ou SQL direto: liberado.
  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if coalesce(new.role, 'user') <> 'user' and not public.mwa_is_admin(auth.uid()) then
      raise exception 'Definir role diferente de user não é permitido'
        using errcode = '42501';
    end if;
  elsif tg_op = 'UPDATE' then
    if new.role is distinct from old.role and not public.mwa_is_admin(auth.uid()) then
      raise exception 'Alteração de role não é permitida'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_mwa_proteger_role on public.mwa_perfis;
create trigger trg_mwa_proteger_role
  before insert or update on public.mwa_perfis
  for each row execute function public.mwa_proteger_role();
