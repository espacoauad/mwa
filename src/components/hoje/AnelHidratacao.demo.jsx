import { useState } from 'react'
import AnelHidratacao from './AnelHidratacao.jsx'

/**
 * Componente de Demonstração: AnelHidratacao
 * Use este arquivo para testar o componente em isolamento
 *
 * Para testar:
 * 1. Importe este demo em uma rota dev
 * 2. Ou crie um route específico como `/demo/hidratacao`
 *
 * Estados testáveis:
 * - 0% (inicial)
 * - 50% (progresso)
 * - 85% (proximidade)
 * - 100% (conquista)
 */

export default function AnelHidratacaoDemo() {
  const [consumidoMl, setConsumidoMl] = useState(1250)
  const metaMl = 2500
  const pct = Math.round((consumidoMl / metaMl) * 100)

  function adicionarAgua(ml) {
    setConsumidoMl((prev) => Math.max(0, prev + ml))
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-creme px-5 py-10">
      <div>
        <h1 className="mb-2 text-center font-serif text-2xl font-semibold italic text-verde">
          Demo: Anel de Hidratação
        </h1>
        <p className="mb-8 text-center text-sm text-verde/60">
          Use os controles abaixo para testar diferentes estados
        </p>
      </div>

      {/* Componente em teste */}
      <section className="mb-8 rounded-2xl bg-white p-8 shadow-lg shadow-verde/10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">💧</span>
          <h2 className="text-sm font-semibold text-verde/60">Estratégia de Hidratação</h2>
        </div>
        <p className="mb-6 text-xs text-verde/40">
          A hidratação estratégica sinaliza ao seu corpo que ele pode funcionar em plena capacidade
        </p>
        <AnelHidratacao
          consumidoMl={consumidoMl}
          metaMl={metaMl}
          onClickAdicionar={adicionarAgua}
        />
      </section>

      {/* Controles de debug */}
      <section className="rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h3 className="mb-4 text-sm font-semibold text-verde/60">Controles de Teste</h3>

        {/* Barra de progresso manual */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-verde/70">
            Progresso: {pct}%
          </label>
          <input
            type="range"
            min="0"
            max={metaMl}
            value={consumidoMl}
            onChange={(e) => setConsumidoMl(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Displays de estado */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-sage-claro p-2 text-verde">
            <span className="block font-semibold">{consumidoMl} ml</span>
            <span className="opacity-70">Consumido</span>
          </div>
          <div className="rounded bg-ouro-claro p-2 text-verde">
            <span className="block font-semibold">{metaMl} ml</span>
            <span className="opacity-70">Meta</span>
          </div>
        </div>

        {/* Botões preset */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-verde/60">Presets de Teste:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setConsumidoMl(0)}
              className="flex-1 rounded bg-verde/20 px-3 py-2 text-xs font-medium text-verde hover:bg-verde/30"
            >
              0% (Início)
            </button>
            <button
              type="button"
              onClick={() => setConsumidoMl(1000)}
              className="flex-1 rounded bg-ouro/20 px-3 py-2 text-xs font-medium text-verde hover:bg-ouro/30"
            >
              40% (Prog)
            </button>
            <button
              type="button"
              onClick={() => setConsumidoMl(2100)}
              className="flex-1 rounded bg-sage/20 px-3 py-2 text-xs font-medium text-verde hover:bg-sage/30"
            >
              85% (Prox)
            </button>
            <button
              type="button"
              onClick={() => setConsumidoMl(2500)}
              className="flex-1 rounded bg-verde/20 px-3 py-2 text-xs font-medium text-verde hover:bg-verde/30"
            >
              100% (Meta)
            </button>
          </div>
        </div>

        {/* Info de estado */}
        <div className="mt-4 rounded border border-verde/20 bg-verde/5 p-3 text-xs">
          <p className="mb-1 font-semibold text-verde">Estado Atual:</p>
          {pct < 40 && (
            <p className="text-verde/70">
              🟠 <strong>Início</strong> — "Comece com calma. Pequenos goles também constroem
              cuidado."
            </p>
          )}
          {pct >= 40 && pct < 80 && (
            <p className="text-verde/70">
              🟢 <strong>Progresso</strong> — "Seu corpo responde melhor quando a rotina apoia."
            </p>
          )}
          {pct >= 80 && pct < 100 && (
            <p className="text-verde/70">
              🟢 <strong>Proximidade</strong> — "Você está perto da meta. Consistência também se
              bebe."
            </p>
          )}
          {pct >= 100 && (
            <p className="text-ouro">
              ✨ <strong>Conquista</strong> — "Meta concluída. Mais um cuidado silencioso por você."
            </p>
          )}
        </div>
      </section>

      {/* Nota de uso */}
      <p className="mt-8 text-center text-xs text-verde/50">
        Este é um componente de demonstração. <br />
        Remova este arquivo antes de mergear para produção.
      </p>
    </div>
  )
}
