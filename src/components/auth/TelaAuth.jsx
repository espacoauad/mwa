import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import Botao from '../ui/Botao.jsx'
import LogoMWA from '../ui/LogoMWA.jsx'
import { supabase } from '../../lib/supabase.js'

const MENSAGENS_ERRO = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'User already registered': 'Este e-mail já tem cadastro. Use "Entrar".',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).',
}

export default function TelaAuth() {
  const [modo, setModo] = useState('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const emailValido = /\S+@\S+\.\S+/.test(email)
  const valido = emailValido && senha.length >= 6

  async function enviar() {
    setErro(null)
    setAviso(null)
    setEnviando(true)
    try {
      if (modo === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) setErro(MENSAGENS_ERRO[error.message] ?? error.message)
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password: senha })
        if (error) {
          setErro(MENSAGENS_ERRO[error.message] ?? error.message)
        } else if (!data.session) {
          setAviso('Cadastro criado! Enviamos um link de confirmação para o seu e-mail. Depois de confirmar, volte aqui e entre.')
          setModo('entrar')
        }
        // Se veio sessão, o AppContext assume daqui (onboarding)
      }
    } finally {
      setEnviando(false)
    }
  }

  const campo =
    'w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-4 text-lg font-medium text-verde outline-none transition-colors focus:border-sage'

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <div className="mb-8">
        <LogoMWA className="mb-5" />
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          {modo === 'entrar' ? 'Que bom te ver de novo' : 'Crie seu acesso'}
        </h1>
        <p className="mt-3 text-verde/70">
          {modo === 'entrar'
            ? 'Entre para continuar sua transformação de 21 dias.'
            : 'Seu acesso pessoal ao programa. Use o mesmo e-mail da compra.'}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <label className="block">
          <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-verde">
            <Mail size={14} /> E-mail
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className={campo}
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-verde">
            <Lock size={14} /> Senha
          </span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={campo}
          />
        </label>

        {erro && (
          <p className="rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{erro}</p>
        )}
        {aviso && (
          <p className="rounded-lg border-2 border-sage/40 bg-sage-claro p-3 text-sm font-medium text-verde">{aviso}</p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={enviar} disabled={!valido || enviando}>
          {enviando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
        </Botao>
        <button
          type="button"
          onClick={() => {
            setModo((m) => (m === 'entrar' ? 'cadastrar' : 'entrar'))
            setErro(null)
            setAviso(null)
          }}
          className="py-2 text-sm font-semibold text-sage"
        >
          {modo === 'entrar' ? 'Primeira vez aqui? Criar conta' : 'Já tenho conta — entrar'}
        </button>
      </div>
    </div>
  )
}
