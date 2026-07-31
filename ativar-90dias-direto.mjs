import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kfavxgrvikflzyzvcoyb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_0J5iJD2TOr0j0qoEEZ9XzQ_eOEXlPh-'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function ativar90DiasComEmail() {
  try {
    console.log('🔍 Tentando autenticar como wanessauad@me.com...')

    // Primeira tentativa: usar email para acessar dados
    // Na verdade, vamos tentar inserir diretamente na tabela
    // assumindo que o user_id é o UUID do Supabase auth para esse email

    const hoje = new Date().toISOString().split('T')[0]

    // Vamos tentar vários UUIDs possíveis ou IDs comuns
    // Mas o correto é usar o ID real do usuário

    console.log('\n⚠️  Para ativar o programa de 90 dias, preciso de seu ID de usuário.')
    console.log('\n📝 Siga os passos:')
    console.log('1. Acesse a app MWA e faça login com wanessauad@me.com')
    console.log('2. Abra o console do navegador (F12) e execute:')
    console.log('   console.log(JSON.parse(localStorage.getItem("__SUPABASE_SBAT__")).user.id)')
    console.log('3. Copie o ID retornado')
    console.log('4. Execute este script novamente com o parâmetro --user-id=<ID_COPIADO>')

    // Alternativamente, pode-se usar o seguinte se tiver acesso ao JWT
    console.log('\n💡 Ou, se quiser fazer via Supabase Dashboard:')
    console.log('1. Acesse: https://supabase.com/dashboard/project/kfavxgrvikflzyzvcoyb')
    console.log('2. Vá para SQL Editor')
    console.log('3. Execute esta query:')

    const emailEscapado = 'wanessauad@me.com'.replace(/'/g, "''")
    const query = `
-- Encontrar o usuário
SELECT id FROM auth.users WHERE email = '${emailEscapado}';

-- Se encontrou um ID (ex: abc123), execute:
INSERT INTO mwa_programas (user_id, tipo, status, data_inicio)
VALUES ('abc123', '90d', 'ativo', '${hoje}')
ON CONFLICT DO NOTHING;
`.trim()

    console.log(query)

  } catch (erro) {
    console.error('❌ Erro:', erro)
  }
}

ativar90DiasComEmail()
