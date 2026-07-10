import { createClient } from '@supabase/supabase-js'

// Projeto "Espaço Auad" — tabelas do MWA usam o prefixo mwa_
const SUPABASE_URL = 'https://kamnttliodtbovuaujsi.supabase.co'
const SUPABASE_KEY = 'sb_publishable_y3Eeo1xNuUZkT3eP-y5PMQ_LGn5vIOY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
