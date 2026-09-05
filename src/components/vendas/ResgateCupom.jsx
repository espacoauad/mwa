import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function ResgateCupom() {
  const { ingles } = useIdioma()
  const [cupom, setCupom] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [etapa, setEtapa] = useState('cupom') // cupom | criando | sucesso | erro
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function validarCupom(e) {
    e.preventDefault()
    setCarregando(true)
    setMensagem('')

    try {
      // Validar cupom no banco
      const { data: cupomData, error: cupomError } = await supabase
        .from('mwa_cupons')
        .select('*')
        .eq('codigo', cupom.toUpperCase())
        .eq('ativo', true)
        .maybeSingle()

      if (cupomError || !cupomData) {
        setMensagem(ingles ? '❌ Invalid or expired coupon' : '❌ Cupom inválido ou expirado')
        setEtapa('erro')
        setCarregando(false)
        return
      }

      if (cupomData.usado) {
        setMensagem(ingles ? '❌ This coupon has already been used' : '❌ Este cupom já foi usado')
        setEtapa('erro')
        setCarregando(false)
        return
      }

      // Cupom válido! Ir pra etapa de criar conta
      setEtapa('criando')
      setMensagem(ingles ? '✅ Valid coupon! Now create your account.' : '✅ Cupom válido! Agora crie sua conta.')
    } catch (err) {
      setMensagem((ingles ? '❌ Validation error: ' : '❌ Erro ao validar: ') + err.message)
      setEtapa('erro')
    } finally {
      setCarregando(false)
    }
  }

  async function criarConta(e) {
    e.preventDefault()
    setCarregando(true)
    setMensagem('')

    try {
      // Criar user no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/?acesso=confirmado`,
        },
      })

      if (authError) {
        setMensagem((ingles ? '❌ Error: ' : '❌ Erro: ') + authError.message)
        setEtapa('erro')
        setCarregando(false)
        return
      }

      const userId = authData.user.id

      // Marcar cupom como usado
      const hoje = new Date().toISOString()

      await supabase
        .from('mwa_cupons')
        .update({ usado: true, usado_por: userId, usado_em: hoje })
        .eq('codigo', cupom.toUpperCase())

      setEtapa('sucesso')
      setMensagem(ingles ? '✅ Account created successfully!' : '✅ Conta criada com sucesso!')

      // Redirecionar pra app em 3 segundos (onboarding completa o perfil)
      setTimeout(() => {
        window.location.href = '/?acesso=novo'
      }, 3000)
    } catch (err) {
      setMensagem((ingles ? '❌ Error creating account: ' : '❌ Erro ao criar conta: ') + err.message)
      setEtapa('erro')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-creme to-white">
      <header className="border-b border-cinza bg-white">
        <div className="mx-auto max-w-md px-4 py-4">
          <h1 className="font-serif text-2xl font-bold italic text-verde">MWA 🌿</h1>
          <p className="text-xs text-verde/60">{ingles ? 'Redeem your access' : 'Resgate seu acesso'}</p>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-12">
        {/* Etapa 1: Cupom */}
        {etapa === 'cupom' && (
          <div className="rounded-lg border-2 border-sage-claro bg-white p-8">
            <h2 className="mb-2 font-serif text-2xl font-bold italic text-verde">
              {ingles ? 'Welcome!' : 'Bem-vindo!'}
            </h2>
            <p className="mb-6 text-sm text-verde/70">
              {ingles ? 'Enter the code you received by email to activate your access.' : 'Digite o código que você recebeu por email para ativar seu acesso.'}
            </p>

            <form onSubmit={validarCupom} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-verde">
                  {ingles ? 'Your Access Code' : 'Seu Código de Acesso'}
                </label>
                <input
                  type="text"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value.toUpperCase())}
                  placeholder="Ex: MWA-ABC123"
                  className="mt-2 w-full rounded-lg border border-cinza bg-white px-4 py-2 text-center font-mono text-lg tracking-widest focus:border-verde focus:outline-none"
                  required
                  disabled={carregando}
                />
              </div>

              <button
                type="submit"
                disabled={carregando || !cupom}
                className="w-full rounded-lg bg-verde px-4 py-3 font-bold text-white hover:bg-verde/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {carregando ? (ingles ? 'Validating...' : 'Validando...') : (ingles ? 'Validate Coupon' : 'Validar Cupom')}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-verde/60">
              {ingles ? "Didn't receive the code? " : 'Não recebeu o código? '}
              <a href="https://wa.me/5562994246775" className="font-semibold text-verde hover:underline">
                {ingles ? 'Message us on WhatsApp' : 'Chame no WhatsApp'}
              </a>
            </p>
          </div>
        )}

        {/* Etapa 2: Criar Conta */}
        {etapa === 'criando' && (
          <div className="rounded-lg border-2 border-sage-claro bg-white p-8">
            <h2 className="mb-2 font-serif text-2xl font-bold italic text-verde">
              {ingles ? 'Create your Account' : 'Crie sua Conta'}
            </h2>
            <p className="mb-6 text-sm text-verde/70">
              {ingles ? 'Use these credentials to access the app.' : 'Use essas credenciais para acessar o app.'}
            </p>

            <form onSubmit={criarConta} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-verde">{ingles ? 'Email' : 'Email'}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ingles ? 'you@email.com' : 'seu@email.com'}
                  className="mt-2 w-full rounded-lg border border-cinza px-4 py-2 focus:border-verde focus:outline-none"
                  required
                  disabled={carregando}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-verde">{ingles ? 'Password' : 'Senha'}</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-lg border border-cinza px-4 py-2 focus:border-verde focus:outline-none"
                  required
                  disabled={carregando}
                  minLength={8}
                />
                <p className="mt-1 text-xs text-verde/60">{ingles ? 'Min. 8 characters' : 'Mín. 8 caracteres'}</p>
              </div>

              <button
                type="submit"
                disabled={carregando || !email || !senha}
                className="w-full rounded-lg bg-verde px-4 py-3 font-bold text-white hover:bg-verde/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {carregando ? (ingles ? 'Creating account...' : 'Criando conta...') : (ingles ? 'Create Account' : 'Criar Conta')}
              </button>
            </form>
          </div>
        )}

        {/* Sucesso */}
        {etapa === 'sucesso' && (
          <div className="rounded-lg border-2 border-green-300 bg-green-50 p-8 text-center">
            <p className="mb-4 text-4xl">✅</p>
            <h2 className="mb-2 font-serif text-2xl font-bold italic text-verde">
              {ingles ? 'All set!' : 'Pronto!'}
            </h2>
            <p className="mb-4 text-sm text-verde/70">
              {ingles ? 'Your account was created successfully. You will be redirected shortly...' : 'Sua conta foi criada com sucesso. Você será redirecionado em instantes...'}
            </p>
            <p className="text-xs text-verde/60">
              {ingles ? <>You have <strong>30 days</strong> of full access to the MWA app.</> : <>Você tem <strong>30 dias</strong> de acesso completo ao app MWA.</>}
            </p>
          </div>
        )}

        {/* Erro */}
        {etapa === 'erro' && (
          <div className="rounded-lg border-2 border-red-300 bg-red-50 p-8">
            <p className="mb-4 text-center text-2xl">❌</p>
            <p className="mb-6 text-center font-semibold text-red-700">{mensagem}</p>
            <button
              onClick={() => {
                setEtapa('cupom')
                setCupom('')
                setMensagem('')
              }}
              className="w-full rounded-lg bg-verde px-4 py-3 font-bold text-white hover:bg-verde/90 transition-colors"
            >
              {ingles ? 'Try Again' : 'Tentar Novamente'}
            </button>
          </div>
        )}

        {mensagem && etapa !== 'erro' && etapa !== 'sucesso' && (
          <div
            className={`mt-6 rounded-lg p-4 text-center text-sm font-semibold ${
              mensagem.includes('✅')
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-red-300 bg-red-50 text-red-700'
            }`}
          >
            {mensagem}
          </div>
        )}
      </main>
    </div>
  )
}
