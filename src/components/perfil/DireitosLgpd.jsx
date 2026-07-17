import { useState } from 'react'
import { ShieldCheck, Download, FileText, ScrollText, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import DocumentoLegal from '../legal/DocumentoLegal.jsx'
import { POLITICA_PRIVACIDADE, TERMOS_USO } from '../../data/legal.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function DireitosLgpd() {
  const { ingles } = useIdioma()
  const { exportarDados, deletarConta } = useApp()
  const [documento, setDocumento] = useState(null)
  const [exportando, setExportando] = useState(false)

  async function baixarDados() {
    setExportando(true)
    try {
      const dados = await exportarDados()
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mwa-meus-dados-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportando(false)
    }
  }

  function confirmarExclusao() {
    if (
      window.confirm(
        ingles
          ? 'This deletes ALL your program data, including your profile, meals, weigh-ins, and photos, and signs you out. This cannot be undone. Continue?'
          : 'Isso apaga TODOS os seus dados do programa (cadastro, refeições, pesagens e fotos) e encerra sua sessão. Essa ação não pode ser desfeita. Deseja continuar?',
      )
    ) {
      deletarConta()
    }
  }

  const item =
    'flex w-full items-center gap-3 py-3 text-left text-sm font-medium text-verde transition-colors hover:text-sage'

  return (
    <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-verde/60">
        <ShieldCheck size={15} className="text-sage" /> {ingles ? 'My LGPD rights' : 'Meus Direitos LGPD'}
      </h2>
      <div className="mt-1 divide-y divide-cinza">
        <button type="button" onClick={baixarDados} disabled={exportando} className={item}>
          <Download size={16} className="shrink-0 text-sage" />
          <span>
            {exportando ? (ingles ? 'Preparing your file…' : 'Preparando seu arquivo…') : (ingles ? 'Export my data' : 'Exportar meus dados')}
            <span className="block text-xs font-normal text-verde/50">
              {ingles ? 'Downloads a file containing everything recorded' : 'Baixa um arquivo com tudo que está registrado'}
            </span>
          </span>
        </button>
        <button type="button" onClick={() => setDocumento(POLITICA_PRIVACIDADE)} className={item}>
          <FileText size={16} className="shrink-0 text-sage" /> {ingles ? 'Privacy Policy' : 'Política de Privacidade'}
        </button>
        <button type="button" onClick={() => setDocumento(TERMOS_USO)} className={item}>
          <ScrollText size={16} className="shrink-0 text-sage" /> {ingles ? 'Terms of Use' : 'Termos de Uso'}
        </button>
        <button type="button" onClick={confirmarExclusao} className={`${item} text-red-700 hover:text-red-600`}>
          <Trash2 size={16} className="shrink-0" />
          <span>
            {ingles ? 'Delete my data' : 'Deletar meus dados'}
            <span className="block text-xs font-normal text-red-700/60">
              {ingles ? 'Removes your profile and every app record' : 'Remove cadastro e todos os registros do app'}
            </span>
          </span>
        </button>
      </div>

      {documento && <DocumentoLegal documento={documento} onFechar={() => setDocumento(null)} />}
    </div>
  )
}
