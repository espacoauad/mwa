import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

/**
 * Componente para ativar manualmente o programa de 90 dias.
 * Útil para testes e ativação administrativa.
 */
export default function AtivarPrograma90d() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState(null)
  const [tipo, setTipo] = useState(null)

  async function handleAtivar() {
    if (!email.trim()) {
      setMensagem('Por favor, insira um email')
      setTipo('erro')
      return
    }

    setLoading(true)
    setMensagem(null)

    try {
      // 1. Buscar o usuário na tabela mwa_perfis
      const { data: perfis, error: erroPerfil } = await supabase
        .from('mwa_perfis')
        .select('id, nome, email')
        .eq('email', email.toLowerCase())

      if (erroPerfil) {
        throw new Error(`Erro ao buscar perfil: ${erroPerfil.message}`)
      }

      if (!perfis || perfis.length === 0) {
        setMensagem(`Usuário com email ${email} não encontrado`)
        setTipo('erro')
        setLoading(false)
        return
      }

      const usuario = perfis[0]

      // 2. Verificar se já tem 90d ativo
      const { data: programas, error: erroProgramas } = await supabase
        .from('mwa_programas')
        .select('*')
        .eq('user_id', usuario.id)
        .eq('tipo', '90d')
        .eq('status', 'ativo')

      if (erroProgramas) {
        throw new Error(`Erro ao verificar programas: ${erroProgramas.message}`)
      }

      if (programas && programas.length > 0) {
        setMensagem(`${usuario.nome} já tem um programa de 90 dias ativo!`)
        setTipo('aviso')
        setLoading(false)
        return
      }

      // 3. Inserir novo programa de 90 dias
      const hoje = new Date().toISOString().split('T')[0]

      const { data: novoPrograma, error: erroInsercao } = await supabase
        .from('mwa_programas')
        .insert([
          {
            user_id: usuario.id,
            tipo: '90d',
            status: 'ativo',
            data_inicio: hoje,
          },
        ])
        .select()

      if (erroInsercao) {
        throw new Error(`Erro ao ativar programa: ${erroInsercao.message}`)
      }

      setMensagem(`✅ Programa de 90 dias ativado com sucesso para ${usuario.nome}!`)
      setTipo('sucesso')
      setEmail('')
    } catch (erro) {
      setMensagem(`❌ Erro: ${erro.message}`)
      setTipo('erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Ativar Programa 90 Dias</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email do usuário</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleAtivar}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="animate-spin" size={20} /> : null}
          {loading ? 'Ativando...' : 'Ativar Programa'}
        </button>

        {mensagem && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              tipo === 'sucesso'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : tipo === 'aviso'
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {tipo === 'sucesso' ? (
              <CheckCircle size={20} className="shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{mensagem}</p>
          </div>
        )}
      </div>
    </div>
  )
}
