import { useAdmin } from '../../context/AdminContext.jsx'
import { FileText, Download } from 'lucide-react'
import { useState } from 'react'

export default function Relatorios() {
  const { usuarios, pagamentos, sessoes, filtro } = useAdmin()
  const [exportando, setExportando] = useState(false)

  async function exportarCSV(dados, nome) {
    if (!dados || dados.length === 0) {
      alert('Sem dados para exportar')
      return
    }

    setExportando(true)

    const headers = Object.keys(dados[0])
    const csv = [
      headers.join(','),
      ...dados.map(row =>
        headers.map(header => {
          const valor = row[header]
          if (typeof valor === 'object') {
            return `"${JSON.stringify(valor).replace(/"/g, '""')}"`
          }
          return typeof valor === 'string' && valor.includes(',')
            ? `"${valor}"`
            : valor
        }).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${nome}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportando(false)
  }

  const relatorios = [
    {
      titulo: 'Clientes',
      descricao: 'Lista completa de clientes com dados pessoais',
      dados: usuarios,
      campos: ['id', 'nome', 'email', 'sexo', 'idade', 'peso', 'altura', 'data_inicio'],
      cor: 'bg-blue-50 border-blue-200',
    },
    {
      titulo: 'Pagamentos',
      descricao: 'Histórico de transações e movimentação',
      dados: pagamentos,
      campos: ['id', 'valor', 'status', 'programa_tipo', 'metodo', 'criado_em'],
      cor: 'bg-green-50 border-green-200',
    },
    {
      titulo: 'Sessões',
      descricao: 'Log de acessos e atividades de usuários',
      dados: sessoes,
      campos: ['id', 'user_id', 'tipo', 'criado_em'],
      cor: 'bg-purple-50 border-purple-200',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-verde">
          <FileText size={24} />
          Relatórios
        </h2>
        <p className="text-sm text-cinza/60">
          Período selecionado: <strong>{filtro}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatorios.map((rel, i) => (
          <div
            key={i}
            className={`flex flex-col justify-between rounded-lg border-2 p-6 ${rel.cor}`}
          >
            <div>
              <h3 className="mb-2 text-lg font-bold text-verde">{rel.titulo}</h3>
              <p className="mb-4 text-sm text-cinza/70">{rel.descricao}</p>
              <div className="mb-4 space-y-1">
                <p className="text-xs text-cinza/60">
                  <strong>Registros:</strong> {rel.dados.length}
                </p>
                <p className="text-xs text-cinza/60">
                  <strong>Colunas:</strong> {rel.campos.length}
                </p>
              </div>
            </div>

            <button
              onClick={() => exportarCSV(rel.dados.map(d => {
                const obj = {}
                rel.campos.forEach(campo => {
                  obj[campo] = d[campo]
                })
                return obj
              }), rel.titulo.toLowerCase())}
              disabled={exportando}
              className="flex items-center justify-center gap-2 rounded-lg bg-verde px-4 py-2 font-semibold text-white hover:bg-verde/90 disabled:opacity-50"
            >
              <Download size={18} />
              {exportando ? 'Exportando...' : 'Exportar CSV'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border-2 border-ouro bg-ouro-claro/20 p-6">
        <h3 className="mb-3 text-lg font-bold text-verde">📊 Resumo Executivo</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-cinza/70">Total de Clientes</p>
            <p className="text-2xl font-bold text-verde">{usuarios.length}</p>
          </div>
          <div>
            <p className="text-sm text-cinza/70">Total de Transações</p>
            <p className="text-2xl font-bold text-verde">{pagamentos.length}</p>
          </div>
          <div>
            <p className="text-sm text-cinza/70">Acessos Registrados</p>
            <p className="text-2xl font-bold text-verde">{sessoes.length}</p>
          </div>
          <div>
            <p className="text-sm text-cinza/70">Receita Aprovada</p>
            <p className="text-2xl font-bold text-ouro">
              R$ {pagamentos.filter(p => p.status === 'aprovado').reduce((s, p) => s + (p.valor ?? 0), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
