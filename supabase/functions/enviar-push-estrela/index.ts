// supabase/functions/enviar-push-estrela/index.ts
// ============================================================================
// enviar-push-estrela — dispara push real (Web Push/VAPID) do lembrete da
// Estrela do Dia pra quem ainda não acendeu a estrela hoje.
// Chamada 1x por dia (18h de Brasília) por um job do pg_cron, autenticada
// por um segredo compartilhado (header x-cron-secret) — não usa JWT de
// usuário nem a service role key no header, pra reduzir o que vaza se o
// job do cron for lido por alguém com acesso à tabela cron.job.
//
// Secrets necessários (Edge Functions → Secrets):
//   CRON_SECRETO         precisa bater com o header x-cron-secret
//   VAPID_PUBLIC_KEY      mesma chave pública usada no cliente
//   VAPID_PRIVATE_KEY     chave privada VAPID
//   VAPID_SUBJECT         ex.: mailto:espacoauad@gmail.com
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já são injetados automaticamente.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const CRON_SECRETO = Deno.env.get("CRON_SECRETO") ?? "";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Comparação de tempo constante (mesmo padrão de hotmart-webhook)
function timingSafeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

const MENSAGEM = {
  titulo: "⭐ Sua estrela está esperando",
  corpo: "Sua estrela de hoje ainda está apagada — duas tarefinhas e ela é sua.",
  tituloEn: "⭐ Your star is waiting",
  corpoEn: "Today's star is still dim — two small tasks and it's yours.",
};

Deno.serve(async (req) => {
  const recebido = req.headers.get("x-cron-secret") ?? "";
  if (!CRON_SECRETO || !timingSafeEqual(recebido, CRON_SECRETO)) {
    return json({ erro: "não autorizado" }, 401);
  }

  const hoje = new Date().toISOString().slice(0, 10);

  const { data: programas, error: erroProgramas } = await supabase
    .from("mwa_programas")
    .select("user_id")
    .eq("status", "ativo");
  if (erroProgramas) return json({ erro: erroProgramas.message }, 500);

  const userIds = [...new Set((programas ?? []).map((p) => p.user_id))];
  if (userIds.length === 0) return json({ enviados: 0 });

  const { data: acesas } = await supabase
    .from("mwa_game_eventos")
    .select("user_id")
    .eq("tipo", "estrela_dia")
    .eq("ref", hoje)
    .in("user_id", userIds);
  const jaAcesa = new Set((acesas ?? []).map((e) => e.user_id));

  const { data: jaEnviados } = await supabase
    .from("mwa_push_log")
    .select("user_id")
    .eq("tipo", "estrela_dia")
    .eq("data", hoje)
    .in("user_id", userIds);
  const jaEnviado = new Set((jaEnviados ?? []).map((e) => e.user_id));

  const pendentes = userIds.filter((id) => !jaAcesa.has(id) && !jaEnviado.has(id));
  if (pendentes.length === 0) return json({ enviados: 0 });

  const { data: perfis } = await supabase
    .from("mwa_perfis")
    .select("id, idioma")
    .in("id", pendentes);
  const idiomaPorUsuario = new Map((perfis ?? []).map((p) => [p.id, p.idioma]));

  const { data: inscricoes, error: erroInscricoes } = await supabase
    .from("mwa_push_inscricoes")
    .select("endpoint, user_id, p256dh, auth")
    .in("user_id", pendentes);
  if (erroInscricoes) return json({ erro: erroInscricoes.message }, 500);

  let enviados = 0;
  for (const inscricao of inscricoes ?? []) {
    const ingles = idiomaPorUsuario.get(inscricao.user_id) === "en-US";
    const payload = JSON.stringify({
      titulo: ingles ? MENSAGEM.tituloEn : MENSAGEM.titulo,
      corpo: ingles ? MENSAGEM.corpoEn : MENSAGEM.corpo,
      tag: `estrela_${hoje}`,
      aba: "ferramentas",
    });

    try {
      await webpush.sendNotification(
        {
          endpoint: inscricao.endpoint,
          keys: { p256dh: inscricao.p256dh, auth: inscricao.auth },
        },
        payload,
      );
      await supabase.from("mwa_push_log").upsert(
        { user_id: inscricao.user_id, tipo: "estrela_dia", data: hoje },
        { onConflict: "user_id,tipo,data" },
      );
      enviados++;
    } catch (erro) {
      const status = (erro as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 410) {
        await supabase.from("mwa_push_inscricoes").delete().eq("endpoint", inscricao.endpoint);
      } else {
        console.error("falha ao enviar push", inscricao.user_id, erro);
      }
    }
  }

  return json({ enviados, candidatos: pendentes.length });
});
