# 🧪 Guia de Teste — AnelHidratacao

## ⚡ Teste Rápido (5 minutos)

### 1. Visualizar o Componente Demo

Crie uma rota dev temporária para testar isoladamente:

**Opção A: Adicionar ao `App.jsx`**
```jsx
// No topo de App.jsx, importe:
import AnelHidratacaoDemo from './components/hoje/AnelHidratacao.demo.jsx'

// Adicione uma rota:
if (window.location.pathname === '/demo') return <AnelHidratacaoDemo />
```

Então acesse: `http://localhost:5173/demo`

**Opção B: Testar via Storybook** (se estiver usando)
```bash
npm run storybook
# Crie .stories.jsx do componente
```

### 2. Testar os 4 Estados

No `/demo`:

1. **Estado Inicial (0%)**
   - Clique em botão "0% (Início)"
   - Observe: Cor ouro, frase sobre "pequenos goles"

2. **Estado Progresso (40–79%)**
   - Clique em "40% (Prog)" ou "85% (Prox)"
   - Observe: Cor muda para sage verde, nova frase

3. **Estado Conquista (100%)**
   - Clique em "100% (Meta)"
   - Observe: Cor verde profundo, frase em dourado

4. **Interatividade**
   - Clique nos botões +250 ml / −250 ml
   - Veja o anel animar suavemente
   - Veja a micro-copy mudar

---

## 🔗 Teste Integrado (No App Real)

### Pré-requisito
- Ter uma conta ativa no app MWA
- Estar na tela "Hoje"

### Passos

1. **Login**
   ```
   http://localhost:5173/
   email: seu@email.com
   senha: Sua senha
   ```

2. **Navegar para Hoje**
   - Clique na aba "Hoje" na barra de navegação

3. **Localizar o Componente**
   - Role para baixo após "Resumo do dia"
   - Procure por seção com ícone 💧 e texto "Estratégia de Hidratação"

4. **Testar Interação**
   - Clique em "+ 250 ml" várias vezes
   - Observe o anel preencher em tempo real
   - Micro-copy muda conforme progresso
   - Clique em "−" para remover água

5. **Verificar Persistência**
   - Atualize a página (`F5`)
   - O consumo de água deve permanecer (se conectado ao backend)

---

## 📊 Casos de Teste Específicos

### Test Case 1: Animação do Anel
**Objetivo**: Verificar se SVG anima suavemente

**Ação**:
```javascript
// No console:
const circle = document.querySelector('circle[stroke-dasharray]')
circle.getAttribute('stroke-dasharray')
// Deve mudar conforme clica em +250ml
```

**Esperado**: Valores aumentam gradualmente (ex: "0 314" → "157 314" → "314 314")

---

### Test Case 2: Mudança de Cores

**Objetivo**: Verificar se cores mudam por estado

| Clique em | Percentual | Cor Esperada | Local |
|-----------|-----------|-------------|-------|
| "0% (Início)" | 0% | #C9963B (ouro) | Número % e anel |
| "40% (Prog)" | 40% | #879B55 (sage) | Número % e anel |
| "100% (Meta)" | 100% | #344528 (verde) | Número % e anel |

**Verificar no Inspector**:
```javascript
// Console:
document.querySelector('span.text-3xl').style.color
// Deve ser: rgb(201, 150, 59) → rgb(135, 155, 85) → rgb(52, 69, 40)
```

---

### Test Case 3: Micro-copy Educativa

**Objetivo**: Verificar se frases mudam corretamente

| Percentual | Frase Esperada |
|-----------|---|
| 0–39% | "Comece com calma..." |
| 40–79% | "Seu corpo responde melhor..." |
| 80–99% | "Você está perto da meta..." |
| 100%+ | "Meta concluída..." |

**Testar**:
1. Clique em cada preset
2. Leia a frase abaixo do anel
3. Verifique se corresponde à tabela

---

### Test Case 4: Acessibilidade

**Teste com Leitor de Tela** (NVDA, JAWS, VoiceOver):

1. Ative o leitor de tela
2. Navegue até o componente
3. **Esperado**: Lê algo como:
   ```
   "Hidratação: 1500 ml de 2500 ml, 60% da meta. Seu corpo responde melhor quando a rotina apoia."
   ```

**Teste sem Mouse**:
1. Abra DevTools (F12)
2. Desative o mouse
3. Use `Tab` para navegar até os botões
4. Pressione `Enter` para clicá-los
5. **Esperado**: Botões são focáveis e clicáveis via teclado

---

### Test Case 5: Responsividade

**Viewport Mobile (375px)**:
- Abra DevTools
- Clique em "Toggle device toolbar" (Ctrl+Shift+M)
- Selecione iPhone 12
- **Esperado**: Anel redimensiona, texto legível, botões acessíveis

**Viewport Tablet (768px)**:
- Redimensione para 768px de largura
- **Esperado**: Espaçamento preservado

**Viewport Desktop (1280px)**:
- Redimensione para 1280px
- **Esperado**: Layout limpo, não muito grande

---

## 🐛 Troubleshooting

### Problema: Anel não aparece
**Solução**:
1. Verifique console (F12 → Console tab)
2. Procure por `Uncaught Error` envolvendo `AnelHidratacao`
3. Se houver erro, revise a sintaxe do SVG

### Problema: Cores não mudam
**Solução**:
```javascript
// No console, verificar função:
const pct = 50
const estado = pct >= 40 && pct < 80 ? 'progresso' : 'outro'
console.log(estado) // deve ser 'progresso'
```

### Problema: Botões não funcionam
**Solução**:
1. Verifique se `onClickAdicionar` é passado
2. Clique no botão e abra DevTools → Network
3. Veja se há alguma requisição ao backend

### Problema: Tela congela ao entrar em Hoje
**Solução**:
1. Abra DevTools → Console
2. Procure por erros (vermelho)
3. Se houver erro no `AnelHidratacao.jsx`, verifique:
   - Falta de fechar chave `}`
   - `className` com erro de sintaxe
   - Importações faltando

---

## ✅ Checklist de Validação

- [ ] Componente aparece na tela "Hoje"
- [ ] Anel SVG renderiza sem erros
- [ ] Percentual muda quando clica em ±250 ml
- [ ] Cores mudam conforme estado (4 cores diferentes)
- [ ] Micro-copy muda conforme estado (4 frases diferentes)
- [ ] Botões respondem ao clique
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Acessível (pode ser navegado via teclado)
- [ ] Sem erros no console (F12)
- [ ] Sem erros no servidor (npm logs)

---

## 📝 Relatório de Teste

Copie e preencha após testar:

```markdown
## Teste do AnelHidratacao — [DATA]

**Testador**: [Seu nome]
**Navegador**: [Chrome/Firefox/Safari]
**Viewport**: [Mobile/Tablet/Desktop]

### Resultados
- [ ] Renderização: PASSOU / FALHOU
- [ ] Animação: PASSOU / FALHOU
- [ ] Cores: PASSOU / FALHOU
- [ ] Micro-copy: PASSOU / FALHOU
- [ ] Interatividade: PASSOU / FALHOU
- [ ] Acessibilidade: PASSOU / FALHOU
- [ ] Responsividade: PASSOU / FALHOU

### Comentários
[Descreva qualquer comportamento inesperado aqui]

### Screenshots
[Adicione prints se aplicável]
```

---

## 🎥 Teste Visual — Diferenças Antes/Depois

### Antes (AnelMeta simples)
```
┌─────────────────────────────┐
│      Água        │  Fibras   │
│ 🔵 60% de meta  │ 🔵 80%    │
│ 1.5 / 2.5 L     │ 25 / 30g  │
└─────────────────────────────┘
```

### Depois (AnelHidratacao premium)
```
┌──────────────────────────────────────────┐
│         💧 Estratégia de Hidratação       │
│  A hidratação estratégica sinaliza...    │
│                                          │
│               🔵 60%                      │
│            [Anel grande]                  │
│          1.5 L de 2.5 L                   │
│                                          │
│  "Seu corpo responde melhor quando..."   │
│                                          │
│           [−]  [+250 ml]                  │
└──────────────────────────────────────────┘
```

---

## 🚀 Próximos Testes (Futuros)

- [ ] Performance com muitas renderizações
- [ ] Teste de contraste (WCAG AAA)
- [ ] Teste com diferentes navegadores antigos
- [ ] Teste em dispositivos reais (não emulador)
- [ ] Teste de velocidade (Lighthouse)

---

**Testes completos = Componente pronto para produção! 🌿**
