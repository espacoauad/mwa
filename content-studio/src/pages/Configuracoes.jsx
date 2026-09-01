import { useRef, useState } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import { exportarBackup, restaurarBackup } from '../lib/backup'
import { baixarJson } from '../lib/exportUtils'
import { useContentItems } from '../hooks/useContentItems'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

export default function Configuracoes() {
  const { apagarDemo } = useContentItems()
  const [confirmandoApagarDemo, setConfirmandoApagarDemo] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const inputArquivoRef = useRef(null)

  function baixarBackup() {
    baixarJson(`mwa-content-studio-backup-${new Date().toISOString().slice(0, 10)}`, exportarBackup())
  }

  async function restaurarArquivo(evento) {
    const arquivo = evento.target.files?.[0]
    if (!arquivo) return
    try {
      const texto = await arquivo.text()
      restaurarBackup(JSON.parse(texto))
      setMensagem('Backup restaurado. Recarregando...')
      setTimeout(() => window.location.reload(), 1200)
    } catch {
      setMensagem('Não foi possível ler esse arquivo de backup.')
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Configurações</h1>

      <Card className="space-y-3">
        <h2 className="font-semibold text-forest-deep">Backup</h2>
        <p className="text-sm text-mist">Seus dados ficam salvos apenas neste navegador. Baixe um backup de tempos em tempos para não perder nada.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={baixarBackup}><Download size={16} /> Baixar backup</Button>
          <Button variant="secondary" onClick={() => inputArquivoRef.current?.click()}><Upload size={16} /> Restaurar backup</Button>
          <input ref={inputArquivoRef} type="file" accept="application/json" className="hidden" onChange={restaurarArquivo} />
        </div>
        {mensagem && <p className="text-sm text-forest">{mensagem}</p>}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-forest-deep">Dados de demonstração</h2>
        <p className="text-sm text-mist">Remove apenas os conteúdos de exemplo marcados como demonstração — seus conteúdos reais não são afetados.</p>
        <Button variant="danger" onClick={() => setConfirmandoApagarDemo(true)}><Trash2 size={16} /> Apagar dados de demonstração</Button>
      </Card>

      <ConfirmDialog
        open={confirmandoApagarDemo}
        title="Apagar dados de demonstração?"
        description="Os conteúdos de exemplo serão removidos. Seus conteúdos reais permanecem."
        onCancel={() => setConfirmandoApagarDemo(false)}
        onConfirm={() => { apagarDemo(); setConfirmandoApagarDemo(false) }}
      />
    </div>
  )
}
