import { useState } from 'react'
import { AdminProvider } from '../../context/AdminContext.jsx'
import LayoutAdmin from './LayoutAdmin.jsx'
import Dashboard from './Dashboard.jsx'
import Clientes from './Clientes.jsx'
import Sessoes from './Sessoes.jsx'
import Pagamentos from './Pagamentos.jsx'
import Relatorios from './Relatorios.jsx'

function AdminAppInner() {
  const [aba, setAba] = useState('dashboard')

  const telas = {
    dashboard: <Dashboard />,
    clientes: <Clientes />,
    sessoes: <Sessoes />,
    pagamentos: <Pagamentos />,
    relatorios: <Relatorios />,
  }

  return (
    <LayoutAdmin aba={aba} onMudar={setAba}>
      {telas[aba]}
    </LayoutAdmin>
  )
}

export default function AdminApp() {
  return (
    <AdminProvider>
      <AdminAppInner />
    </AdminProvider>
  )
}
