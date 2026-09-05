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

  // Init tardio: só configura o VAPID depois que a chamada já passou pela
  // checagem do x-cron-secret, pra uma requisição não autorizada/malformada
  // sempre receber um 401 limpo, mesmo que algum segredo VAPID esteja
  // ausente/rotacionando — em vez de derrubar o worker inteiro (500) antes
  // da checagem de auth rodar.
  webpush.setVapidDetails(
    Deno.env.get("VAPID_SUBJECT")!,
    Deno.env.get("VAPID_PUBLIC_KEY")!,
    Deno.env.get("VAPID_PRIVATE_KEY")!,
  );

  // en-CA formata como YYYY-MM-DD (ordem ISO) — calculado já no fuso de
  // Brasília, pra uma chamada manual/antecipada entre 21h BRT e 0h UTC não
  // computar a data de amanhã (o que gravaria o log no dia errado e
  // suprimiria o envio real desse dia).
  const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

  const { data: programas, error: erroProgramas } = await supabase
    .from("mwa_programas")
    .select("user_id")
    .eq("status", "ativo")
    .or(`data_fim.is.null,data_fim.gte.${hoje}`);
  if (erroProgramas) return json({ erro: erroProgramas.message }, 500);

  const userIds = [...new Set((programas ?? []).map((p) => p.user_id))];
  if (userIds.length === 0) return json({ enviados: 0, falhas: 0, candidatos: 0 });

  const { data: acesas, error: erroAcesas } = await supabase
    .from("mwa_game_eventos")
    .select("user_id")
    .eq("tipo", "estrela_dia")
    .eq("ref", hoje)
    .in("user_id", userIds);
  if (erroAcesas) return json({ erro: erroAcesas.message }, 500);
  const jaAcesa = new Set((acesas ?? []).map((e) => e.user_id));

  const { data: jaEnviados, error: erroJaEnviados } = await supabase
    .from("mwa_push_log")
    .select("user_id")
    .eq("tipo", "estrela_dia")
    .eq("data", hoje)
    .in("user_id", userIds);
  if (erroJaEnviados) return json({ erro: erroJaEnviados.message }, 500);
  const jaEnviado = new Set((jaEnviados ?? []).map((e) => e.user_id));

  const pendentesComAdmin = userIds.filter((id) => !jaAcesa.has(id) && !jaEnviado.has(id));
  if (pendentesComAdmin.length === 0) return json({ enviados: 0, falhas: 0, candidatos: 0 });

  const { data: perfis, error: erroPerfis } = await supabase
    .from("mwa_perfis")
    .select("id, idioma, role")
    .in("id", pendentesComAdmin);
  if (erroPerfis) return json({ erro: erroPerfis.message }, 500);
  const idiomaPorUsuario = new Map((perfis ?? []).map((p) => [p.id, p.idioma]));
  // Contas admin não devem receber o push — mesma exclusão já feita no
  // lembrete local equivalente (função do dia) no client.
  const idsAdmin = new Set((perfis ?? []).filter((p) => p.role === "admin").map((p) => p.id));
  const pendentes = pendentesComAdmin.filter((id) => !idsAdmin.has(id));
  if (pendentes.length === 0) return json({ enviados: 0, falhas: 0, candidatos: 0 });

  const { data: inscricoes, error: erroInscricoes } = await supabase
    .from("mwa_push_inscricoes")
    .select("endpoint, user_id, p256dh, auth")
    .in("user_id", pendentes);
  if (erroInscricoes) return json({ erro: erroInscricoes.message }, 500);

  let enviados = 0;
  let falhas = 0;
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
      falhas++;
    }
  }

  return json({ enviados, falhas, candidatos: pendentes.length });
});
