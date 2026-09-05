-- supabase/migrations/20260815130200_agendar_push_estrela_cron.sql
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'push-estrela-diaria',
  '0 21 * * *', -- 21:00 UTC = 18:00 em Brasília (sem horário de verão hoje no Brasil)
  $$
  select net.http_post(
    url := 'https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-estrela',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secreto_push_estrela')
    ),
    body := '{}'::jsonb
  );
  $$
);
