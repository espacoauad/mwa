import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Copy, Download, Printer, Check, Archive, ClipboardPaste } from 'lucide-react'
import { useContentItems } from '../hooks/useContentItems'
import { useBrandGuide } from '../hooks/useBrandGuide'
import { montarPrompt, INSTRUCOES_AJUSTE } from '../lib/promptBuilder'
import { detectarAvisoSaude, encontrarPalavrasProibidas } from '../lib/contentReview'
import { copiarTexto, baixarTxt, abrirJanelaImpressao } from '../lib/exportUtils'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'

const BOTOES_AJUSTE = [
  ['regenerar', 'Regenerar'],
  ['mais_curto', 'Mais curto'],
  ['mais_humano', 'Mais humano'],
  ['mais_educativo', 'Mais educativo'],
  ['mais_acolhedor', 'Mais acolhedor'],
  ['mais_elegante', 'Mais elegante'],
  ['simplificar', 'Simplificar'],
  ['corrigir_portugues', 'Corrigir português'],
]

export default function ContentEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { obter, atualizar, remover } = useContentItems()
  const { guia } = useBrandGuide()
  const item = obter(id)
  const [rascunhoColado, setRascunhoColado] = useState('')

  const avisoSaude = useMemo(() => item && detectarAvisoSaude(item.textoConteudo), [item])
  const palavrasProibidasEncontradas = useMemo(
    () => (item ? encontrarPalavrasProibidas(item.textoConteudo, guia.palavrasProibidas) : []),
    [item, guia],
  )

  if (!item) {
    return (
      <div className="p-6">
        <p>Conteúdo não encontrado.</p>
        <Button variant="secondary" onClick={() => navigate('/conteudos')}>Voltar</Button>
      </div>
    )
  }

  const promptExibido = item.promptGerado || montarPrompt({ brandGuide: guia, escolhas: item })

  function gerarNovoPrompt(chaveInstrucao) {
    const instrucaoExtra = INSTRUCOES_AJUSTE[chaveInstrucao]
    const prompt = montarPrompt({ brandGuide: guia, escolhas: item, instrucaoExtra })
    atualizar(item.id, {
      promptGerado: prompt,
      textoConteudo: '',
      historicoPrompts: [...item.historicoPrompts, { prompt, instrucaoExtra, criadoEm: new Date().toISOString() }],
    })
  }

  function salvarRespostaColada() {
    atualizar(item.id, { textoConteudo: rascunhoColado, status: item.status === 'ideia' ? 'rascunho' : item.status })
    setRascunhoColado('')
  }

  const precisaColarResposta = !item.textoConteudo

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>{item.tituloInterno}</h1>
        <StatusBadge status={item.status} />
      </div>

      {precisaColarResposta ? (
        <Card className="space-y-4">
          <p className="text-sm text-mist">1. Copie o prompt abaixo e cole no Claude.ai (ou outra IA). 2. Cole a resposta na caixa e clique em salvar.</p>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-forest-deep/5 p-4 text-xs">{promptExibido}</pre>
          <Button variant="secondary" onClick={() => copiarTexto(promptExibido)}><Copy size={16} /> Copiar prompt</Button>
          <textarea
            className="w-full rounded-xl border border-sand p-4 text-sm"
            rows={8}
            placeholder="Cole aqui a resposta gerada pela IA..."
            value={rascunhoColado}
            onChange={(e) => setRascunhoColado(e.target.value)}
          />
          <Button onClick={salvarRespostaColada} disabled={!rascunhoColado.trim()}><ClipboardPaste size={16} /> Salvar resposta</Button>
        </Card>
      ) : (
        <Card className="space-y-4">
          {avisoSaude && (
            <p className="rounded-xl bg-gold-soft/50 p-3 text-sm text-forest-deep">
              ⚠️ Este conteúdo contém informações relacionadas à saúde ou nutrição. Revise os dados antes da publicação.
            </p>
          )}
          {palavrasProibidasEncontradas.length > 0 && (
            <p className="rounded-xl bg-red-100 p-3 text-sm text-red-800">
              Palavras a revisar: {palavrasProibidasEncontradas.join(', ')}
            </p>
          )}
          <textarea
            className="w-full rounded-xl border border-sand p-4 text-sm"
            rows={10}
            value={item.textoConteudo}
            onChange={(e) => atualizar(item.id, { textoConteudo: e.target.value })}
          />

          <div className="flex flex-wrap gap-2">
            {BOTOES_AJUSTE.map(([chave, rotulo]) => (
              <Button key={chave} variant="secondary" onClick={() => gerarNovoPrompt(chave)}>{rotulo}</Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-sand pt-4">
            <Button variant="secondary" onClick={() => copiarTexto(item.textoConteudo)}><Copy size={16} /> Copiar</Button>
            <Button variant="secondary" onClick={() => baixarTxt(item.tituloInterno, item.textoConteudo)}><Download size={16} /> Exportar TXT</Button>
            <Button variant="secondary" onClick={() => abrirJanelaImpressao(item.tituloInterno, item.textoConteudo)}><Printer size={16} /> Exportar PDF / Imprimir</Button>
            <Button variant="secondary" onClick={() => atualizar(item.id, { status: 'rascunho' })}>Salvar como rascunho</Button>
            <Button onClick={() => atualizar(item.id, { status: 'aprovado' })}><Check size={16} /> Aprovar</Button>
            <Button variant="secondary" onClick={() => atualizar(item.id, { status: 'arquivado' })}><Archive size={16} /> Arquivar</Button>
            <Button variant="danger" onClick={() => { remover(item.id); navigate('/conteudos') }}>Excluir</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
