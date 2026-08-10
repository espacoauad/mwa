import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { calcularMetas, dataHojeISO, diaDoPrograma, totalDiasPrograma, programa90Ativo as calcularPrograma90Ativo } from '../utils/calculos.js'
import { montarPersonalizacaoParaSalvar } from '../utils/personalizacao.js'
import { registrarSessao } from '../lib/sessoes.js'
import { calcularEstrelas } from '../utils/hallDaFama.js'
import { useIdioma } from './IdiomaContext.jsx'
import {
  carregarGame,
  concederSementes,
  comprarSkinDb,
  equiparSkinDb,
  registrarAcessoDiario,
  carregarTarefasHoje,
  carregarEstrelas,
  avaliarModoRecomecar,
  resolverModoRecomecar,
} from '../lib/game.js'
import {
  diasDaSemana,
  estrelasDaSemana,
  constelacaoCompleta,
  ganhouEstrelaHoje,
  metasCumpridas,
} from '../utils/jogos/estrelas.js'
import { lembrarEstrelaDoDia } from '../utils/notificacaoEstrela.js'
import { itemDoBanco, itemParaBanco, refeicaoDoBanco, totaisDaRefeicao } from '../utils/refeicoes.js'
import { uploadFotoRefeicao, removerFotoRefeicao, limparFotosRefeicoesDoUsuario } from '../lib/storage.js'
import { horarioAgora } from '../utils/calculos.js'

const AppContext = createContext(null)

// ── Mapeamento entre as linhas do banco (snake_case) e o formato do app ──

function perfilParaUsuario(p) {
  return {
    nome: p.nome,
    email: p.email,
    whatsapp: p.whatsapp,
    sexo: p.sexo,
    idade: p.idade,
    peso: Number(p.peso),
    altura: Number(p.altura),
    nivelAtividade: p.nivel_atividade,
    objetivo: p.objetivo,
    medidas: p.medidas ?? {},
    consentimentoLgpd: p.consentimento_lgpd,
    cienteAvisoCrn: p.ciente_aviso_crn,
    consentimentoRegistradoEm: p.consentimento_registrado_em,
    dataInicio: p.data_inicio,
    role: p.role ?? 'user',
    fotoUrl: p.foto_url ?? null,
    idioma: p.idioma ?? 'pt-BR',
  }
}

function programaDoBanco(p) {
  return {
    id: p.id,
    tipo: p.tipo,
    dataInicio: p.data_inicio,
    dataFim: p.data_fim,
    status: p.status,
    origem: p.origem,
  }
}

function exercicioDoBanco(e) {
  return {
    id: e.id,
    data: e.data,
    tipo: e.tipo,
    emoji: e.emoji,
    intensidade: e.intensidade,
    duracaoMin: e.duracao_min,
    gastoCalorico: Number(e.gasto_calorico),
  }
}

function pesagemDoBanco(p) {
  return {
    id: p.id,
    data: p.data,
    semana: p.semana,
    peso: Number(p.peso),
    medidas: p.medidas ?? {},
    fotos: p.fotos ?? {},
    bioimpedancia: p.bioimpedancia ?? null,
  }
}

export function AppProvider({ children }) {
  const { idioma, ingles, alterarIdioma } = useIdioma()
  const [sessao, setSessao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [programas, setProgramas] = useState([])
  const [refeicoes, setRefeicoes] = useState([])
  const [exercicios, setExercicios] = useState([])
  const [pesagens, setPesagens] = useState([])
  const [aguaMl, setAguaMl] = useState(0)
  const [modalRefeicao, setModalRefeicao] = useState({ etapa: null, refeicaoId: null, itemInicial: null })
  // Modo demonstração: permite pré-visualizar qualquer dia do programa (ofertas, informativos)
  const [simuladorDia, setSimuladorDia] = useState(null)
  // Gamificação: sementes, avatar equipado e skins compradas
  const [game, setGame] = useState(null)
  // Aviso "+N 🌱" exibido brevemente quando uma tarefa é recompensada
  const [ganhoSementes, setGanhoSementes] = useState(null)
  // Tarefas centrais do dia (refeição, água, dica, exercício) e sementes ganhas hoje
  const [tarefasHoje, setTarefasHoje] = useState({ refeicao: false, agua: false, dica: false, exercicio: false, jogo: false, sementesHoje: 0 })
  // Estrelas do Dia: dias da semana em que a estrela foi conquistada
  const [estrelasSemana, setEstrelasSemana] = useState([])
  // Tela de "dia concluído" (compartilhável)
  const [conclusaoDiaAberta, setConclusaoDiaAberta] = useState(false)
  // Tela comemorativa do primeiro marco da Jornada de 90 dias
  const [conclusao30Aberta, setConclusao30Aberta] = useState(false)
  // Tela de encerramento do programa (dia 90) — celebração final com conquistas e déficit total
  const [conclusao90Aberta, setConclusao90Aberta] = useState(false)
  // Modo Recomeçar: acolhimento ao voltar após dias sem abrir o app
  const [modoRecomecarAberto, setModoRecomecarAberto] = useState(false)

  const hoje = dataHojeISO()
  const userId = sessao?.user?.id ?? null
  const metas = useMemo(() => (usuario ? calcularMetas(usuario) : null), [usuario])
  const diaAtual = usuario ? (simuladorDia ?? diaDoPrograma(programas, usuario.dataInicio)) : 1
  const totalDias = totalDiasPrograma(programas)
  const programa90Ativo = calcularPrograma90Ativo(programas) !== null

  // Monitora Modo de Revisão no sessionStorage e sincroniza simuladorDia
  useEffect(() => {
    const monitorarModoRevisao = () => {
      const modoRevisao = sessionStorage.getItem('mwaModorevisao')
      if (modoRevisao) {
        try {
          const { ativo, diaVisualizacao } = JSON.parse(modoRevisao)
          if (ativo && diaVisualizacao) {
            setSimuladorDia(diaVisualizacao)
          }
        } catch (e) {
          // Ignora erro de parsing
        }
      }
    }

    // Verifica imediatamente
    monitorarModoRevisao()

    // Monitora mudanças via storage event
    window.addEventListener('storage', monitorarModoRevisao)

    // Cria um intervalo para verificar periodicamente (fallback)
    const intervalo = setInterval(monitorarModoRevisao, 100)

    return () => {
      window.removeEventListener('storage', monitorarModoRevisao)
      clearInterval(intervalo)
    }
  }, [])

  // Sessão do Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session)
      if (!data.session) setCarregando(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evento, novaSessao) => {
      setSessao(novaSessao)
      if (novaSessao && _evento === 'SIGNED_IN') {
        await registrarSessao(novaSessao.user.id, 'login', { email: novaSessao.user.email })
      }
      if (!novaSessao && _evento === 'SIGNED_OUT') {
        const userId = sub.subscription.user?.id
        if (userId) {
          await registrarSessao(userId, 'logout')
        }
      }
      if (!novaSessao) {
        setUsuario(null)
        setProgramas([])
        setRefeicoes([])
        setExercicios([])
        setPesagens([])
        setAguaMl(0)
        setCarregando(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Carrega perfil e dados quando a sessão muda
  useEffect(() => {
    if (!userId) return
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      const [perfil, progs, refs, exs, pesos, agua] = await Promise.all([
        supabase.from('mwa_perfis').select('*').eq('id', userId).maybeSingle(),
        supabase.from('mwa_programas').select('*').eq('user_id', userId),
        supabase.from('mwa_refeicoes').select('*, mwa_refeicoes_itens(*)').eq('user_id', userId).eq('data', hoje),
        supabase.from('mwa_exercicios').select('*').eq('user_id', userId).eq('data', hoje),
        supabase.from('mwa_pesagens').select('*').eq('user_id', userId).order('data'),
        supabase.from('mwa_agua').select('ml').eq('user_id', userId).eq('data', hoje).maybeSingle(),
      ])
      if (cancelado) return
      setUsuario(perfil.data ? perfilParaUsuario(perfil.data) : null)
      setProgramas((progs.data ?? []).map(programaDoBanco))
      setRefeicoes((refs.data ?? []).map((r) => refeicaoDoBanco(r, r.mwa_refeicoes_itens)))
      setExercicios((exs.data ?? []).map(exercicioDoBanco))
      setPesagens((pesos.data ?? []).map(pesagemDoBanco))
      setAguaMl(agua.data?.ml ?? 0)
      setCarregando(false)
      // Gamificação carrega depois, sem segurar a tela
      carregarGame(userId).then(async (g) => {
        if (cancelado || !g) return
        // Modo Recomeçar: precisa avaliar o gap ANTES de registrarAcessoDiario,
        // porque essa função sobrescreve ultimo_dia_acesso para hoje.
        const gAvaliado = await avaliarModoRecomecar(userId, g, hoje)
        if (cancelado) return
        // Acelerador de sementes: bônus por acessar em dias seguidos, sem falhar
        const { game: gAtualizado, bonus } = await registrarAcessoDiario(userId, gAvaliado, hoje)
        if (cancelado) return
        setGame(gAtualizado)
        if (bonus > 0) {
          setGanhoSementes({ qtd: bonus, tipo: 'streak' })
          setTimeout(() => setGanhoSementes(null), 3000)
        }
        const tarefas = await carregarTarefasHoje(userId, hoje)
        if (!cancelado) setTarefasHoje(tarefas)
        const eventosEstrela = await carregarEstrelas(userId, diasDaSemana(hoje))
        if (!cancelado) setEstrelasSemana(eventosEstrela)
      })
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [userId, hoje])

  // Ao voltar do checkout da Hotmart, atualiza o ciclo sem exigir que a cliente
  // feche e abra o aplicativo. O webhook continua sendo a única fonte de
  // liberação; o navegador apenas relê o estado já confirmado no servidor.
  useEffect(() => {
    if (!userId) return
    let cancelado = false
    async function atualizarProgramas() {
      const { data } = await supabase
        .from('mwa_programas')
        .select('*')
        .eq('user_id', userId)
      if (!cancelado && data) setProgramas(data.map(programaDoBanco))
    }
    function aoRetomar() {
      if (document.visibilityState === 'visible') atualizarProgramas()
    }
    window.addEventListener('focus', atualizarProgramas)
    document.addEventListener('visibilitychange', aoRetomar)
    return () => {
      cancelado = true
      window.removeEventListener('focus', atualizarProgramas)
      document.removeEventListener('visibilitychange', aoRetomar)
    }
  }, [userId])

  // ── Estrelas do Dia ──
  const metasEstrela = useMemo(
    () => metasCumpridas(tarefasHoje, { jogouHoje: tarefasHoje.jogo }),
    [tarefasHoje],
  )
  const semanaEstrelas = useMemo(() => estrelasDaSemana(hoje, estrelasSemana), [hoje, estrelasSemana])
  const estrelaHojeAcesa = semanaEstrelas.find((d) => d.hoje)?.acesa ?? false

  // Acende a estrela assim que as 2 micro-metas são cumpridas (1x por dia, dedup no banco)
  useEffect(() => {
    if (!userId || estrelaHojeAcesa || !ganhouEstrelaHoje(metasEstrela)) return
    let cancelado = false
    async function acender() {
      const ganho = await concederSementes(userId, 'estrela_dia', hoje)
      if (cancelado || ganho === 0) return
      setGame((g) => (g ? { ...g, sementes: g.sementes + ganho } : g))
      setGanhoSementes({ qtd: ganho, tipo: 'estrela_dia' })
      setTimeout(() => setGanhoSementes(null), 3000)
      const atualizadas = [...estrelasSemana, { ref: hoje }]
      setEstrelasSemana(atualizadas)
      // Sétima estrela da semana: a constelação fecha e vale um bônus
      if (constelacaoCompleta(estrelasDaSemana(hoje, atualizadas))) {
        const bonus = await concederSementes(userId, 'constelacao', diasDaSemana(hoje)[0])
        if (!cancelado && bonus > 0) {
          setGame((g) => (g ? { ...g, sementes: g.sementes + bonus } : g))
          setGanhoSementes({ qtd: bonus, tipo: 'constelacao' })
          setTimeout(() => setGanhoSementes(null), 3000)
        }
      }
    }
    acender()
    return () => {
      cancelado = true
    }
  }, [userId, hoje, metasEstrela, estrelaHojeAcesa])

  // Modo Recomeçar: abre sempre que o banco marcar o flag como pendente
  useEffect(() => {
    if (game?.recomecar_pendente) setModoRecomecarAberto(true)
  }, [game?.recomecar_pendente])

  // Lembrete local da estrela (só se a pessoa já autorizou notificações)
  useEffect(() => {
    if (!userId || !semanaEstrelas.length) return
    lembrarEstrelaDoDia({ userId, hoje, estrelaAcesa: estrelaHojeAcesa, metas: metasEstrela, ingles })
  }, [userId, hoje, estrelaHojeAcesa, metasEstrela, semanaEstrelas.length, ingles])

  const diaCompleto = tarefasHoje.refeicao && tarefasHoje.agua && tarefasHoje.dica

  // Ao completar as tarefas centrais do dia, abre a tela de celebração — só 1x por dia
  useEffect(() => {
    if (!diaCompleto || !userId) return
    const chave = `mwa_dia_concluido_${userId}_${hoje}`
    if (localStorage.getItem(chave)) return
    localStorage.setItem(chave, '1')
    setConclusaoDiaAberta(true)
  }, [diaCompleto, userId, hoje])

  // Ao chegar no dia 30, celebra o primeiro marco da Jornada de 90 Dias.
  useEffect(() => {
    if (diaAtual !== 30 || !userId) return
    const cicloId = calcularPrograma90Ativo(programas)?.id ?? 'inicial'
    const chave = `mwa_30_concluido_${userId}_${cicloId}`
    if (localStorage.getItem(chave)) return
    localStorage.setItem(chave, '1')
    setConclusao30Aberta(true)
  }, [diaAtual, programas, userId])

  // Ao chegar no dia 90 (fim do programa de 90 dias pago), abre a tela de
  // encerramento com estrelas, conquistas interativas e o total economizado no
  // déficit — só 1x.
  useEffect(() => {
    if (diaAtual !== 90 || !programa90Ativo || !userId) return
    const cicloId = calcularPrograma90Ativo(programas)?.id ?? 'inicial'
    const chave = `mwa_90_concluido_${userId}_${cicloId}`
    if (localStorage.getItem(chave)) return
    localStorage.setItem(chave, '1')
    setConclusao90Aberta(true)
  }, [diaAtual, programa90Ativo, programas, userId])

  const refeicoesHoje = useMemo(
    () => refeicoes.filter((r) => r.data === hoje).sort((a, b) => (a.horario ?? '').localeCompare(b.horario ?? '')),
    [refeicoes, hoje],
  )

  const exerciciosHoje = useMemo(() => exercicios.filter((e) => e.data === hoje), [exercicios, hoje])

  const totaisHoje = useMemo(() => {
    const t = { calorias: 0, proteina: 0, carbos: 0, gordura: 0, fibras: 0 }
    for (const refeicao of refeicoesHoje) {
      const totaisRefeicao = totaisDaRefeicao(refeicao)
      t.calorias += totaisRefeicao.calorias
      t.proteina += totaisRefeicao.proteina
      t.carbos += totaisRefeicao.carbos
      t.gordura += totaisRefeicao.gordura
      t.fibras += totaisRefeicao.fibras
    }
    return {
      calorias: Math.round(t.calorias),
      proteina: Math.round(t.proteina * 10) / 10,
      carbos: Math.round(t.carbos * 10) / 10,
      gordura: Math.round(t.gordura * 10) / 10,
      fibras: Math.round(t.fibras * 10) / 10,
    }
  }, [refeicoesHoje])

  const gastoExercicios = useMemo(
    () => exerciciosHoje.reduce((s, e) => s + e.gastoCalorico, 0),
    [exerciciosHoje],
  )

  // ── Gamificação ──

  // Recompensa uma tarefa (a ref evita recompensa duplicada) e mostra o aviso "+N 🌱"
  async function premiar(tipo, ref) {
    if (!userId) return
    const ganho = await concederSementes(userId, tipo, ref)
    if (ganho > 0) {
      setGame((g) => (g ? { ...g, sementes: g.sementes + ganho } : g))
      setGanhoSementes({ qtd: ganho, tipo })
      setTimeout(() => setGanhoSementes(null), 3000)
      // Tarefas centrais do dia (refeição, água, dica, exercício) atualizam a tela de conclusão
      if (['refeicao', 'agua', 'dica', 'exercicio'].includes(tipo)) {
        setTarefasHoje((t) => ({ ...t, [tipo]: true, sementesHoje: t.sementesHoje + ganho }))
      } else {
        setTarefasHoje((t) => ({ ...t, sementesHoje: t.sementesHoje + ganho }))
      }
    }
  }

  function abrirConclusaoDia() {
    setConclusaoDiaAberta(true)
  }

  function fecharConclusao30() {
    setConclusao30Aberta(false)
  }

  function fecharConclusao90() {
    setConclusao90Aberta(false)
  }

  function fecharConclusaoDia() {
    setConclusaoDiaAberta(false)
  }

  async function escolherOpcaoRecomecar(opcao) {
    if (!userId) return
    const atualizado = await resolverModoRecomecar(userId, opcao, hoje)
    if (atualizado) setGame(atualizado)
  }

  function fecharModoRecomecar() {
    setModoRecomecarAberto(false)
  }

  async function marcarDicaLida(dia) {
    await premiar('dica', `dia-${dia}`)
  }

  // +15 🌱 por compartilhar o app (1x por dia)
  async function registrarCompartilhamento() {
    await premiar('divulgacao', hoje)
  }

  // +10 🌱 por fazer 300+ pontos no Jogo da Colheita (1x por dia)
  async function registrarJoguinho() {
    await premiar('joguinho', hoje)
  }

  // +10 🌱 por concluir uma missão do Monte Seu Prato com 1+ estrela (1x por dia)
  async function registrarJogoPrato() {
    await premiar('jogo_prato', hoje)
  }

  // +10 🌱 por rodada concluída em cada jogo educativo (1x por dia, por jogo)
  async function registrarJogoVerdadeiroFalso() {
    await premiar('jogo_vf', hoje)
  }

  async function registrarJogoTroca() {
    await premiar('jogo_troca', hoje)
  }

  async function registrarJogoSaciedade() {
    await premiar('jogo_saciedade', hoje)
  }

  async function registrarJogoRotulos() {
    await premiar('jogo_rotulos', hoje)
  }

  // +5 🌱 pelo Momento MWA do dia (1x por dia)
  async function registrarMomentoMwa() {
    await premiar('momento_mwa', hoje)
  }

  async function comprarSkin(categoria, skinId, preco) {
    if (!game || game.skins.includes(skinId)) return false
    const atualizado = await comprarSkinDb(userId, game, categoria, skinId, preco)
    if (atualizado) setGame(atualizado)
    return !!atualizado
  }

  async function equiparSkin(categoria, skinId) {
    if (!game || !game.skins.includes(skinId)) return
    const atualizado = await equiparSkinDb(userId, game, categoria, skinId)
    if (atualizado) setGame(atualizado)
  }

  async function concluirOnboarding(dados) {
    const agora = new Date().toISOString()
    const { data, error } = await supabase
      .from('mwa_perfis')
      .insert({
        id: userId,
        nome: dados.nome,
        email: dados.email,
        whatsapp: dados.whatsapp,
        sexo: dados.sexo,
        idade: dados.idade,
        peso: dados.peso,
        altura: dados.altura,
        nivel_atividade: dados.nivelAtividade,
        objetivo: dados.objetivo,
        medidas: dados.medidas ?? {},
        consentimento_lgpd: dados.consentimentoLgpd,
        ciente_aviso_crn: dados.cienteAvisoCrn,
        consentimento_registrado_em: agora,
        data_inicio: agora,
        idioma,
        personalizacao: montarPersonalizacaoParaSalvar(dados),
      })
      .select()
      .single()
    if (error) throw error
    // Trilha de auditoria LGPD do consentimento
    await supabase.from('mwa_lgpd_auditoria').insert({
      user_id: userId,
      tipo_acao: 'consentimento',
      detalhes: { consentimento_lgpd: true, ciente_aviso_crn: true },
    })
    // Vincula à conta a compra inicial de 90 dias aprovada pela Hotmart.
    // O webhook já deixou a compra aguardando a criação da conta.
    const { data: vinculo } = await supabase.functions.invoke('hotmart-vincular', {
      body: { email_compra: dados.email },
    })
    const { data: progs } = await supabase
      .from('mwa_programas')
      .select('*')
      .eq('user_id', userId)
    setUsuario(perfilParaUsuario(data))
    if (vinculo?.liberado && progs) setProgramas(progs.map(programaDoBanco))
    // +50 🌱 de boas-vindas
    await premiar('boas_vindas', 'unico')
  }

  // LGPD: direito de portabilidade — busca no banco tudo que existe sobre a pessoa
  async function exportarDados() {
    const [perfil, refs, exs, pesos, agua, auditoria] = await Promise.all([
      supabase.from('mwa_perfis').select('*').eq('id', userId).maybeSingle(),
      supabase.from('mwa_refeicoes').select('*, mwa_refeicoes_itens(*)').eq('user_id', userId).order('data'),
      supabase.from('mwa_exercicios').select('*').eq('user_id', userId).order('data'),
      supabase.from('mwa_pesagens').select('*').eq('user_id', userId).order('data'),
      supabase.from('mwa_agua').select('*').eq('user_id', userId).order('data'),
      supabase.from('mwa_lgpd_auditoria').select('*').eq('user_id', userId).order('criado_em'),
    ])
    await supabase.from('mwa_lgpd_auditoria').insert({ user_id: userId, tipo_acao: 'exportacao', detalhes: {} })
    return {
      exportadoEm: new Date().toISOString(),
      conta: { email: sessao.user.email, criadaEm: sessao.user.created_at },
      perfil: perfil.data,
      refeicoes: refs.data ?? [],
      exercicios: exs.data ?? [],
      pesagens: pesos.data ?? [],
      agua: agua.data ?? [],
      auditoriaLgpd: auditoria.data ?? [],
    }
  }

  // Apaga todos os dados do programa (mantém o login). Usado por "refazer cadastro".
  async function apagarDadosPrograma(tipoAcao) {
    await supabase.from('mwa_lgpd_auditoria').insert({ user_id: userId, tipo_acao: tipoAcao, detalhes: {} })
    // best-effort: falha ao limpar fotos no Storage não pode travar a exclusão dos dados no banco
    try {
      await limparFotosRefeicoesDoUsuario(userId)
    } catch (erro) {
      console.warn('[MWA] não foi possível limpar as fotos de refeições no Storage:', erro)
    }
    await Promise.all([
      supabase.from('mwa_refeicoes').delete().eq('user_id', userId),
      supabase.from('mwa_exercicios').delete().eq('user_id', userId),
      supabase.from('mwa_pesagens').delete().eq('user_id', userId),
      supabase.from('mwa_agua').delete().eq('user_id', userId),
    ])
    await supabase.from('mwa_perfis').delete().eq('id', userId)
    setUsuario(null)
    setRefeicoes([])
    setExercicios([])
    setPesagens([])
    setAguaMl(0)
  }

  async function reiniciar() {
    await apagarDadosPrograma('correcao')
  }

  // LGPD: direito de exclusão — apaga os dados e encerra a sessão
  async function deletarConta() {
    await apagarDadosPrograma('exclusao')
    await supabase.auth.signOut()
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  // Foto de perfil real (a pessoa escolhe do celular; já vem redimensionada em base64)
  async function atualizarFotoPerfil(dataUrl) {
    setUsuario((u) => (u ? { ...u, fotoUrl: dataUrl } : u))
    await supabase.from('mwa_perfis').update({ foto_url: dataUrl }).eq('id', userId)
  }

  async function atualizarIdioma(novoIdioma) {
    alterarIdioma(novoIdioma)
    setUsuario((u) => (u ? { ...u, idioma: novoIdioma } : u))
    await Promise.all([
      supabase.from('mwa_perfis').update({ idioma: novoIdioma }).eq('id', userId),
      supabase.auth.updateUser({ data: { ...sessao?.user?.user_metadata, idioma: novoIdioma } }),
    ])
  }

  async function obterOuCriarRefeicao(tipo) {
    const existente = refeicoesHoje.find((r) => r.tipo === tipo)
    if (existente) return existente

    const { data, error } = await supabase
      .from('mwa_refeicoes')
      .insert({ user_id: userId, data: hoje, tipo, horario: horarioAgora() })
      .select()
      .single()
    if (error) throw error

    const nova = refeicaoDoBanco(data, [])
    setRefeicoes((rs) => [...rs, nova])
    await registrarSessao(userId, 'atividade', { acao: 'refeicao_criada', tipo })
    return nova
  }

  async function adicionarItemRefeicao(refeicaoId, item) {
    const { data, error } = await supabase
      .from('mwa_refeicoes_itens')
      .insert({ refeicao_id: refeicaoId, ...itemParaBanco(item) })
      .select()
      .single()
    if (error) throw error

    const novoItem = itemDoBanco(data)
    setRefeicoes((rs) =>
      rs.map((r) => (r.id === refeicaoId ? { ...r, itens: [...r.itens, novoItem] } : r)),
    )
    const refeicao = refeicoesHoje.find((r) => r.id === refeicaoId)
    if (refeicao) await premiar('refeicao', `${hoje}:${refeicao.tipo}`)
  }

  async function atualizarItemRefeicao(refeicaoId, itemId, dados) {
    setRefeicoes((rs) =>
      rs.map((r) =>
        r.id === refeicaoId
          ? { ...r, itens: r.itens.map((i) => (i.id === itemId ? { ...i, ...dados } : i)) }
          : r,
      ),
    )
    await supabase.from('mwa_refeicoes_itens').update(itemParaBanco(dados)).eq('id', itemId)
  }

  async function removerItemRefeicao(refeicaoId, itemId) {
    const refeicao = refeicoes.find((r) => r.id === refeicaoId)
    const itensRestantes = (refeicao?.itens ?? []).filter((i) => i.id !== itemId)

    if (itensRestantes.length === 0) {
      // Sem alimentos, a refeição inteira some da lista
      setRefeicoes((rs) => rs.filter((r) => r.id !== refeicaoId))
      await supabase.from('mwa_refeicoes_itens').delete().eq('id', itemId)
      await supabase.from('mwa_refeicoes').delete().eq('id', refeicaoId)
      if (refeicao?.fotoUrl) await removerFotoRefeicao(userId, refeicaoId)
    } else {
      setRefeicoes((rs) =>
        rs.map((r) => (r.id === refeicaoId ? { ...r, itens: itensRestantes } : r)),
      )
      await supabase.from('mwa_refeicoes_itens').delete().eq('id', itemId)
    }
  }

  async function removerRefeicaoCompleta(refeicaoId) {
    const refeicao = refeicoes.find((r) => r.id === refeicaoId)
    setRefeicoes((rs) => rs.filter((r) => r.id !== refeicaoId))
    await supabase.from('mwa_refeicoes').delete().eq('id', refeicaoId)
    if (refeicao?.fotoUrl) await removerFotoRefeicao(userId, refeicaoId)
  }

  async function atualizarFotoRefeicao(refeicaoId, arquivo) {
    const url = await uploadFotoRefeicao(userId, refeicaoId, arquivo)
    setRefeicoes((rs) => rs.map((r) => (r.id === refeicaoId ? { ...r, fotoUrl: url } : r)))
    await supabase.from('mwa_refeicoes').update({ foto_url: url }).eq('id', refeicaoId)
  }

  async function adicionarExercicio(exercicio) {
    const { data, error } = await supabase
      .from('mwa_exercicios')
      .insert({
        user_id: userId,
        data: hoje,
        tipo: exercicio.tipo,
        emoji: exercicio.emoji,
        intensidade: exercicio.intensidade,
        duracao_min: exercicio.duracaoMin,
        gasto_calorico: exercicio.gastoCalorico,
      })
      .select()
      .single()
    if (!error) {
      setExercicios((es) => [...es, exercicioDoBanco(data)])
      await registrarSessao(userId, 'atividade', { acao: 'exercicio_adicionado', tipo: exercicio.tipo })
      // +10 🌱 uma vez por dia
      await premiar('exercicio', hoje)
    }
  }

  async function removerExercicio(id) {
    setExercicios((es) => es.filter((e) => e.id !== id))
    await supabase.from('mwa_exercicios').delete().eq('id', id)
  }

  async function adicionarPesagem(pesagem) {
    const { data, error } = await supabase
      .from('mwa_pesagens')
      .insert({
        user_id: userId,
        data: hoje,
        semana: pesagem.semana,
        peso: pesagem.peso,
        medidas: pesagem.medidas ?? {},
        fotos: pesagem.fotos ?? {},
        bioimpedancia: pesagem.bioimpedancia ?? null,
      })
      .select()
      .single()
    if (!error) {
      const novaPesagem = pesagemDoBanco(data)
      const novasPesagens = [...pesagens, novaPesagem]
      setPesagens(novasPesagens)
      await registrarSessao(userId, 'atividade', { acao: 'pesagem_adicionada', peso: pesagem.peso })
      // +30 🌱 por pesagem registrada — ref = data (única por dia). Não usamos "semana-N" porque
      // esse número se repete entre ciclos de 90 dias diferentes e bloquearia a recompensa do 2º ciclo.
      await premiar('pesagem', hoje)

      // +25 🌱 e estrela no Hall da Fama se o resultado foi positivo (perdeu peso ou medida)
      const resultado = calcularEstrelas(usuario, novasPesagens).find((r) => r.id === novaPesagem.id)
      if (resultado?.estrela) {
        await premiar('hall_fama', hoje)
      }
    }
  }

  // Indica uma amiga pelo WhatsApp — recompensa limitada a 3x por dia
  async function registrarIndicacao() {
    if (!userId) return 0
    for (let i = 1; i <= 3; i++) {
      const ganho = await concederSementes(userId, 'indicacao', `${hoje}:${i}`)
      if (ganho > 0) {
        setGame((g) => (g ? { ...g, sementes: g.sementes + ganho } : g))
        setGanhoSementes({ qtd: ganho, tipo: 'indicacao' })
        setTimeout(() => setGanhoSementes(null), 3000)
        setTarefasHoje((t) => ({ ...t, sementesHoje: t.sementesHoje + ganho }))
        return ganho
      }
    }
    return 0
  }

  async function adicionarAgua(ml) {
    const novo = Math.max(0, aguaMl + ml)
    setAguaMl(novo)
    await supabase.from('mwa_agua').upsert({ user_id: userId, data: hoje, ml: novo })
    // +10 🌱 quando bate a meta de água do dia
    if (metas && novo >= metas.aguaL * 1000) {
      await premiar('agua', hoje)
    }
  }

  function abrirEscolhaRefeicao() {
    setModalRefeicao({ etapa: 'escolher', refeicaoId: null, itemInicial: null })
  }

  async function abrirRefeicaoDoDia(tipo) {
    const refeicao = await obterOuCriarRefeicao(tipo)
    setModalRefeicao({ etapa: 'aberta', refeicaoId: refeicao.id, itemInicial: null })
  }

  function abrirAdicionarAlimento(itemInicial = null) {
    setModalRefeicao((m) => ({ ...m, etapa: 'alimento', itemInicial }))
  }

  function voltarParaRefeicaoAberta() {
    setModalRefeicao((m) => ({ ...m, etapa: 'aberta', itemInicial: null }))
  }

  function fecharModalRefeicao() {
    setModalRefeicao({ etapa: null, refeicaoId: null, itemInicial: null })
  }

  const valor = {
    sessao,
    carregando,
    usuario,
    programas,
    programa90Ativo,
    metas,
    diaAtual,
    totalDias,
    hoje,
    refeicoesHoje,
    exerciciosHoje,
    totaisHoje,
    gastoExercicios,
    pesagens,
    aguaMl,
    modalRefeicao,
    simuladorDia,
    setSimuladorDia,
    concluirOnboarding,
    exportarDados,
    reiniciar,
    deletarConta,
    sair,
    obterOuCriarRefeicao,
    adicionarItemRefeicao,
    atualizarItemRefeicao,
    removerItemRefeicao,
    removerRefeicaoCompleta,
    atualizarFotoRefeicao,
    adicionarExercicio,
    removerExercicio,
    adicionarPesagem,
    adicionarAgua,
    abrirEscolhaRefeicao,
    abrirRefeicaoDoDia,
    abrirAdicionarAlimento,
    voltarParaRefeicaoAberta,
    fecharModalRefeicao,
    atualizarFotoPerfil,
    atualizarIdioma,
    game,
    ganhoSementes,
    tarefasHoje,
    metasEstrela,
    semanaEstrelas,
    estrelaHojeAcesa,
    diaCompleto,
    conclusaoDiaAberta,
    abrirConclusaoDia,
    fecharConclusaoDia,
    modoRecomecarAberto,
    escolherOpcaoRecomecar,
    fecharModoRecomecar,
    conclusao30Aberta,
    fecharConclusao30,
    conclusao90Aberta,
    fecharConclusao90,
    marcarDicaLida,
    registrarCompartilhamento,
    registrarJoguinho,
    registrarJogoPrato,
    registrarJogoVerdadeiroFalso,
    registrarJogoTroca,
    registrarJogoSaciedade,
    registrarJogoRotulos,
    registrarMomentoMwa,
    userId,
    registrarIndicacao,
    comprarSkin,
    equiparSkin,
  }

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>')
  return ctx
}
