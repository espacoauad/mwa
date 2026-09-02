import { useState } from 'react'
import { Download, Printer, Save } from 'lucide-react'
import { useBrandGuide } from '../hooks/useBrandGuide'
import { baixarJson, abrirJanelaImpressao } from '../lib/exportUtils'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const CAMPO_BASE = 'w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm font-ui focus:border-forest focus:outline-none'
const LABEL_BASE = 'block text-sm font-medium text-forest-deep mb-1'

function listaParaTexto(lista) {
  return lista.join('\n')
}

function textoParaLista(texto) {
  return texto.split('\n').map((l) => l.trim()).filter(Boolean)
}

export default function GuiaDaMarca() {
  const { guia, salvar } = useBrandGuide()
  const [form, setForm] = useState(guia)

  function campo(chave, valor) {
    setForm((atual) => ({ ...atual, [chave]: valor }))
  }

  function salvarTudo() {
    salvar(form)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Guia da Marca</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => baixarJson('guia-da-marca-mwa', guia)}><Download size={16} /> Exportar</Button>
          <Button variant="secondary" onClick={() => abrirJanelaImpressao('Guia da Marca MWA', JSON.stringify(guia, null, 2))}><Printer size={16} /> Imprimir</Button>
        </div>
      </div>

      <Card className="space-y-4">
        <div>
          <label className={LABEL_BASE}>Nome</label>
          <input className={CAMPO_BASE} value={form.nome} onChange={(e) => campo('nome', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Nome completo</label>
          <input className={CAMPO_BASE} value={form.nomeCompleto} onChange={(e) => campo('nomeCompleto', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Assinatura</label>
          <input className={CAMPO_BASE} value={form.assinatura} onChange={(e) => campo('assinatura', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Slogan institucional</label>
          <input className={CAMPO_BASE} value={form.slogan} onChange={(e) => campo('slogan', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Posicionamento</label>
          <textarea className={CAMPO_BASE} rows={4} value={form.posicionamento} onChange={(e) => campo('posicionamento', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Público</label>
          <textarea className={CAMPO_BASE} rows={3} value={form.publico} onChange={(e) => campo('publico', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Tom de voz (um por linha)</label>
          <textarea className={CAMPO_BASE} rows={4} value={listaParaTexto(form.tomDeVoz)} onChange={(e) => campo('tomDeVoz', textoParaLista(e.target.value))} />
        </div>
        <div>
          <label className={LABEL_BASE}>Palavras recomendadas (uma por linha)</label>
          <textarea className={CAMPO_BASE} rows={3} value={listaParaTexto(form.palavrasRecomendadas)} onChange={(e) => campo('palavrasRecomendadas', textoParaLista(e.target.value))} />
        </div>
        <div>
          <label className={LABEL_BASE}>Palavras proibidas (uma por linha)</label>
          <textarea className={CAMPO_BASE} rows={4} value={listaParaTexto(form.palavrasProibidas)} onChange={(e) => campo('palavrasProibidas', textoParaLista(e.target.value))} />
        </div>
        <div>
          <label className={LABEL_BASE}>Regras de saúde</label>
          <textarea className={CAMPO_BASE} rows={3} value={form.regrasSaude} onChange={(e) => campo('regrasSaude', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Diretrizes visuais</label>
          <textarea className={CAMPO_BASE} rows={3} value={form.diretrizesVisuais} onChange={(e) => campo('diretrizesVisuais', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Exemplos aprovados (um por linha)</label>
          <textarea className={CAMPO_BASE} rows={4} value={listaParaTexto(form.exemplosAprovados)} onChange={(e) => campo('exemplosAprovados', textoParaLista(e.target.value))} />
        </div>

        <Button onClick={salvarTudo}><Save size={16} /> Salvar Guia da Marca</Button>
      </Card>
    </div>
  )
}
