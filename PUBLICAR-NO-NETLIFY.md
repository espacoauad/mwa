# Publicar o MWA no Netlify

Sua conta Netlify: espacoauad@gmail.com (já existe).
Objetivo: colocar o app online num link tipo `algo.netlify.app` para criar a conta de
teste e, depois, apontar o `metodomwa.com.br`.

---

## Caminho A — Arrastar e soltar (mais rápido, recomendado agora)

Publica a versão que está no SEU PC (já com as credenciais certas do Supabase novo).

1. Abra o **PowerShell** na pasta do projeto:
   - No Explorer, entre em `C:\Users\wanes\OneDrive\Desktop\MWA`
   - Clique na barra de endereço, escreva `powershell` e Enter.
2. Rode o comando de build:
   ```
   npm run build
   ```
   Espere terminar. Vai aparecer uma pasta nova chamada **`dist`**.
3. Abra o Netlify: https://app.netlify.com → botão **Add new site** → **Deploy manually**.
4. **Arraste a pasta `dist`** para a área indicada.
5. O Netlify publica e te dá um endereço tipo `https://mwa-xxxx.netlify.app`. Abra pra conferir.

> Sempre que a gente mudar o app, você roda `npm run build` de novo e arrasta o `dist` outra vez.
> (Depois dá pra automatizar isso com o GitHub — Caminho B.)

---

## Caminho B — Conectar ao GitHub (atualiza sozinho, para depois)

Publica automático a cada mudança, mas exige enviar o código pro GitHub primeiro.

1. **Enviar o código atualizado pro GitHub** (com o GitHub Desktop é mais fácil):
   - Se o Git reclamar de um arquivo `index.lock`, apague `C:\Users\wanes\OneDrive\Desktop\MWA\.git\index.lock` e tente de novo.
   - No GitHub Desktop, confirme as mudanças (commit) e clique em **Push**.
2. No Netlify: **Add new site → Import an existing project → GitHub → repositório `espacoauad/MWA`**.
3. Selecione a branch **security/correcoes-criticas** (é a que tem a versão correta).
4. Confirme: build command `npm run build`, publish directory `dist` (o `netlify.toml` já define isso).
5. **Deploy**. O Netlify compila e publica sozinho.

---

## Depois de publicar (qualquer caminho)

1. Abra o link do Netlify e crie uma **conta de aluno de teste** (opção Criar conta).
2. Me avise o e-mail dessa conta — eu **libero um programa nela** no banco, pra a revisão da Hotmart ver o conteúdo.
3. Aí apontamos o **metodomwa.com.br** (Netlify → Domain settings + DNS no Registro.br).
4. Só então informamos à Hotmart o `metodomwa.com.br` + login de teste.
