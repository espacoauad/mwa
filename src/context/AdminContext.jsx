import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [usuarios, setUsuarios] = useState([])
  const [pagamentos, setPagamentos] = useState([])
  const [sessoes, setSessoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('tudo') // 'hoje', '7d', 'mes', 'ano', 'tudo'

  const dataFiltro = () => {
    const hoje = new Date()
    const agora = hoje.toISOString()

    switch (filtro) {
      case 'hoje':
        return {
          de: new Date(hoje.setHours(0, 0, 0, 0)).toISOString(),
          ate: agora,
        }
      case '7d':
        return {
          de: new Date(hoje.setDate(hoje.getDate() - 7)).toISOString(),
          ate: agora,
        }
      case 'mes':
        return {
          de: new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString(),
          ate: agora,
        }
      case 'ano':
        return {
          de: new Date(hoje.getFullYear(), 0, 1).toISOString(),
          ate: agora,
        }
      default:
        return { de: null, ate: null }
    }
  }

  useEffect(() => {
    carregarDados()
  }, [filtro])

  async function carregarDados() {
    setCarregando(true)
    const { de, ate } = dataFiltro()

    const [usersRes, pagsRes, sessRes] = await Promise.all([
      supabase.from('mwa_perfis').select('id, nome, email, data_inicio, peso, altura, role').order('data_inicio', { ascending: false }),
      de ? supabase.from('mwa_pagamentos').select('*').gte('criado_em', de).lte('criado_em', ate).order('criado_em', { ascending: false })
        : supabase.from('mwa_pagamentos').select('*').order('criado_em', { ascending: false }),
      de ? supabase.from('mwa_sessoes').select('*').gte('criado_em', de).lte('criado_em', ate).order('criado_em', { ascending: false })
        : supabase.from('mwa_sessoes').select('*').order('criado_em', { ascending: false }),
    ])

    if (usersRes.data) setUsuarios(usersRes.data)
    if (pagsRes.data) setPagamentos(pagsRes.data)
    if (sessRes.data) setSessoes(sessRes.data)
    setCarregando(false)
  }

  const valor = {
    usuarios,
    pagamentos,
    sessoes,
    carregando,
    filtro,
    setFiltro,
    dataFiltro,
  }

  return <AdminContext.Provider value={valor}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin deve ser usado dentro de <AdminProvider>')
  return ctx
}
