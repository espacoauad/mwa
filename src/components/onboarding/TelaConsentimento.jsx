import { useState } from 'react'
import { ShieldCheck, Stethoscope } from 'lucide-react'
import Botao from '../ui/Botao.jsx'
import LogoMWA from '../ui/LogoMWA.jsx'
import DocumentoLegal from '../legal/DocumentoLegal.jsx'
import {
  AVISO_CRN,
  DADOS_COLETADOS,
  USOS_DADOS,
  NUTRICIONISTA,
  POLITICA_PRIVACIDADE,
  TERMOS_USO,
} from '../../data/legal.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const DADOS_EN = [
  { titulo: 'Identity and contact', itens: 'name, email, and WhatsApp' },
  { titulo: 'Biometric information', itens: 'weight, height, age, sex, and body measurements' },
  { titulo: 'Food routine', itens: 'meals, water, and exercise logged in the app' },
  { titulo: 'Progress', itens: 'weekly weigh-ins and progress photos' },
  { titulo: 'Habits and motivation', itens: 'sleep, hydration, bowel function, energy levels, eating habits, and your personal goals' },
]

const USOS_EN = [
  'Calculate your nutrition targets (calories, macros, water, and fiber)',
  'Track your progress throughout the program',
  'Send program information and reminders',
  'Provide support through WhatsApp',
  'Personalize your in-app experience',
]

export default function TelaConsentimento({ dados, atualizar, avancar }) {
  const { ingles } = useIdioma()
  const [documento, setDocumento] = useState(null)
  const valido = dados.consentimentoLgpd && dados.cienteAvisoCrn
  const dadosColetados = ingles ? DADOS_EN : DADOS_COLETADOS
  const usosDados = ingles ? USOS_EN : USOS_DADOS

  return (
    <>
      <div className="mb-6">
        <LogoMWA variante="simbolo" className="mb-4 h-12 w-12" />
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          {ingles ? 'Welcome to your program' : 'Bem-vinda ao seu programa'}
        </h1>
        <p className="mt-3 text-verde/70">
          {ingles ? 'Before you begin, we need your permission to process your information under Brazil’s LGPD data protection law.' : 'Antes de começar, precisamos da sua autorização para tratar seus dados, conforme a LGPD.'}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-verde">
          <ShieldCheck size={16} className="text-sage" /> {ingles ? 'What we collect' : 'O que coletamos'}
        </h2>
        <ul className="mt-2 flex flex-col gap-1.5 text-sm text-verde/75">
          {dadosColetados.map((d) => (
            <li key={d.titulo}>
              <strong className="text-verde">{d.titulo}:</strong> {d.itens}
            </li>
          ))}
        </ul>
        <h2 className="mt-4 text-sm font-bold text-verde">{ingles ? 'How we use it' : 'Para que usamos'}</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-verde/75">
          {usosDados.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-ouro/50 bg-ouro-claro/60 p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-verde">
          <Stethoscope size={16} className="text-ouro" /> {ingles ? 'Health notice' : 'Aviso de responsabilidade'} ·{' '}
          {NUTRICIONISTA.crn}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-verde/75">
          {ingles ? `This program was developed by registered nutritionist ${NUTRICIONISTA.nome} (${NUTRICIONISTA.crn}) for educational and nutrition follow-up purposes. It does not replace medical consultation or treatment. If you have a health condition, are pregnant, or have an eating disorder, consult your doctor before starting.` : AVISO_CRN}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-sage/25 bg-white p-4">
          <input
            type="checkbox"
            checked={dados.consentimentoLgpd}
            onChange={(e) => atualizar('consentimentoLgpd', e.target.checked)}
            aria-required="true"
            className="mt-0.5 h-5 w-5 shrink-0 accent-sage"
          />
          <span className="text-sm text-verde/80">
            {ingles ? 'I authorize the processing of my information as described above and agree to the ' : 'Autorizo o tratamento dos meus dados conforme descrito acima e concordo com a '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setDocumento(POLITICA_PRIVACIDADE)
              }}
              className="font-semibold text-sage underline"
            >
              {ingles ? 'Privacy Policy' : 'Política de Privacidade'}
            </button>{' '}
            {ingles ? ' and the ' : ' e os '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setDocumento(TERMOS_USO)
              }}
              className="font-semibold text-sage underline"
            >
              {ingles ? 'Terms of Use' : 'Termos de Uso'}
            </button>
            .
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-sage/25 bg-white p-4">
          <input
            type="checkbox"
            checked={dados.cienteAvisoCrn}
            onChange={(e) => atualizar('cienteAvisoCrn', e.target.checked)}
            aria-required="true"
            className="mt-0.5 h-5 w-5 shrink-0 accent-sage"
          />
          <span className="text-sm text-verde/80">
            {ingles ? 'I have read the health notice and understand that this educational program does not replace medical care.' : 'Li o aviso de responsabilidade e entendo que este programa é educacional e não substitui atendimento médico.'}
          </span>
        </label>
      </div>

      <div className="mt-auto pt-6">
        <Botao onClick={avancar} disabled={!valido}>
          {ingles ? 'I agree, let’s begin' : 'Aceito, vamos começar'}
        </Botao>
      </div>

      {documento && <DocumentoLegal documento={documento} onFechar={() => setDocumento(null)} />}
    </>
  )
}
