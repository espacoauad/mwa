import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kfavxgrvikflzyzvcoyb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_0J5iJD2TOr0j0qoEEZ9XzQ_eOEXlPh-'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function listarUsuarios() {
  try {
    console.log('📋 Listando usuários no banco...\n')

    const { data: usuarios, error } = await supabase
      .from('mwa_perfis')
      .select('id, email, nome')
      .order('data_inicio', { ascending: false })

    if (error) {
      console.error('❌ Erro:', error)
      return
    }

    if (!usuarios || usuarios.length === 0) {
      console.log('Nenhum usuário encontrado.')
      return
    }

    console.log(`Total de usuários: ${usuarios.length}\n`)
    usuarios.forEach((u, i) => {
      console.log(`${i + 1}. ${u.nome} (ID: ${u.id})`)
      console.log(`   Email: ${u.email}\n`)
    })

  } catch (erro) {
    console.error('❌ Erro:', erro)
  }
}

listarUsuarios()
