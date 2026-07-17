import { createClient } from '@supabase/supabase-js'

// Projeto "MWA" (kfavxgrvikflzyzvcoyb) — projeto dedicado, com o fluxo Hotmart
// (mwa_programas/mwa_compras/mwa_hotmart_eventos) já provisionado.
// O projeto antigo "Espaço Auad" (kamnttliodtbovuaujsi) era compartilhado com
// outro sistema e foi descontinuado para o MWA antes do lançamento (sem clientes reais).
const SUPABASE_URL = 'https://kfavxgrvikflzyzvcoyb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_0J5iJD2TOr0j0qoEEZ9XzQ_eOEXlPh-'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
