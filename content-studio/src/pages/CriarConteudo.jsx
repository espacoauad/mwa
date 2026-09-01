import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContentItems } from '../hooks/useContentItems'
import { useBrandGuide } from '../hooks/useBrandGuide'
import { montarPrompt } from '../lib/promptBuilder'
import { FINALIDADES, FORMATOS, TEMAS, PROFUNDIDADES, TONS, TAMANHOS } from '../data/options'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const CAMPO_BASE = 'w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm font-ui focus:border-forest focus:outline-none'
const LABEL_BASE = 'block text-sm font-medium text-forest-deep mb-1'

const ESTADO_INICIAL = {
  finalidade: FINALIDADES[0],
  formato: FORMATOS[0],
  tema: TEMAS[0],
  publico: '',
  diaPrograma: '',
  objetivo: '',
  profundidade: PROFUNDIDADES[0],
  tom: TONS[0],
  tamanho: TAMANHOS[0],
  camposObrigatorios: '',
  palavrasIncluir: '',
  palavrasEvitar: '',
  chamadaAcao: '',
  observacoes: '',
  produtoRelacionado: '',
}

export default function CriarConteudo() {
  const [passo, setPasso] = useState('formulario')
  const [dados, setDados] = useState(ESTADO_INICIAL)
  const { criar } = useContentItems()
  const { guia } = useBrandGuide()
  const navigate = useNavigate()

  function atualizarCampo(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
  }

  function confirmarECriar() {
    const escolhas = { ...dados, diaPrograma: dados.diaPrograma ? Number(dados.diaPrograma) : null }
    const promptGerado = montarPrompt({ brandGuide: guia, escolhas })
    const novo = criar({ ...escolhas, tituloInterno: `${dados.formato} · ${dados.tema}`, promptGerado })
    navigate(`/conteudos/${novo.id}`)
  }

  if (passo === 'resumo') {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Confira antes de gerar</h1>
        <Card className="space-y-2 text-sm">
          <p><strong>Finalidade:</strong> {dados.finalidade}</p>
          <p><strong>Formato:</strong> {dados.formato}</p>
          <p><strong>Tema:</strong> {dados.tema}</p>
          <p><strong>Público:</strong> {dados.publico || '—'}</p>
          <p><strong>Dia do programa:</strong> {dados.diaPrograma || '—'}</p>
          <p><strong>Objetivo:</strong> {dados.objetivo || '—'}</p>
          <p><strong>Profundidade:</strong> {dados.profundidade}</p>
          <p><strong>Tom:</strong> {dados.tom}</p>
          <p><strong>Tamanho:</strong> {dados.tamanho}</p>
          <p><strong>Chamada para ação:</strong> {dados.chamadaAcao || '—'}</p>
        </Card>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setPasso('formulario')}>Editar</Button>
          <Button onClick={confirmarECriar}>Gerar prompt</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Criar Conteúdo</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_BASE}>Finalidade</label>
          <select className={CAMPO_BASE} value={dados.finalidade} onChange={(e) => atualizarCampo('finalidade', e.target.value)}>
            {FINALIDADES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Formato</label>
          <select className={CAMPO_BASE} value={dados.formato} onChange={(e) => atualizarCampo('formato', e.target.value)}>
            {FORMATOS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Tema</label>
          <select className={CAMPO_BASE} value={dados.tema} onChange={(e) => atualizarCampo('tema', e.target.value)}>
            {TEMAS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Público</label>
          <input className={CAMPO_BASE} value={dados.publico} onChange={(e) => atualizarCampo('publico', e.target.value)} placeholder="Ex.: participantes dos 90 dias" />
        </div>
        <div>
          <label className={LABEL_BASE}>Dia do programa (1–90, opcional)</label>
          <input type="number" min="1" max="90" className={CAMPO_BASE} value={dados.diaPrograma} onChange={(e) => atualizarCampo('diaPrograma', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Objetivo do conteúdo</label>
          <input className={CAMPO_BASE} value={dados.objetivo} onChange={(e) => atualizarCampo('objetivo', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Profundidade</label>
          <select className={CAMPO_BASE} value={dados.profundidade} onChange={(e) => atualizarCampo('profundidade', e.target.value)}>
            {PROFUNDIDADES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Tom</label>
          <select className={CAMPO_BASE} value={dados.tom} onChange={(e) => atualizarCampo('tom', e.target.value)}>
            {TONS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Tamanho</label>
          <select className={CAMPO_BASE} value={dados.tamanho} onChange={(e) => atualizarCampo('tamanho', e.target.value)}>
            {TAMANHOS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Produto/recurso do MWA relacionado</label>
          <input className={CAMPO_BASE} value={dados.produtoRelacionado} onChange={(e) => atualizarCampo('produtoRelacionado', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={LABEL_BASE}>Informações obrigatórias</label>
        <textarea className={CAMPO_BASE} rows={2} value={dados.camposObrigatorios} onChange={(e) => atualizarCampo('camposObrigatorios', e.target.value)} />
      </div>
      <div>
        <label className={LABEL_BASE}>Palavras ou ideias que devem aparecer</label>
        <textarea className={CAMPO_BASE} rows={2} value={dados.palavrasIncluir} onChange={(e) => atualizarCampo('palavrasIncluir', e.target.value)} />
      </div>
      <div>
        <label className={LABEL_BASE}>Palavras que devem ser evitadas</label>
        <textarea className={CAMPO_BASE} rows={2} value={dados.palavrasEvitar} onChange={(e) => atualizarCampo('palavrasEvitar', e.target.value)} />
      </div>
      <div>
        <label className={LABEL_BASE}>Chamada para ação</label>
        <input className={CAMPO_BASE} value={dados.chamadaAcao} onChange={(e) => atualizarCampo('chamadaAcao', e.target.value)} />
      </div>
      <div>
        <label className={LABEL_BASE}>Observações pessoais</label>
        <textarea className={CAMPO_BASE} rows={3} value={dados.observacoes} onChange={(e) => atualizarCampo('observacoes', e.target.value)} />
      </div>

      <Button onClick={() => setPasso('resumo')}>Ver resumo</Button>
    </div>
  )
}
