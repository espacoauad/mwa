import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import versiculos from '../../data/versiculos.js'

/**
 * Componente: Versículo do Dia
 * Mostra um versículo bíblico diferente para cada um dos 111 dias
 * Temas: Saúde, corpo, mente, espírito, alimentação, consistência, cuidado, amor, contribuição
 */
export default function VersiculoDoDia() {
  const { diaAtual, totalDias } = useApp()
  const { ingles } = useIdioma()

  // Encontra o versículo do dia atual (garantir que dia 1 = índice 0)
  const versiculoHoje = versiculos.find(v => v.dia === diaAtual) || versiculos[0]

  // Calcula progresso
  const progresso = totalDias ? Math.round((diaAtual / totalDias) * 100) : 0

  return (
    <div className="space-y-4">
      {/* CABEÇALHO — fora do cartão escuro, por isso em tom verde (legível no fundo claro da tela) */}
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-verde mb-2">✨ {ingles ? 'Verse of the Day' : 'Versículo do Dia'}</p>
        <p className="text-xs text-verde/80">{ingles ? `Day ${diaAtual} of ${totalDias}` : `Dia ${diaAtual} de ${totalDias}`}</p>
      </div>

      {/* CARTÃO PRINCIPAL — fundo escuro sólido para garantir contraste com o texto claro */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #08402F 0%, #486E42 55%, #879B55 100%)' }}
      >
        {/* Border com brilho */}
        <div className="absolute inset-0 rounded-3xl border border-ouro/30" />

        {/* Decoração de canto */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-ouro/15 rounded-full blur-3xl" />

        {/* CONTEÚDO */}
        <div className="relative z-10 px-6 py-8 space-y-6">
          {/* TEXTO DO VERSÍCULO */}
          <div className="text-center space-y-4">
            <p className="text-sm text-ouro uppercase tracking-wider font-bold">
              {ingles ? versiculoHoje.temaEn : versiculoHoje.tema}
            </p>

            <p className="font-serif text-lg leading-relaxed text-white italic">
              "{ingles ? versiculoHoje.textoEn : versiculoHoje.texto}"
            </p>

            {/* REFERÊNCIA BÍBLICA */}
            <p className="text-base font-bold text-ouro">
              — {ingles ? versiculoHoje.referenciaEn : versiculoHoje.referencia}
            </p>
          </div>

          {/* LINHA DIVISÓRIA */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-ouro/40 to-transparent" />

          {/* REFLEXÃO DO DIA */}
          <div className="bg-black/15 backdrop-blur rounded-2xl p-4 border border-white/15">
            <p className="text-xs font-semibold uppercase tracking-wider text-ouro mb-2">💭 {ingles ? 'Reflection' : 'Reflexão'}</p>
            <p className="text-xs leading-relaxed text-white/95">
              {ingles ? versiculoHoje.reflexaoEn : versiculoHoje.reflexao}
            </p>
          </div>

          {/* PROGRESSO VISUAL */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-white/90">{ingles ? 'Your journey' : 'Sua jornada'}</p>
              <p className="text-xs font-bold text-ouro">{progresso}%</p>
            </div>
            <div
              className="w-full h-2 bg-black/20 rounded-full overflow-hidden border border-white/20"
              role="progressbar"
              aria-valuenow={progresso}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={ingles ? 'Your journey' : 'Sua jornada'}
            >
              <div
                className="h-full bg-gradient-to-r from-ouro to-sage transition-all duration-300"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA INSPIRADOR */}
      <div className="bg-gradient-to-r from-verde to-verde-escuro rounded-2xl p-4 text-center border border-sage/30">
        <p className="text-xs font-semibold text-white">
          {ingles
            ? '🙏 Start today by remembering: you are worthy of care, love and transformation.'
            : '🙏 Comece hoje lembrando: você é digno de cuidado, amor e transformação.'}
        </p>
      </div>
    </div>
  )
}
