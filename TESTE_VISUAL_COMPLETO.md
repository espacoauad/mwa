# 🧪 Teste Visual Completo — MWA

**Data:** 10 de julho de 2026  
**Servidor:** http://localhost:5173  
**Componentes a Testar:** Seu Progresso + A Lente da Consciência

---

## 📋 Checklist de Testes

### **Teste 1: Seu Progresso — Tela "Hoje"**

#### Pré-requisitos:
- [ ] Fazer login no app MWA
- [ ] Estar na tela "Hoje"
- [ ] Ter pelo menos 1 pesagem registrada (ir em Progresso > Registrar Pesagem)

#### Passos:
1. **Abra a tela "Hoje"**
   - Verifique se a seção "Seu Progresso" aparece após "Seu consumo de hoje"
   - Esperado: Card com fundo premium (verde/sage), com título "Seu progresso"

2. **Verifique os 3 cards:**

   **Card 1: Peso + Evolução**
   - [ ] Título: "Peso atual"
   - [ ] Número grande em verde escuro (ex: 72,4 kg)
   - [ ] Ícone TrendingDown (verde) ou TrendingUp (dourado)
   - [ ] Valor de variação em destaque (ex: −2,8 kg)
   - [ ] Subtítulo: "desde o início"
   - [ ] **Cores esperadas:** Verde profundo, sage (para perda)

   **Card 2: Medidas**
   - [ ] Título: "Medidas"
   - [ ] Até 2 medidas listadas (ex: Cintura −4 cm)
   - [ ] Formato: "−X cm" (perda) ou "+X cm" (ganho)
   - [ ] **Cores:** Sage para perda, ouro para ganho
   - [ ] Se sem medidas: "Nenhuma medida registrada ainda"

   **Card 3: Histórico**
   - [ ] Título: "Evolução semanal"
   - [ ] Últimas 2 semanas listadas
   - [ ] Formato: "Sem N: −X kg"
   - [ ] **Cores:** Sage para perda, ouro para ganho

3. **Responsividade:**
   - [ ] Mobile (375px): Cards empilhados (1 coluna)
   - [ ] Tablet (768px): Grid adaptado
   - [ ] Desktop (1280px): 3 cards lado a lado

4. **Histórico Resumido (se 2+ pesagens):**
   - [ ] Tabela com linhas arredondadas
   - [ ] Colunas: Semana | Peso | Delta
   - [ ] Cores consistentes com Brand Book

#### Resultado Esperado:
✅ Visual premium, minimalista, sem alerta vermelho  
✅ Números em destaque com tipografia serifada  
✅ Sem placeholders ou "N/A" quando há dados

---

### **Teste 2: A Lente da Consciência — Ferramentas**

#### Pré-requisitos:
- [ ] Fazer login no app MWA
- [ ] Estar na tela "Ferramentas"

#### Passos:
1. **Localize a seção "A Lente da Consciência"**
   - [ ] Aparece após "Restaurante Saudável"
   - [ ] Background: gradiente verde/sage com border verde
   - [ ] Ícone 🔍 visível
   - [ ] Título: "A Lente da Consciência"
   - [ ] Descrição: "Uma ferramenta de pausa guiada..."
   - [ ] Microcopy em itálico: "Consciência não é controle rígido..."

2. **Clique em "Abrir ferramenta"**
   - [ ] Modal abre em fullscreen (mobile) ou centrado (desktop)
   - [ ] Fundo: overlay escuro semi-transparente

3. **Etapa 1 — Pausar:**
   - [ ] Título: "Pausar"
   - [ ] Pergunta: "O que eu estou sentindo agora?"
   - [ ] Descrição: "Consciência começa quando você reconhece..."
   - [ ] 6 opções com emoji:
     - [ ] 🍽️ Fome física
     - [ ] 💭 Vontade emocional
     - [ ] 😴 Cansaço
     - [ ] 🫨 Ansiedade
     - [ ] 🔄 Hábito automático
     - [ ] ❓ Não sei ainda
   - [ ] Barra de progresso: 33% (1 de 3)
   - [ ] Botão "Voltar": desabilitado (cinza)
   - [ ] Botão "Continuar": desabilitado até seleção

4. **Selecione uma opção:**
   - [ ] Card muda de cor (border sage, background sage-claro)
   - [ ] Ícone checkmark aparece
   - [ ] Botão "Continuar" fica habilitado (verde)

5. **Clique "Continuar":**
   - [ ] Transição suave para Etapa 2
   - [ ] Ícone muda (Eye → Heart)
   - [ ] Barra de progresso: 66% (2 de 3)
   - [ ] Botão "Voltar": habilitado

6. **Etapa 2 — Observar:**
   - [ ] Pergunta: "O que meu corpo ou minha rotina realmente precisam?"
   - [ ] Descrição: "Olhe além do impulso. Qual é a real necessidade?"
   - [ ] 6 opções com emoji:
     - [ ] 🥗 Comer algo nutritivo
     - [ ] 💧 Beber água
     - [ ] 🛌 Descansar
     - [ ] 🌬️ Respirar por 1 minuto
     - [ ] 📋 Organizar a próxima refeição
     - [ ] 🤝 Pedir apoio
   - [ ] Mesma interação da Etapa 1

7. **Clique "Continuar":**
   - [ ] Transição suave para Etapa 3
   - [ ] Ícone muda (Heart → CheckCircle)
   - [ ] Barra de progresso: 100% (3 de 3)

8. **Etapa 3 — Escolher:**
   - [ ] Pergunta: "Qual é a decisão mais consciente e possível agora?"
   - [ ] Descrição: "Não se trata de perfeição. É sobre escolher com gentileza."
   - [ ] 5 opções com emoji:
     - [ ] 🪶 Fazer uma escolha mais leve
     - [ ] ⚖️ Montar uma refeição equilibrada
     - [ ] ⏱️ Esperar 10 minutos e reavaliar
     - [ ] ✍️ Registrar o que senti
     - [ ] 🌿 Seguir com gentileza, sem culpa
   - [ ] Botão "Continuar" muda label: "Finalizar"

9. **Clique "Finalizar":**
   - [ ] Tela de resultado abre
   - [ ] Ícone grande: CheckCircle em sage-claro
   - [ ] Mensagem: "Você pausou e se escutou."
   - [ ] Resumo da jornada (3 campos):
     - [ ] "Você sentiu:" + valor selecionado
     - [ ] "Seu corpo pediu por:" + valor selecionado
     - [ ] "Sua escolha consciente foi:" + valor selecionado
   - [ ] Microcopy: "Consciência não é controle rígido..."
   - [ ] Botões:
     - [ ] "Começar de novo" (border verde)
     - [ ] "Fechar" (fundo verde)

10. **Clique "Fechar":**
    - [ ] Modal fecha
    - [ ] Volta para Ferramentas

#### Design Visual Esperado:
✅ Modal com fundo off-white (#F5F1E8)  
✅ Cores: verde profundo, sage, dourado discreto  
✅ Sem alerta vermelho, sem tom punitivo  
✅ Ícones dinâmicos por etapa  
✅ Tipografia: serif para títulos, sans-serif para opções  
✅ Spacing generoso (respiro visual)

---

### **Teste 3: A Lente da Consciência — Dicas (a partir do Dia 30)**

#### Pré-requisitos:
- [ ] Fazer login com usuário que está no Dia 30+
- [ ] Estar na tela "Dicas"

#### Passos:
1. **Verifique as abas:**
   - [ ] Se Dia < 30: 2 abas (📊 Informativo | 💡 Dica educativa)
   - [ ] Se Dia ≥ 30: 3 abas (📊 Informativo | 💡 Dica educativa | 🔍 Pausa consciente)

2. **Clique na aba "🔍 Pausa consciente":**
   - [ ] Modal "A Lente da Consciência" abre
   - [ ] Mesmo comportamento que em Ferramentas

3. **Feche o modal:**
   - [ ] Volta para Dicas
   - [ ] Aba "🔍 Pausa consciente" permanece ativa

#### Design Visual Esperado:
✅ Grid dinâmico: 2 colunas → 3 colunas (Dia 30+)  
✅ Ícone 🔍 indica "consciência/clareza"  
✅ Label "Pausa consciente" não é punitivo

---

## 🎨 Design Visual — Checklist Geral

Para **ambos os componentes**, verifique:

### Cores Brand Book:
- [ ] Verde profundo (#344528): títulos, números principais
- [ ] Sage (#879B55): progresso, perda, positivo
- [ ] Dourado (#C9963B): ganho, destaque discreto
- [ ] Off-white (#F5F1E8): backgrounds
- [ ] Cinza (#E8E4DC): borders, dividers

### Tipografia:
- [ ] Títulos principais: serif (Lora), italic, grande
- [ ] Números: serif, bold, em destaque
- [ ] Labels/opções: sans-serif (Poppins), medium
- [ ] Microcopy: sans-serif, small, italic quando apropriado

### Spacing & Respiro:
- [ ] Padding generoso: p-6, p-8
- [ ] Gaps: gap-4, gap-6
- [ ] Não há sensação de "apertado" ou "poluído"
- [ ] Bordas arredondadas: rounded-2xl, rounded-xl

### Acessibilidade:
- [ ] Todos os botões têm labels claros
- [ ] Confirmação visual ao selecionar (checkmark, color change)
- [ ] Botões desabilitados têm opacidade reduzida
- [ ] Sem dependência de cor (números sempre visíveis)

### Tom & Mensagens:
- [ ] Nenhuma linguagem punitiva
- [ ] Nenhuma "etiqueta de alerta"
- [ ] Acolhedor, elegante, respeitoso
- [ ] Educativo, não controlador

---

## 📱 Testes de Responsividade

### Mobile (375px):
- [ ] **Seu Progresso:** Cards empilhados, legíveis, sem scroll horizontal
- [ ] **A Lente:** Modal fullscreen com padding, scroll vertical se necessário
- [ ] Botões: tamanho toque adequado (min 44px)

### Tablet (768px):
- [ ] **Seu Progresso:** Grid adaptado, 2 ou 3 colunas
- [ ] **A Lente:** Modal centrado, com margem confortável
- [ ] Espaçamento harmônico mantido

### Desktop (1280px):
- [ ] **Seu Progresso:** 3 cards perfeitamente alinhados, bem espaçados
- [ ] **A Lente:** Modal centrado, max-width respeitado
- [ ] Visual premium claramente expressado

---

## ✅ Resultado Final

Ao completar todos os testes, você verá:

### **Seu Progresso:**
- ✅ Visual premium que celebra a transformação
- ✅ Conexão clara entre ações e resultados
- ✅ Educativo sem ser punitivo
- ✅ Responsivo em todos os dispositivos

### **A Lente da Consciência:**
- ✅ Ferramenta interativa intuitiva
- ✅ Fluxo guiado em 3 etapas claras
- ✅ Resultado motivador, não julgador
- ✅ Acessível desde Ferramentas e Dicas (Dia 30+)

---

## 🚨 Se Algo Não Aparecer

1. **Seu Progresso não aparece em Hoje:**
   - [ ] Verifique se você tem pelo menos 1 pesagem registrada
   - [ ] Abra DevTools (F12) → Console para ver erros
   - [ ] Verifique se SeuProgresso.jsx foi importado em Hoje.jsx

2. **A Lente não abre:**
   - [ ] Clique novamente no botão
   - [ ] Verifique se há erro no console
   - [ ] Tente em outro dispositivo/zoom diferente

3. **Cores erradas:**
   - [ ] Limpe o cache (Ctrl+Shift+Delete)
   - [ ] Recarregue a página (F5)
   - [ ] Verifique os valores de cor em Tailwind config

4. **Layout quebrado:**
   - [ ] Verifique se Tailwind CSS foi compilado
   - [ ] Rode `npm run build` para verificar
   - [ ] Abra DevTools → Elements para ver classes aplicadas

---

**Quando todos os testes passarem com ✅, faça commit!**

```
Teste visual concluído. Pronto para git commit.
```
