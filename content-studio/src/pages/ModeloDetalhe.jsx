import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTemplates } from '../hooks/useTemplates'
import { useContentItems } from '../hooks/useContentItems'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

export default function ModeloDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { obter, atualizar, remover, duplicar } = useTemplates()
  const { criar } = useContentItems()
  const template = obter(id)
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(template?.conteudoModelo || '')
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  if (!template) return <div className="p-6">Modelo não encontrado.</div>

  function usarModelo() {
    const novo = criar({
      finalidade: 'Conteúdo interno do MWA',
      formato: template.formato,
      tema: template.categoria,
      profundidade: 'Intermediário',
      tom: 'Acolhedor',
      tamanho: 'Médio',
      textoConteudo: template.conteudoModelo,
      status: 'rascunho',
      tituloInterno: `${template.nome} (a partir de modelo)`,
    })
    navigate(`/conteudos/${novo.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>{template.nome}</h1>
      <Card className="space-y-4">
        {editando ? (
          <textarea className="w-full rounded-xl border border-sand p-4 text-sm" rows={8} value={texto} onChange={(e) => setTexto(e.target.value)} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-forest-deep">{template.conteudoModelo}</pre>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={usarModelo}>Usar este modelo</Button>
          {editando ? (
            <Button variant="secondary" onClick={() => { atualizar(template.id, { conteudoModelo: texto }); setEditando(false) }}>Salvar edição</Button>
          ) : (
            <Button variant="secondary" onClick={() => setEditando(true)}>Editar</Button>
          )}
          <Button variant="secondary" onClick={() => duplicar(template.id)}>Duplicar</Button>
          <Button variant="danger" onClick={() => setConfirmandoExclusao(true)}>Excluir</Button>
        </div>
      </Card>
      <ConfirmDialog
        open={confirmandoExclusao}
        title="Excluir este modelo?"
        description="Essa ação não pode ser desfeita."
        onCancel={() => setConfirmandoExclusao(false)}
        onConfirm={() => { remover(template.id); navigate('/modelos') }}
      />
    </div>
  )
}
