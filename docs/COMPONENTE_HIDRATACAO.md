# 💧 Componente AnelHidratacao — Documentação Técnica

## 📋 Resumo

Componente React premium que implementa um indicador de progresso de hidratação diária seguindo as diretrizes do Brand Book MWA. Visual minimalista, educativo e responsivo.

---

## 📁 Arquivos Criados/Modificados

### Criado:
- **`src/components/hoje/AnelHidratacao.jsx`** — Componente principal

### Modificado:
- **`src/components/hoje/Hoje.jsx`** — Integração do novo componente

---

## 🎨 Visual Premium MWA

### Indicador Circular
- **Anel fino** com raio de 50 unidades
- **Fundo**: Cinza suave (#E8E4DC — off-white)
- **Progresso**: Verde profundo (#344528) em conquista, verde claro (#879B55) em progresso
- **Brilho**: Sutil na cor correspondente (apenas no estado de conquista será destacado)

### Tipografia
- **Percentual**: `text-3xl font-bold` com cor dinâmica
- **Volume em litros**: `text-2xl font-semibold` (elegante e legível)
- **Micro-copy**: `text-sm font-medium` com transição suave entre cores

### Cores Dinâmicas por Estado
| Estado | Percentual | Cor | Frase |
|--------|-----------|-----|-------|
| **Início** | 0–39% | #C9963B (ouro) | "Comece com calma. Pequenos goles também constroem cuidado." |
| **Progresso** | 40–79% | #879B55 (sage) | "Seu corpo responde melhor quando a rotina apoia." |
| **Proximidade** | 80–99% | #879B55 (sage) | "Você está perto da meta. Consistência também se bebe." |
| **Conquista** | 100%+ | #344528 (verde) | "Meta concluída. Mais um cuidado silencioso por você." |

---

## 📡 Interface do Componente

### Props

```typescript
interface AnelHidratacaoProps {
  consumidoMl: number        // ml de água consumida hoje
  metaMl: number             // meta diária em ml
  onClickAdicionar: (valor: number) => void  // callback para adicionar/remover água
}
```

### Exemplo de Uso

```jsx
import AnelHidratacao from './AnelHidratacao.jsx'

function MinhaTelaDeHidratacao() {
  const [agua, setAgua] = useState(0)
  const metaAgua = 2500 // ml

  function adicionarAgua(ml) {
    setAgua(Math.max(0, agua + ml))
  }

  return (
    <AnelHidratacao
      consumidoMl={agua}
      metaMl={metaAgua}
      onClickAdicionar={adicionarAgua}
    />
  )
}
```

---

## 🔄 Como os Dados Fluem

### Integração em `Hoje.jsx`

1. **Dados do Contexto**:
   - `aguaMl` — quantidade de água consumida (em ml)
   - `metas.aguaMl` — meta diária (em ml, ex: 2500)
   - `adicionarAgua(quantidade)` — função para adicionar/remover

2. **Novo Componente**:
   ```jsx
   <AnelHidratacao 
     consumidoMl={aguaMl} 
     metaMl={metas.aguaMl} 
     onClickAdicionar={adicionarAgua} 
   />
   ```

3. **Cálculo Automático**:
   - Percentual: `(consumidoMl / metaMl) * 100`, capped em 100%
   - Preenchimento do SVG: proporção de `strokeDasharray`
   - Estado: determinado automaticamente por faixa de percentual

---

## ♿ Acessibilidade

### Implementações
- **`aria-label`** em botões (descreve ação)
- **`sr-only`** com `role="status"` e `aria-live="polite"` — leitores de tela anunciam progresso
- **Não depende apenas de cor** — percentual numérico sempre visível
- **Contraste**: Verde escuro (#344528) sobre branco → WCAG AA ✓

### Teste com Leitor de Tela
```
"Hidratação: 1500 ml de 2500 ml, 60% da meta. Seu corpo responde melhor quando a rotina apoia."
```

---

## 🎯 Micro-copy Educativa — Filosofia MWA

Cada estado do indicador reforça a mentalidade MWA através de frases que conectam ação com propósito:

- **Início (0–39%)**: Normaliza o começo ("Pequenos goles também constroem cuidado")
- **Progresso (40–79%)**: Reforça o impacto da rotina ("Seu corpo responde melhor...")
- **Proximidade (80–99%)**: Motiva a consistência ("Consistência também se bebe")
- **Conquista (100%+)**: Celebra silenciosamente ("Mais um cuidado silencioso por você")

Cada frase reforça que hidratação é um **pilar da Nutrição Inteligente**, não apenas um número.

---

## 🎬 Animações e Transições

### SVG Circle
- `transition-all duration-700 ease-out` — preenchimento do anel anima suavemente

### Cores
- `transition-colors duration-500` — micro-copy muda de cor suavemente ao passar entre estados

### Botões
- `active:scale-95` — feedback tátil ao tocar
- `hover:bg-sage/90` — hover suave no desktop

---

## 📱 Responsividade

### Layout Flexível
```jsx
<div className="flex flex-col items-center gap-6">
  {/* Anel */}
  {/* Volume */}
  {/* Micro-copy */}
  {/* Botões */}
</div>
```

- **Gap**: Espaçamento proporcional em `gap-6`
- **Tamanho do anel**: `h-56 w-56` (224px) — escalável via Tailwind
- **Botões**: `flex gap-3` com tamanho fixo (`h-10 w-10`, `px-4 py-2.5`)

Funciona bem em:
- ✅ Mobile (375px viewport)
- ✅ Tablet (768px viewport)
- ✅ Desktop (1280px viewport)

---

## 🧪 Como Testar no App

### Opção 1: Login com Dados de Teste
1. Acesse `http://localhost:5173`
2. Clique em **"Primeira vez aqui? Criar conta"**
3. Preencha:
   - Email: `teste@exemplo.com.br`
   - Senha: `Senha123`
4. Complete o onboarding (dados corporais, metas)
5. Clique na aba **"Hoje"**
6. Role para baixo até a seção **"Estratégia de Hidratação"**

### Opção 2: Acessar Diretamente (Modo Dev)
Se houver dados no `localStorage`:
```javascript
// Abra o Console (F12) e execute:
localStorage.setItem('mwa:usuario', JSON.stringify({
  nome: 'Teste',
  email: 'teste@test.com',
  // ... dados corporais
}))
window.location.reload()
```

### Opção 3: Usar Dados Mock (Recomendado para Dev)
Edite `src/context/AppContext.jsx` e adicione dados mock ao `useState(usuario)` para testes rápidos.

---

## 🎯 Estados Visuais Testáveis

### 1. Estado Inicial (0%)
```javascript
// Simular no console
const component = document.querySelector('[role="status"]')
// Esperado: Frase "Comece com calma..." + cor ouro
```

### 2. Estado Progresso (50%)
- Cor muda para sage (#879B55)
- Frase: "Seu corpo responde melhor..."
- Anel preenchido em 50%

### 3. Estado Proximidade (85%)
- Cor permanece sage
- Frase: "Você está perto da meta..."
- Anel preenchido em 85%

### 4. Estado Conquista (100%+)
- Cor muda para verde profundo (#344528)
- Frase em **dourado** (#d4af7a)
- Micro-copy: "Meta concluída. Mais um cuidado silencioso por você."

---

## 🔧 Integração no Layout

### Seção Adicionada em `Hoje.jsx`

```jsx
{/* Seção de Hidratação: Anel Premium */}
<section className="mt-6 rounded-2xl bg-white p-8 shadow-lg shadow-verde/10">
  <div className="mb-2 flex items-center gap-2">
    <GlassWater size={18} className="text-sage" />
    <h2 className="text-sm font-semibold text-verde/60">Estratégia de Hidratação</h2>
  </div>
  <p className="mb-6 text-xs text-verde/40">
    A hidratação estratégica sinaliza ao seu corpo que ele pode funcionar em plena capacidade
  </p>
  <AnelHidratacao consumidoMl={aguaMl} metaMl={metas.aguaMl} onClickAdicionar={adicionarAgua} />
</section>
```

**Mudanças em Hoje.jsx**:
- ✅ Removida linha "Água" do grid de metas (agora tem seção dedicada)
- ✅ Removida linha "Água" do resumo do dia (evita duplicação)
- ✅ Adicionada seção premium com o novo componente

---

## 📊 Cálculos Internos

### Percentual
```javascript
const pct = Math.min(Math.round((consumidoMl / metaMl) * 100), 100)
```
- Sempre entre 0–100%
- Arredondado para número inteiro

### Preenchimento SVG
```javascript
const raio = 50
const circ = 2 * Math.PI * raio  // 314.16...
const preenchido = (pct / 100) * circ
```
- Usa `strokeDasharray` para criar anel visual
- `strokeDasharray={preenchido} ${circ}`

---

## 🎨 Customização Futura

Se precisar ajustar:

### Cores
Editar em `AnelHidratacao.jsx`:
```javascript
estado = { 
  frase: '...', 
  tipo: 'progresso', 
  cor: '#879B55'  // ← Mudar aqui
}
```

### Tamanho
Editar `h-56 w-56` para `h-64 w-64` (maior) ou `h-48 w-48` (menor)

### Frases
Editar no switch/if statement de `estado`

### Velocidade de Animação
Trocar `duration-700` (anel) ou `duration-500` (cores)

---

## ✅ Checklist de Implementação

- ✅ Componente `AnelHidratacao.jsx` criado
- ✅ Integrado em `Hoje.jsx`
- ✅ Micro-copy educativa com 4 estados
- ✅ Visual premium minimalista
- ✅ Acessibilidade (`aria-label`, `sr-only`, `aria-live`)
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Animações suaves (SVG, cores)
- ✅ Botões de ação (+/− água)
- ✅ Sem quebra no layout existente
- ✅ Filosofia MWA reforçada

---

## 🚀 Próximos Passos (Opcional)

1. **Persistência**: Conectar a `adicionarAgua()` com backend
2. **Notificações**: Alerta quando atinge 100% (push notification)
3. **Histórico**: Gráfico de hidratação semanal abaixo do anel
4. **Brilho Dourado**: Ativar efeito de brilho completo em conquista (CSS `@keyframes`)
5. **Dark Mode**: Ajustar cores para modo escuro se aplicável

---

## 📞 Suporte

Qualquer dúvida sobre integração, estilos ou dados — revise os comentários no código do componente.

**Componente finalmente pronto para produção MWA! 🌿**
