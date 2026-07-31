# Como Ativar o Programa de 90 Dias

## Método 1: Via Console (Recomendado)

1. Abra a app em seu navegador e faça login com **wanessauad@me.com**
2. Abra o Console do Navegador (pressione `F12` ou `Ctrl+Shift+I`)
3. Vá para a aba **Console**
4. Cole o código abaixo e pressione Enter:

```javascript
(async () => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const SUPABASE_URL = 'https://kfavxgrvikflzyzvcoyb.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_0J5iJD2TOr0j0qoEEZ9XzQ_eOEXlPh-';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    console.log('🔍 Buscando sua sessão...');
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error('❌ Você não está autenticado. Faça login primeiro!');
      return;
    }

    const userId = session.user.id;
    console.log(`✅ Sessão encontrada. ID do usuário: ${userId}`);

    // Verificar se já tem 90d
    console.log('📋 Verificando programas existentes...');
    const { data: programas, error: erroProgramas } = await supabase
      .from('mwa_programas')
      .select('*')
      .eq('user_id', userId);

    if (erroProgramas) {
      console.error('❌ Erro ao buscar programas:', erroProgramas);
      return;
    }

    const tem90d = programas.some(p => p.tipo === '90d' && p.status === 'ativo');

    if (tem90d) {
      console.log('⚠️  Você já tem um programa de 90 dias ativo!');
      return;
    }

    // Inserir novo programa
    console.log('📝 Ativando programa de 90 dias...');
    const hoje = new Date().toISOString().split('T')[0];

    const { data: novoPrograma, error: erroInsercao } = await supabase
      .from('mwa_programas')
      .insert([{
        user_id: userId,
        tipo: '90d',
        status: 'ativo',
        data_inicio: hoje,
      }])
      .select();

    if (erroInsercao) {
      console.error('❌ Erro ao inserir programa:', erroInsercao);
      return;
    }

    console.log('✅ Programa de 90 dias ativado com sucesso!');
    console.log('🚀 Recarregue a página para ver as mudanças');
    console.log('📅 Data de início:', hoje);

  } catch (erro) {
    console.error('❌ Erro:', erro);
  }
})();
```

5. A ativação será feita automaticamente no console
6. Você verá mensagens de sucesso: **"✅ Programa de 90 dias ativado com sucesso!"**
7. Recarregue a página (F5) para ver as mudanças

## Método 2: Via Componente Admin

Se você tiver acesso de administrador, acesse:
```
http://localhost:5173/admin/ativar-90d
```

Preencha seu email e clique em "Ativar Programa".

## Método 3: Supabase Dashboard (Último Recurso)

Se nada funcionar, faça isso manualmente:

1. Acesse: https://supabase.com/dashboard/project/kfavxgrvikflzyzvcoyb/sql
2. Faça login com sua conta Supabase
3. Vá para **SQL Editor**
4. Execute a seguinte query (substitua `wanessauad@me.com` pelo seu email):

```sql
-- Encontrar o ID do usuário
WITH usuario AS (
  SELECT id FROM mwa_perfis 
  WHERE email = 'wanessauad@me.com'
  LIMIT 1
)
-- Inserir o programa de 90 dias
INSERT INTO mwa_programas (user_id, tipo, status, data_inicio)
SELECT id, '90d', 'ativo', CURRENT_DATE FROM usuario
ON CONFLICT DO NOTHING;
```

5. Execute a query
6. Se vir "0 rows affected" ou mensagem de sucesso, o programa foi ativado!

---

**Qualquer dúvida, execute a query acima para verificar:**
```sql
SELECT user_id, tipo, status, data_inicio 
FROM mwa_programas 
WHERE tipo = '90d' 
ORDER BY data_inicio DESC 
LIMIT 1;
```
