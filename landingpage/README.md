# MWA — Landing Page (Jornada de 90 Dias)

Landing page premium da marca MWA (Método Wanessa Auad | My Wellness Approach), construída com React + Vite + Tailwind CSS v4, seguindo o Brand Book oficial.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # gera a pasta dist/ para publicação
```

## Configurar o checkout da Hotmart

Edite **`src/config.js`** e substitua o placeholder pelo seu link real:

```js
export const CHECKOUT_URL = 'https://pay.hotmart.com/SEU_CODIGO_AQUI'
```

Todos os botões CTA da página usam esse valor automaticamente.

## Fotos

Há dois espaços reservados para fotos (marcados na página):

- `src/sections/Story.jsx` — foto elegante de Wanessa (proporção 4:5)
- `src/sections/About.jsx` — foto profissional (circular)

Substitua o bloco placeholder por `<img src="..." />` quando tiver as imagens.

## Estrutura

```
src/
├── config.js            # link Hotmart + dados da marca
├── index.css            # tema (cores, fontes do Brand Book)
├── components/ui.jsx    # componentes reutilizáveis (CtaButton, Section, Title...)
└── sections/            # uma seção da landing por arquivo
```

## Publicação

Rode `npm run build` e publique a pasta `dist/` em qualquer hospedagem estática (Netlify, Vercel, Hostinger etc.).
