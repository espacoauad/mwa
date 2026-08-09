import { useState } from 'react'
import { Globe2, Mail, Lock } from 'lucide-react'
import Botao from '../ui/Botao.jsx'
import LogoMWA from '../ui/LogoMWA.jsx'
import { supabase } from '../../lib/supabase.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const TEXTOS = {
  'pt-BR': {
    tituloEntrar: 'Que bom te ver de novo', tituloCadastrar: 'Crie seu acesso',
    descricaoEntrar: 'Entre para continuar sua Jornada de 30 Dias.',
    descricaoCadastrar: 'Seu acesso pessoal ao programa. Use o mesmo e-mail da compra.',
    idioma: 'Idioma', portugues: 'Português', ingles: 'Inglês', email: 'E-mail', senha: 'Senha',
    senhaPlaceholder: 'Mínimo 6 caracteres', aguarde: 'Aguarde…', entrar: 'Entrar', criarConta: 'Criar conta',
    irCadastrar: 'Primeira vez aqui? Criar conta', irEntrar: 'Já tenho conta — entrar',
    cadastroCriado: 'Cadastro criado! Enviamos um link de confirmação para o seu e-mail (dê uma olhada também na caixa de spam/lixo eletrônico). Depois de confirmar, volte aqui e entre.',
    erros: {
      'Invalid login credentials': 'E-mail ou senha incorretos.',
      'User already registered': 'Este e-mail já tem cadastro. Use "Entrar".',
      'Email not confirmed': 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).',
    },
  },
  'en-US': {
    tituloEntrar: 'It’s great to see you again', tituloCadastrar: 'Create your account',
    descricaoEntrar: 'Sign in to continue your 30-day journey.',
    descricaoCadastrar: 'Your personal access to the program. Use the same email as your purchase.',
    idioma: 'Language', portugues: 'Portuguese', ingles: 'English', email: 'Email', senha: 'Password',
    senhaPlaceholder: 'At least 6 characters', aguarde: 'Please wait…', entrar: 'Sign in', criarConta: 'Create account',
    irCadastrar: 'New here? Create an account', irEntrar: 'I already have an account — sign in',
    cadastroCriado: 'Account created! We sent a confirmation link to your email (also check your spam/junk folder). After confirming, come back here and sign in.',
    erros: {
      'Invalid login credentials': 'Incorrect email or password.',
      'User already registered': 'This email is already registered. Select “Sign in”.',
      'Email not confirmed': 'Confirm your email before signing in (check your inbox).',
    },
  },
}

export default function TelaAuth() {
  const { idioma, alterarIdioma } = useIdioma()
  const [modo, setModo] = useState('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const t = TEXTOS[idioma]
  const valido = /\S+@\S+\.\S+/.test(email) && senha.length >= 6

  async function enviar() {
    setErro(null)
    setAviso(null)
    setEnviando(true)
    try {
      if (modo === 'entrar') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) setErro(t.erros[error.message] ?? error.message)
        else if (data.user) {
          await supabase.auth.updateUser({ data: { ...data.user.user_metadata, idioma } })
          await supabase.from('mwa_perfis').update({ idioma }).eq('id', data.user.id)
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { data: { idioma } },
        })
        if (error) setErro(t.erros[error.message] ?? error.message)
        else if (!data.session) {
          setAviso(t.cadastroCriado)
          setModo('entrar')
        }
      }
    } finally {
      setEnviando(false)
    }
  }

  const campo = 'w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-4 text-lg font-medium text-verde outline-none transition-colors focus:border-sage'

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <div className="mb-8">
        <LogoMWA className="mb-5" />
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          {modo === 'entrar' ? t.tituloEntrar : t.tituloCadastrar}
        </h1>
        <p className="mt-3 text-verde/70">{modo === 'entrar' ? t.descricaoEntrar : t.descricaoCadastrar}</p>
      </div>

      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-verde">
            <Globe2 size={14} /> {t.idioma}
          </legend>
          <div className="grid grid-cols-2 rounded-lg border-2 border-sage/30 bg-white p-1">
            {[['pt-BR', t.portugues], ['en-US', t.ingles]].map(([valor, rotulo]) => (
              <button key={valor} type="button" onClick={() => alterarIdioma(valor)} aria-pressed={idioma === valor}
                className={`rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${idioma === valor ? 'bg-verde text-white shadow-sm' : 'text-verde/65 hover:bg-sage-claro'}`}>
                {rotulo}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-verde"><Mail size={14} /> {t.email}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" className={campo} />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-verde"><Lock size={14} /> {t.senha}</span>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder={t.senhaPlaceholder} className={campo} />
        </label>

        {erro && <p className="rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{erro}</p>}
        {aviso && <p className="rounded-lg border-2 border-sage/40 bg-sage-claro p-3 text-sm font-medium text-verde">{aviso}</p>}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={enviar} disabled={!valido || enviando}>{enviando ? t.aguarde : modo === 'entrar' ? t.entrar : t.criarConta}</Botao>
        <button type="button" onClick={() => {
          setModo((m) => (m === 'entrar' ? 'cadastrar' : 'entrar'))
          setErro(null)
          setAviso(null)
        }} className="py-2 text-sm font-semibold text-sage">
          {modo === 'entrar' ? t.irCadastrar : t.irEntrar}
        </button>
      </div>
    </div>
  )
}
