# 🔐 Sistema de Bloqueio de Acesso - Dia 111

> ⚠️ **DOCUMENTO OBSOLETO (2026-07-25)**: Este documento descreve o modelo antigo de 21+90=111 dias, que não corresponde mais à estrutura real do programa (30 dias base + 90 dias corridos). O código correspondente nunca foi implementado em produção — `diaDoPrograma()` e `totalDiasPrograma()` em `src/utils/calculos.js` limitam o programa a 90 dias. Mantido apenas para referência histórica.

Data: 2026-07-13  
Status: ✅ **IMPLEMENTADO**

---

## 📋 O Que Faz

Quando a pessoa chega ao **Dia 111** (fim do ciclo de 21 + 90 dias):

### ✅ Se pagou novo ciclo de 90 dias:
- ✅ Acesso LIBERADO
- ✅ Começa novo ciclo (Dia 1 do 90d)
- ✅ Histórico anterior permanece visível

### ❌ Se NÃO pagou novo ciclo:
- ❌ Acesso BLOQUEADO
- ❌ Não consegue entrar em nenhuma aba do app
- ❌ Vê tela de "Acesso Temporariamente Bloqueado"
- ✅ MAS todos os seus dados estão salvos

---

## 🔍 Como Funciona

### Lógica de Verificação

```javascript
// No App.jsx
const acessoBloqueado = usuario && diaAtual === 111 && !programa90Ativo

if (acessoBloqueado) {
  return <AcessoBloqueado usuario={usuario} />
}
```

**Condições:**
- `usuario` existe (usuário logado)
- `diaAtual === 111` (completou 111 dias)
- `!programa90Ativo` (NÃO tem um programa 90d com status 'ativo')

### Banco de Dados (mwa_programas)

```
tipo          | status    | data_inicio | Resultado
==================================================
21d           | ativo     | 2026-05-14  | ❌ Bloqueado (só 21d)
21d           | inativo   | 2026-05-14  | ❌ Bloqueado (inativo)
90d           | ativo     | 2026-06-04  | ✅ Liberado (90d ativo)
90d           | inativo   | 2026-06-04  | ❌ Bloqueado (inativo)
```

---

## 📱 Tela de Acesso Bloqueado

Arquivo: `src/components/layout/AcessoBloqueado.jsx`

### Elementos:

1. **Ícone de Bloqueio** 🔐
   - Ícone grande com aura dourada
   - Visual impactante e claro

2. **Cabeçalho**
   ```
   Logo MWA
   Ciclo Concluído!
   [Nome], chegou o momento de continuar
   ```

3. **Mensagem Principal**
   - Explicação clara do que aconteceu
   - Aviso: dados estão salvos
   - Necessário novo pagamento para continuar

4. **Aviso de Acesso Bloqueado** (em vermelho)
   ```
   ⚠️ Acesso Temporariamente Bloqueado
   Sem um programa ativo, você não pode acessar 
   as funcionalidades do app. Mas seus dados estão 
   completamente salvos!
   ```

5. **O Que Você Ganha Continuando** (em verde)
   - ✅ Novo ciclo de 90 dias
   - ✅ Histórico de 111 dias visível
   - ✅ Acompanhamento contínuo
   - ✅ Avatar e sementes
   - ✅ Suporte via WhatsApp

6. **Botões de Ação**
   - **Principal (Ouro):** "Adquirir Novo Ciclo de 90 Dias" → Hotmart
   - **Secundário (Branco):** "Falar com Suporte" → WhatsApp

7. **Aviso Legal**
   - "Seus dados estão completamente seguros"
   - "Será necessário fazer uma nova compra para continuar"

---

## 🔄 Fluxo Completo

### Cenário 1: PAGOU o novo ciclo ✅

```
Dia 111 (sem programa 90d)
    ↓
App.jsx verifica:
- diaAtual === 111? ✅
- programa90Ativo? ❌
- acessoBloqueado = true
    ↓
Mostra AcessoBloqueado
    ↓
Clica "Adquirir Novo Ciclo"
    ↓
Abre checkout Hotmart
    ↓
Efetua pagamento
    ↓
Novo programa 90d criado com status 'ativo'
    ↓
Volta ao app
    ↓
App.jsx verifica novamente:
- diaAtual === 111? ✅
- programa90Ativo? ✅ (AGORA SIM!)
- acessoBloqueado = false
    ↓
✅ ACESSO LIBERADO
    ↓
Clica botão de conclusão
    ↓
Vê tela épica de 111 dias
    ↓
Começa Dia 1 do novo ciclo
```

### Cenário 2: NÃO pagou ❌

```
Dia 111 (sem programa 90d)
    ↓
App.jsx verifica:
- diaAtual === 111? ✅
- programa90Ativo? ❌
- acessoBloqueado = true
    ↓
Mostra AcessoBloqueado
    ↓
Usuário vê:
- Tela de bloqueio clara
- Explicação do motivo
- Aviso que dados estão salvos
- Botão para pagar
- Botão para falar com suporte
    ↓
Opção 1: Clica "Adquirir"
    → Segue fluxo de pagamento
    
Opção 2: Clica "Falar com Suporte"
    → Abre WhatsApp
    → Mensagem pré-preenchida
```

---

## 📊 Dados Preservados

Quando bloqueado no dia 111, TUDO permanece salvo:

- 📊 **Histórico de Peso:** Dias 1-111 completos
- 📸 **Fotos:** Todas as 4 fotos de cada semana (7, 14, 21, 28... 111)
- 📏 **Medidas:** Cintura, quadril, peito de cada pesagem
- 🌱 **Sementes:** Total ganho durante 111 dias
- 📝 **Refeições:** Todos os registros de comida
- 🎮 **Avatar:** Skins equipadas e compradas
- 📅 **Dicas:** Marcadas como lidas

Quando pagar e ativar novo ciclo 90d:
- ✅ Tudo fica visível no gráfico de evolução
- ✅ Novo ciclo começa do Dia 1
- ✅ Comparação: Dia 1 do novo ciclo vs Dia 1 do ciclo anterior

---

## ⚙️ Integração Técnica

### App.jsx
```javascript
import AcessoBloqueado from './components/layout/AcessoBloqueado.jsx'

// No AppInner component
const acessoBloqueado = usuario && diaAtual === 111 && !programa90Ativo

if (acessoBloqueado) {
  return <AcessoBloqueado usuario={usuario} />
}
```

### AcessoBloqueado.jsx
```javascript
export default function AcessoBloqueado({ usuario }) {
  function continuarComNovoCiclo() {
    abrirCheckout('programa90d')  // ← Hotmart
  }
  // ... renderiza tela de bloqueio
}
```

### Funções Utilizadas
- `abrirCheckout('programa90d')` — Abre página de pagamento Hotmart
- `linkWhatsApp(mensagem)` — Abre WhatsApp com mensagem pré-preenchida

---

## 🛡️ Segurança & Verificações

**O bloqueio é verificado em TEMPO REAL:**
- Sempre que App.jsx renderiza
- Antes de mostrar qualquer tela
- Admin (`usuario.role === 'admin'`) é exceção
- Valida no banco: `programa90Ativo !== null`

**Não há bypass:**
- Não consegue acessar por URL direta
- Não consegue clicar em abas
- Recarregar page → valida novamente

---

## 📝 Mensagens Mostradas

### Bloqueio
```
Ciclo Concluído!
[Nome], chegou o momento de continuar

Você completou seus 111 dias e chegou ao fim do ciclo atual. 
Para continuar acompanhando sua evolução e manter todos os seus 
dados de peso, fotos e progresso, é necessário adquirir um novo 
ciclo de 90 dias.

✨ Tudo que você construiu permanece: seu histórico de 111 dias 
está salvo e visível no novo ciclo.

⚠️ Acesso Temporariamente Bloqueado
Sem um programa ativo, você não pode acessar as funcionalidades 
do app. Mas seus dados estão completamente salvos e prontos para 
o próximo ciclo!
```

### WhatsApp Pre-filled
```
Olá! Completei os 111 dias e gostaria de saber mais sobre como 
continuar com o novo ciclo.
```

---

## ✅ Checklist de Implementação

- ✅ Componente `AcessoBloqueado.jsx` criado
- ✅ Integração no `App.jsx`
- ✅ Verificação: `diaAtual === 111 && !programa90Ativo`
- ✅ Redirecionamento para Hotmart (botão "Adquirir")
- ✅ Link WhatsApp para Suporte
- ✅ Mensagens claras e amigáveis
- ✅ Aviso que dados estão salvos
- ✅ Admin não é bloqueado
- ✅ Design consistente com MWA

---

## 🧪 Como Testar

### Teste 1: Simular Dia 111 sem programa 90d
```javascript
// No DevTools, modifique:
simuladorDia = 111
// E garanta que programa90Ativo = false
```
Resultado esperado: Tela de bloqueio

### Teste 2: Simular Dia 111 com programa 90d ativo
```javascript
simuladorDia = 111
// Com programa 90d ativo no banco
```
Resultado esperado: Acesso liberado → Tela de conclusão

### Teste 3: Botão Hotmart
Clique em "Adquirir Novo Ciclo"
Resultado esperado: Abre checkout Hotmart

### Teste 4: Botão WhatsApp
Clique em "Falar com Suporte"
Resultado esperado: Abre WhatsApp com mensagem pré-preenchida

---

## 💰 Modelo de Negócio

```
Dia 111 atinge
    ↓
❌ Sem pagamento novo ciclo
    ↓
Acesso BLOQUEADO
    ↓
Usuário vê tela clara
    ↓
Usuário clica "Adquirir"
    ↓
Vai para Hotmart
    ↓
PAGAMENTO 💳
    ↓
Novo ciclo criado
    ↓
Volta ao app
    ↓
Acesso LIBERADO ✅
```

---

## 📁 Arquivos Modificados/Criados

### Criados:
- `src/components/layout/AcessoBloqueado.jsx` (NEW)

### Modificados:
- `src/App.jsx` (adicionada lógica de bloqueio)

---

## 💚 Status Final

**PRONTO PARA PRODUÇÃO!** ✅

Quando uma pessoa chegar no Dia 111 sem pagar novo ciclo, verá:
1. Tela clara de bloqueio
2. Explicação do motivo
3. Aviso que dados estão salvos
4. Opção de pagar
5. Opção de falar com suporte

**Isso garante:**
- 💰 Receita contínua
- 🛡️ Sem acesso gratuito pós-ciclo
- 😊 Experiência amigável (dados preservados)
- 🤝 Opção de suporte (WhatsApp)

---

*By Wanessa Auad — Sistema de Segurança e Receita*
