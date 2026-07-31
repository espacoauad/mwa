import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kfavxgrvikflzyzvcoyb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_0J5iJD2TOr0j0qoEEZ9XzQ_eOEXlPh-'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function ativar90Dias() {
  try {
    console.log('🔍 Buscando usuário com email: wanessauad@me.com')

    // Busca na tabela mwa_perfis (que é a tabela de usuários)
    const { data: usuarios, error: erroUsuario } = await supabase
      .from('mwa_perfis')
      .select('id, email, nome')
      .eq('email', 'wanessauad@me.com')

    if (erroUsuario) {
      console.error('❌ Erro ao buscar usuário:', erroUsuario)
      return
    }

    if (!usuarios || usuarios.length === 0) {
      console.error('❌ Usuário não encontrado com esse email')
      return
    }

    const usuario = usuarios[0]
    console.log(`✅ Usuário encontrado: ${usuario.nome} (ID: ${usuario.id})`)

    await inserirPrograma90d(usuario.id)

  } catch (erro) {
    console.error('❌ Erro inesperado:', erro)
  }
}

async function inserirPrograma90d(userId) {
  // 2. Verificar se já tem programa 90d ativo
  console.log('\n📋 Verificando programas existentes...')

  const { data: programas, error: erroProgramas } = await supabase
    .from('mwa_programas')
    .select('*')
    .eq('user_id', userId)

  if (erroProgramas) {
    console.error('❌ Erro ao buscar programas:', erroProgramas)
    return
  }

  console.log(`Programas encontrados: ${programas.length}`)
  programas.forEach(p => {
    console.log(`  - Tipo: ${p.tipo}, Status: ${p.status}, Data início: ${p.dataInicio}`)
  })

  // Verificar se já tem 90d ativo
  const tem90dAtivo = programas.some(p => p.tipo === '90d' && p.status === 'ativo')
  if (tem90dAtivo) {
    console.log('⚠️  Você já tem um programa de 90 dias ativo!')
    return
  }

  // 3. Inserir novo programa de 90 dias
  console.log('\n📝 Ativando programa de 90 dias...')

  const hoje = new Date().toISOString().split('T')[0]

  const { data: novoProgramas, error: erroInsercao } = await supabase
    .from('mwa_programas')
    .insert([
      {
        user_id: userId,
        tipo: '90d',
        status: 'ativo',
        dataInicio: hoje,
        dataCriacao: new Date().toISOString()
      }
    ])
    .select()

  if (erroInsercao) {
    console.error('❌ Erro ao inserir programa:', erroInsercao)
    console.log('⚠️  Pode ser um problema de RLS (Row Level Security) que bloqueia inserções via chave publicável.')
    console.log('💡 Solução: Execute essa ativação diretamente no dashboard Supabase ou use uma chave de serviço.')
    return
  }

  console.log(`✅ Programa de 90 dias ativado com sucesso!`)
  console.log(`\n🎉 Detalhes:`)
  console.log(`   - Tipo: 90d`)
  console.log(`   - Status: ativo`)
  console.log(`   - Data de início: ${hoje}`)
  console.log(`\n🚀 Seu acesso aos 90 dias está liberado! Recarregue o app para ver as mudanças.`)
}

ativar90Dias()
