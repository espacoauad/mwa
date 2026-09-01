import { Link } from 'react-router-dom'
import { useTemplates } from '../hooks/useTemplates'
import { Card } from '../components/ui/Card'

export default function ModelosProntos() {
  const { templates } = useTemplates()
  const categorias = [...new Set(templates.map((t) => t.categoria))]

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Modelos Prontos</h1>
      {categorias.map((categoria) => (
        <div key={categoria} className="space-y-3">
          <h2 className="font-semibold text-forest-deep">{categoria}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.filter((t) => t.categoria === categoria).map((t) => (
              <Link key={t.id} to={`/modelos/${t.id}`}>
                <Card className="h-full hover:border-forest/40">
                  <p className="font-medium text-forest-deep">{t.nome}</p>
                  <p className="mt-1 text-xs text-mist">{t.formato}</p>
                  <p className="mt-3 line-clamp-3 text-sm text-forest-deep/80">{t.conteudoModelo}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
