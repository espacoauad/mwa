# DNS do metodomwa.com.br (Registro.br → Modo Avançado)

Objetivo: site no Netlify + e-mail no Google Workspace, ao mesmo tempo.
Site usa registro A/CNAME; e-mail usa MX/TXT. Eles convivem sem conflito.

## Registros a ter na zona (tela "Configurar zona DNS" — modo avançado)

ATENÇÃO: nessa tela o NOME é o **domínio inteiro** (não usa "@").
- Para o domínio raiz, escreva: `metodomwa.com.br`
- Para o www, escreva: `www.metodomwa.com.br`

| NOME (digitar assim)     | TIPO | DADOS / VALOR | Observação |
|--------------------------|------|---------------|------------|
| `metodomwa.com.br`       | A    | `75.2.60.5`   | Site no Netlify |
| `www.metodomwa.com.br`   | CNAME| `metodomwa.netlify.app` | Site no www |
| `metodomwa.com.br`       | MX   | `smtp.google.com` — prioridade `1` | E-mail Google Workspace |
| `metodomwa.com.br`       | TXT  | `v=spf1 include:_spf.google.com ~all` | SPF (anti-spam do Google) |
| `metodomwa.com.br`       | TXT  | `google-site-verification=SEU_CODIGO` | Verificação do Workspace (pegar no painel do Google) |

> Obs.: como o domínio entrou "em transição", o A que você salvou no endereçamento simplificado
> pode não aparecer aqui — se estiver vazio, adicione o A também, pela lista acima.

## Onde pegar o código de verificação do Google
Painel admin do Google Workspace → **Ativar Gmail / Verificar domínio** → ele mostra um
registro TXT tipo `google-site-verification=xxxxxxxx`. Copie esse valor para o último TXT acima.

## Depois de salvar os registros
1. No Google Workspace: clique em **Verificar** / **Ativar Gmail**.
2. No Netlify: **Domain management → Add domain → metodomwa.com.br** (liga o HTTPS/cadeado).
3. Propagação: de alguns minutos até algumas horas.

## Importante
- NÃO usar os campos "Alterar servidores DNS" — a gente ficou nos registros (endereçamento).
- Só UM conjunto de MX (o `smtp.google.com`). Não misture com os antigos `aspmx`.
