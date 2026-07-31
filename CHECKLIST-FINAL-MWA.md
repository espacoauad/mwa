# MWA — O que falta pra terminar (checklist atualizado)

Projeto novo: **MWA** · ref `kfavxgrvikflzyzvcoyb` · região São Paulo
Atualizado em 11/07/2026.

---

## ✅ Já está pronto (não precisa mexer)

- [x] Projeto novo criado (São Paulo)
- [x] Banco todo montado: 12 tabelas `mwa_*`, RLS ligado, 15 policies, trigger de proteção de role, funções e bucket `mwa-conteudo`
- [x] Correções de segurança C1, C2 e C4 aplicadas
- [x] Código do app já aponta pro projeto novo (`src/lib/supabase.js` com URL e chave certas)
- [x] Edge Function `mwa-resgatar-cupom` deployada e ativa

---

## ⬜ O que falta

### 1. Recriar 2 Edge Functions no projeto novo
Faltam duas: **`mwa-mp-preferencia`** e **`enviar-email-cupom`**.
O código delas está só no **projeto antigo (Espaço Auad)**. Pra cada uma:

1. Abra o **projeto antigo** no Supabase → menu **Edge Functions**
2. Clique na função (ex.: `mwa-mp-preferencia`)
3. Abra o código (arquivo `index.ts`) e **copie todo o texto**
4. Cole aqui no chat — eu deployo no projeto novo

> Alternativa sem me passar o código: no projeto novo → Edge Functions → **Deploy a new function → Via Editor** → colar o código → Deploy.

### 2. Cadastrar os secrets das functions
Depois de deployadas, elas precisam dos mesmos segredos do projeto antigo:
- Token do **Mercado Pago**
- Chave do **serviço de e-mail**

Onde: projeto novo → **Edge Functions → Secrets**. (Pode me passar os valores que eu cadastro, ou você mesma cadastra.)

### 3. Ligar proteção de senha vazada (item D5)
Painel → **Authentication → Sign In / Providers → Passwords** → ativar **Leaked password protection**. (Só um clique — não dá pra fazer pela API.)

### 4. Testar o ciclo completo
1. `npm run dev` → criar conta de teste → completar onboarding
2. Registrar água/refeição → conferir no Table Editor que caiu em `mwa_agua`/`mwa_refeicoes`
3. Criar cupom de teste no SQL Editor: `insert into mwa_cupons (codigo) values ('MWA-TESTE-001');`
4. Resgatar o cupom pela tela → deve criar conta + marcar usado + criar programa 21d
5. Virar admin: `update mwa_perfis set role='admin' where email='SEU_EMAIL';` → abrir painel admin

### 5. (Depois que tudo funcionar) Desligar o legado
No projeto antigo: apagar as Edge Functions `mwa-*` e, se quiser, as tabelas `mwa_*` antigas (só têm dados de teste).

---

## Próximo passo imediato
Me manda o código das duas functions (`mwa-mp-preferencia` e `enviar-email-cupom`) que eu deployo pra você. Sem elas, pagamento e e-mail de cupom não funcionam ainda.
