// ============================================================================
// hotmart-webhook — webhook ÚNICO e seguro da Hotmart para o MWA
// ----------------------------------------------------------------------------
// - Valida o header X-HOTMART-HOTTOK (comparação de tempo constante).
// - Idempotente: o mesmo evento nunca é processado 2x (índice único no banco).
// - Trata os 8 eventos: aprovada, completa, pendente, cancelada, expirada,
//   reembolso, chargeback, expirada.  Aprovação libera; reembolso/chargeback bloqueia.
// - Diferencia os 3 produtos pelo product.id oficial (secrets HOTMART_PROD_*).
// - Acesso NUNCA é liberado pelo navegador — só por aqui.
//
// Secrets necessários (Edge Functions → Secrets):
//   HOTMART_HOTTOK          token do webhook (obrigatório)
//   HOTMART_PROD_21D        product.id do programa 21 dias
//   HOTMART_PROD_90D        product.id do programa 90 dias
//   HOTMART_PROD_SESSAO     product.id da sessão individual
//   SITE_URL               ex.: https://metodomwa.com.br  (link de resgate)
//   RESEND_API_KEY         (opcional) chave do serviço de e-mail
//   EMAIL_FROM             remetente, ex.: "MWA <no-reply@metodomwa.com.br>"
//   ADMIN_EMAIL            seu e-mail p/ notificação de venda de sessão
//   SUPPORT_EMAIL          e-mail de suporte mostrado à cliente
//   SUPPORT_WHATSAPP       whatsapp de suporte mostrado à cliente
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já são injetados automaticamente.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const HOTTOK = Deno.env.get("HOTMART_HOTTOK") ?? "";
const MAP_PRODUTO: Record<string, string> = {
  [Deno.env.get("HOTMART_PROD_21D") ?? "__21d__"]: "21d",
  [Deno.env.get("HOTMART_PROD_90D") ?? "__90d__"]: "90d",
  [Deno.env.get("HOTMART_PROD_SESSAO") ?? "__sessao__"]: "sessao",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// ── helpers ─────────────────────────────────────────────────────────────────
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Comparação de tempo constante (evita timing attack no HOTTOK)
function timingSafeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

// Normaliza o payload da Hotmart 2.0 (com fallback defensivo)
function parsePayload(p: any) {
  const d = p?.data ?? p ?? {};
  const product = d.product ?? {};
  const buyer = d.buyer ?? {};
  const purchase = d.purchase ?? {};
  const offer = purchase.offer ?? {};
  const price = purchase.price ?? {};
  return {
    eventId: p?.id ?? p?.event_id ?? null,
    event: String(p?.event ?? "").toUpperCase(),
    productId: String(product.id ?? p?.product_id ?? "").trim(),
    offerCode: offer.code ?? null,
    buyerEmail: (buyer.email ?? p?.buyer_email ?? "").trim().toLowerCase(),
    buyerNome: buyer.name ?? p?.buyer ?? null,
    transaction: purchase.transaction ?? p?.transaction ?? null,
    status: String(purchase.status ?? p?.status ?? "").toUpperCase(),
    valor: price.value ?? p?.price ?? null,
  };
}

async function enviarEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") ?? "MWA <no-reply@metodomwa.com.br>";
  if (!key || !to) {
    console.log(`[email desativado] p/ ${to}: ${subject}`);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
  } catch (e) {
    console.error("Falha ao enviar e-mail:", e);
  }
}

// ── liberações ──────────────────────────────────────────────────────────────
async function liberar21d(compra: any) {
  // Cliente nova: gera cupom, envia e-mail de resgate
  const codigo = `MWA-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`.toUpperCase();
  await supabase.from("mwa_cupons").insert({
    codigo, ativo: true, usado: false, origem: "hotmart",
    detalhes: { compra_id: compra.id, buyer_email: compra.buyer_email, produto: "21d" },
  });
  await supabase.from("mwa_compras").update({
    liberado: true, liberado_em: new Date().toISOString(),
    detalhes: { ...compra.detalhes, cupom: codigo },
  }).eq("id", compra.id);

  const site = Deno.env.get("SITE_URL") ?? "https://metodomwa.com.br";
  await enviarEmail(
    compra.buyer_email,
    "Seu acesso ao MWA — Programa 21 dias",
    `<p>Olá! Seu acesso ao <b>Programa 21 dias</b> está liberado.</p>
     <p>Seu código: <b>${codigo}</b></p>
     <p>Resgate e crie sua conta: <a href="${site}/resgate?cupom=${codigo}">${site}/resgate</a></p>`,
  );
}

async function liberar90d(compra: any) {
  // Cliente já logada: vincula pela e-mail e cria o programa de 90 dias
  const { data: perfil } = await supabase
    .from("mwa_perfis").select("id,email")
    .ilike("email", compra.buyer_email).maybeSingle();

  if (!perfil) {
    // e-mail diferente da conta: fica registrado, aguardando vínculo manual (hotmart-vincular)
    await supabase.from("mwa_compras").update({
      liberado: false,
      detalhes: { ...compra.detalhes, aguardando_vinculo: true },
    }).eq("id", compra.id);
    return;
  }

  const fim = new Date(); fim.setDate(fim.getDate() + 90);
  const { data: prog } = await supabase.from("mwa_programas").insert({
    user_id: perfil.id, tipo: "90d", data_fim: fim.toISOString(),
    origem: "hotmart", status: "ativo", compra_id: compra.id,
  }).select("id").single();

  await supabase.from("mwa_compras").update({
    user_id: perfil.id, liberado: true,
    liberado_em: new Date().toISOString(), vinculado_em: new Date().toISOString(),
    detalhes: { ...compra.detalhes, programa_id: prog?.id },
  }).eq("id", compra.id);

  await enviarEmail(
    compra.buyer_email, "MWA — Programa 90 dias liberado",
    `<p>Pagamento confirmado! Seu <b>Programa 90 dias</b> já está ativo no MWA. É só entrar no app.</p>`,
  );
}

async function registrarSessao(compra: any) {
  await supabase.from("mwa_compras").update({
    sessao_status: "adquirida", liberado: true, liberado_em: new Date().toISOString(),
  }).eq("id", compra.id);

  // vincula à conta se o e-mail bater
  const { data: perfil } = await supabase
    .from("mwa_perfis").select("id").ilike("email", compra.buyer_email).maybeSingle();
  if (perfil) {
    await supabase.from("mwa_compras")
      .update({ user_id: perfil.id, vinculado_em: new Date().toISOString() })
      .eq("id", compra.id);
  }

  const suporteEmail = Deno.env.get("SUPPORT_EMAIL") ?? "";
  const suporteZap = Deno.env.get("SUPPORT_WHATSAPP") ?? "";
  // confirma para a cliente
  await enviarEmail(
    compra.buyer_email, "MWA — Sessão individual confirmada",
    `<p>Sua <b>sessão individual</b> está confirmada!</p>
     <p>Para agendar, fale com o suporte:</p>
     <p>WhatsApp: ${suporteZap}<br>E-mail: ${suporteEmail}</p>`,
  );
  // notifica a admin
  const admin = Deno.env.get("ADMIN_EMAIL") ?? "";
  await enviarEmail(
    admin, "Nova venda: Sessão individual",
    `<p>Nova sessão comprada.</p>
     <p>Cliente: ${compra.buyer_nome ?? "-"} (${compra.buyer_email})<br>
     Transação: ${compra.hotmart_transaction ?? "-"}</p>`,
  );
}

async function bloquear(compra: any, novoStatus: string) {
  await supabase.from("mwa_compras").update({
    status: novoStatus, liberado: false,
    sessao_status: compra.produto === "sessao" ? "reembolsada" : compra.sessao_status,
  }).eq("id", compra.id);
  // revoga programa (21d/90d) ligado a esta compra
  await supabase.from("mwa_programas")
    .update({ status: "cancelado" }).eq("compra_id", compra.id);
}

// ── upsert da compra (idempotente por transação) ────────────────────────────
async function upsertCompra(ev: any, produto: string, statusCompra: string) {
  const { data: existente } = await supabase
    .from("mwa_compras").select("*")
    .eq("hotmart_transaction", ev.transaction).maybeSingle();

  if (existente) {
    await supabase.from("mwa_compras")
      .update({ status: statusCompra, atualizado_em: new Date().toISOString() })
      .eq("id", existente.id);
    return { ...existente, status: statusCompra };
  }
  const { data: nova } = await supabase.from("mwa_compras").insert({
    gateway: "hotmart", produto, hotmart_product_id: ev.productId,
    offer_code: ev.offerCode, hotmart_transaction: ev.transaction,
    buyer_email: ev.buyerEmail, buyer_nome: ev.buyerNome, valor: ev.valor,
    status: statusCompra, detalhes: {},
  }).select("*").single();
  return nova;
}

// ── handler principal ───────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ erro: "method_not_allowed" }, 405);

  // 1) valida HOTTOK
  const hottok = req.headers.get("x-hotmart-hottok") ?? "";
  const hottokOk = HOTTOK.length > 0 && timingSafeEqual(hottok, HOTTOK);
  if (!hottokOk) return json({ erro: "hottok_invalido" }, 401);

  // 2) parse
  let payload: any;
  try { payload = await req.json(); } catch { return json({ erro: "json_invalido" }, 400); }
  const ev = parsePayload(payload);

  // 3) registra evento (idempotência via índice único)
  const { error: logErr } = await supabase.from("mwa_hotmart_eventos").insert({
    hotmart_event_id: ev.eventId, transaction: ev.transaction, event: ev.event,
    product_id: ev.productId, offer_code: ev.offerCode, buyer_email: ev.buyerEmail,
    status: ev.status, hottok_ok: true, payload,
  });
  if (logErr) {
    // 23505 = unique_violation → evento repetido, já processado
    if ((logErr as any).code === "23505") return json({ ok: true, duplicado: true });
    console.error("Erro ao logar evento:", logErr);
    return json({ erro: "erro_log" }, 500);
  }

  // 4) mapeia produto
  const produto = MAP_PRODUTO[ev.productId];
  if (!produto) {
    await supabase.from("mwa_hotmart_eventos")
      .update({ processado: true, erro: "produto_desconhecido" })
      .eq("transaction", ev.transaction).eq("event", ev.event);
    return json({ ok: true, ignorado: "produto_desconhecido" });
  }

  // 5) roteia por evento
  try {
    switch (ev.event) {
      case "PURCHASE_APPROVED":
      case "PURCHASE_COMPLETE": {
        const compra = await upsertCompra(ev, produto, ev.event === "PURCHASE_COMPLETE" ? "completa" : "aprovada");
        if (!compra.liberado) {
          if (produto === "21d") await liberar21d(compra);
          else if (produto === "90d") await liberar90d(compra);
          else if (produto === "sessao") await registrarSessao(compra);
        }
        break;
      }
      case "PURCHASE_PENDING":
      case "PURCHASE_BILLET_PRINTED":
      case "PURCHASE_WAITING_PAYMENT":
        await upsertCompra(ev, produto, "pendente");
        break;
      case "PURCHASE_CANCELED":
        await upsertCompra(ev, produto, "cancelada");
        break;
      case "PURCHASE_EXPIRED":
        await upsertCompra(ev, produto, "expirada");
        break;
      case "PURCHASE_REFUNDED": {
        const compra = await upsertCompra(ev, produto, "reembolsada");
        await bloquear(compra, "reembolsada");
        break;
      }
      case "PURCHASE_CHARGEBACK": {
        const compra = await upsertCompra(ev, produto, "chargeback");
        await bloquear(compra, "chargeback");
        break;
      }
      case "PURCHASE_PROTEST":
        // pedido de reembolso / disputa: só marca (não bloqueia por padrão)
        await upsertCompra(ev, produto, "em_analise");
        break;
      default:
        // evento não tratado: registrado, sem ação
        break;
    }

    await supabase.from("mwa_hotmart_eventos")
      .update({ processado: true })
      .eq("transaction", ev.transaction).eq("event", ev.event);
    return json({ ok: true });
  } catch (e) {
    console.error("Erro ao processar:", e);
    await supabase.from("mwa_hotmart_eventos")
      .update({ processado: false, erro: String(e) })
      .eq("transaction", ev.transaction).eq("event", ev.event);
    return json({ erro: "erro_processamento" }, 500);
  }
});
