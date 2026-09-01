import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import EmBreve from './pages/EmBreve'
import Painel from './pages/Painel'
import TodosConteudos from './pages/TodosConteudos'
import CriarConteudo from './pages/CriarConteudo'
import ContentEditor from './pages/ContentEditor'
import ModelosProntos from './pages/ModelosProntos'
import ModeloDetalhe from './pages/ModeloDetalhe'
import GuiaDaMarca from './pages/GuiaDaMarca'
import Configuracoes from './pages/Configuracoes'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Painel /> },
      { path: '/conteudos', element: <TodosConteudos /> },
      { path: '/conteudos/:id', element: <ContentEditor /> },
      { path: '/criar', element: <CriarConteudo /> },
      { path: '/modelos', element: <ModelosProntos /> },
      { path: '/modelos/:id', element: <ModeloDetalhe /> },
      { path: '/marca', element: <GuiaDaMarca /> },
      { path: '/configuracoes', element: <Configuracoes /> },
      { path: '/planejador', element: <EmBreve titulo="Planejador dos 90 Dias" fase="Fase 2" /> },
      { path: '/calendario', element: <EmBreve titulo="Calendário Editorial" fase="Fase 2" /> },
      { path: '/ideias', element: <EmBreve titulo="Banco de Ideias" fase="Fase 3" /> },
      { path: '/biblioteca', element: <EmBreve titulo="Biblioteca de Conteúdos" fase="Fase 3" /> },
      { path: '/campanhas', element: <EmBreve titulo="Assistente de Campanhas" fase="Fase 4" /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
