// ============================================================================
// hotmart-vincular — vincula uma compra 90d feita com e-mail DIFERENTE da conta
// ----------------------------------------------------------------------------
// Autenticada (verify_jwt = true). A cliente logada informa o e-mail usado na
// compra da Hotmart. Se existir uma compra 90d aprovada e ainda não vinculada
// para aquele e-mail, ela é ligada à conta logada e o programa é liberado.
//
// Segurança:
//   - Só a própria usuária logada pode vincular (usa o JWT dela).
//   - Cada compra só vincula UMA vez (checa user_id nulo + liberado false).
//   - Recomendado ligar confirmação por e-mail antes do go-live (ver README).
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }
  if (req.method !== "POST") return json({ erro: "method_not_allowed" }, 405);

  // 1) identifica a usuária pelo JWT
  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) return json({ erro: "nao_autenticado" }, 401);

  let body: any;
  try { body = await req.json(); } catch { return json({ erro: "json_invalido" }, 400); }
  const emailCompra = String(body?.email_compra ?? "").trim().toLowerCase();
  if (!emailCompra) return json({ erro: "email_obrigatorio" }, 400);

  // 2) service role para escrever
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 3) procura compra 90d aprovada/completa, não vinculada, para aquele e-mail
  const { data: compra } = await admin
    .from("mwa_compras").select("*")
    .eq("produto", "90d")
    .ilike("buyer_email", emailCompra)
    .in("status", ["aprovada", "completa"])
    .is("user_id", null)
    .maybeSingle();

  if (!compra) {
    return json({ ok: false, motivo: "compra_nao_encontrada" });
  }

  // 4) não vincular 2x
  if (compra.liberado === true || compra.user_id) {
    return json({ ok: false, motivo: "ja_vinculada" });
  }

  // 5) cria o programa de 90 dias e vincula
  const fim = new Date(); fim.setDate(fim.getDate() + 90);
  const { data: prog, error: progErr } = await admin.from("mwa_programas").insert({
    user_id: user.id, tipo: "90d", data_fim: fim.toISOString(),
    origem: "hotmart", status: "ativo", compra_id: compra.id,
  }).select("id").single();
  if (progErr) return json({ erro: "falha_ao_liberar", detalhe: progErr.message }, 500);

  await admin.from("mwa_compras").update({
    user_id: user.id, liberado: true,
    liberado_em: new Date().toISOString(), vinculado_em: new Date().toISOString(),
    detalhes: { ...compra.detalhes, programa_id: prog?.id, vinculo: "email_diferente" },
  }).eq("id", compra.id);

  return json({ ok: true, liberado: true, programa_id: prog?.id });
});
