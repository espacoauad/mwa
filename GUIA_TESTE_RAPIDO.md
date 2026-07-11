# ⚡ Guia de Teste Rápido — 5 Minutos

## 🚀 Comece Aqui

### 1. **Seu Progresso** (Tela Hoje)
```
→ Faça login
→ Vá para "Hoje"
→ Role para baixo após "Seu consumo de hoje"
→ Procure por: "Seu progresso" (card com fundo verde/sage)
```

**Esperado:**
- ✅ 3 cards lado a lado (desktop) ou empilhados (mobile)
- ✅ Card 1: Peso atual + variação (ex: 72,4 kg, −2,8 kg)
- ✅ Card 2: Medidas principais (ex: Cintura −4 cm)
- ✅ Card 3: Últimas semanas (ex: Sem 1: −1,2 kg)
- ✅ Histórico resumido abaixo (se 2+ pesagens)

**Cores:**
- Verde profundo para números
- Sage para perda
- Dourado para ganho
- Off-white para fundo

---

### 2. **A Lente da Consciência — Ferramentas**
```
→ Faça login
→ Vá para "Ferramentas"
→ Role até o final, após "Restaurante Saudável"
→ Procure por: "A Lente da Consciência" (seção com border verde)
→ Clique em "Abrir ferramenta"
```

**Fluxo de Teste (30 segundos):**
1. **Etapa 1:** Selecione um sentimento (ex: Ansiedade)
2. **Clique "Continuar"**
3. **Etapa 2:** Selecione uma necessidade (ex: Descansar)
4. **Clique "Continuar"**
5. **Etapa 3:** Selecione uma ação (ex: Seguir com gentileza)
6. **Clique "Finalizar"**
7. **Veja resultado** com resumo da jornada
8. **Clique "Fechar"**

**Esperado:**
- ✅ 3 etapas com perguntas claras
- ✅ Barra de progresso visual (1 de 3 → 2 de 3 → 3 de 3)
- ✅ Ícone dinâmico (Eye → Heart → CheckCircle)
- ✅ Opções com emoji
- ✅ Resultado com resumo motivador
- ✅ Nenhuma cor vermelha ou ton punitivo

---

### 3. **A Lente da Consciência — Dicas (Dia 30+)**
```
→ Faça login com usuário no Dia 30+
→ Vá para "Dicas"
→ Procure pelas abas no topo
```

**Esperado:**
- ✅ **Antes Dia 30:** 2 abas (📊 Informativo | 💡 Dica)
- ✅ **Dia 30+:** 3 abas (adiciona 🔍 Pausa consciente)
- ✅ Clique em "🔍 Pausa consciente" → abre A Lente

---

## 🎨 Verificação Visual Rápida

| Elemento | Esperado |
|----------|----------|
| **Cores** | Verde (#344528), Sage (#879B55), Dourado (#C9963B), Off-white (#F5F1E8) |
| **Tipografia** | Serif para títulos, sans-serif para opções |
| **Spacing** | Generoso, não apertado |
| **Responsive** | Mobile (1 col) → Desktop (2-3 cols) |
| **Tone** | Acolhedor, sem culpa, elegante |
| **Emojis** | Presentes nas opções da Lente |
| **Indicadores** | Checkmark ao selecionar, barra de progresso |

---

## ✅ Checklist Final (2 minutos)

- [ ] **Seu Progresso aparece em Hoje**
- [ ] **Peso e medidas exibem corretamente**
- [ ] **A Lente abre em Ferramentas**
- [ ] **3 etapas funcionam**
- [ ] **Resultado mostra resumo**
- [ ] **A Lente aparece em Dicas (Dia 30+)**
- [ ] **Nenhuma erro no console (F12)**
- [ ] **Responsivo em mobile/desktop**

---

## 🚨 Se der erro:

```
F12 → Console
Procure por mensagens em vermelho
Relate o erro completo
```

---

## ✨ Quando tudo estiver OK:

```bash
git add -A
git commit -m "test: visual verification completed - Seu Progresso + A Lente da Consciência"
```

---

**Tempo esperado:** 5-10 minutos
**Dificuldade:** Nenhuma — só clicar e observar

Aproveite! 🌿
