# MWA Content Studio

Central de conteúdo interna do MWA — não é acessada pelas participantes do programa.

## Rodar localmente

1. Abra uma pasta de terminal dentro de `content-studio/`.
2. Rode `npm install` (só na primeira vez).
3. Rode `npm run dev`.
4. Abra o endereço que aparecer no terminal (algo como `http://localhost:5173`).

Todos os dados ficam salvos no seu navegador (localStorage) — nada é enviado para a internet.

## Publicar no Netlify

1. Rode `npm run build` dentro de `content-studio/` — isso cria a pasta `dist/`.
2. No painel do Netlify, crie um novo site apontando para a pasta `content-studio/`.
3. Configuração de build: comando `npm run build`, pasta de publicação `dist`.
4. Cada vez que quiser atualizar o site publicado, rode o build de novo e publique a nova pasta `dist/` (ou conecte ao GitHub para publicar automaticamente a cada alteração).

## O que funciona sem inteligência artificial

Tudo: planejar o conteúdo, preencher o formulário, gerar o prompt para copiar, guardar rascunhos, aprovar, organizar por status, usar e editar modelos prontos, editar o Guia da Marca, exportar em TXT/PDF, fazer backup e restaurar.

## O que depende de colar em uma IA (Claude, por exemplo)

Somente a redação do texto final. O app nunca chama nenhuma IA sozinho — ele monta o prompt, você copia, cola no Claude.ai (ou outra ferramenta), e cola a resposta de volta no app.

## Apagar apenas os dados de demonstração

Vá em Configurações → "Apagar dados de demonstração". Seus conteúdos reais nunca são apagados por esse botão.
