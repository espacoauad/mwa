import { lazy, Suspense } from 'react'
import Header from './components/Header.jsx'
import Hero from './sections/Hero.jsx'
import TrustBar from './sections/TrustBar.jsx'
import Problem from './sections/Problem.jsx'
import Quiz from './sections/Quiz.jsx'
import Footer from './sections/Footer.jsx'

const Story = lazy(() => import('./sections/Story.jsx'))
const Method = lazy(() => import('./sections/Method.jsx'))
const AppShowcase = lazy(() => import('./sections/AppShowcase.jsx'))
const Benefits = lazy(() => import('./sections/Benefits.jsx'))
const About = lazy(() => import('./sections/About.jsx'))
const Offer = lazy(() => import('./sections/Offer.jsx'))
const FinalCta = lazy(() => import('./sections/FinalCta.jsx'))
const Faq = lazy(() => import('./sections/Faq.jsx'))

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-cream"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" style={{ scrollMarginTop: '5rem' }}>
        <Hero />
        <TrustBar />
        <Problem />
        <Quiz />
        <Suspense fallback={<div style={{ minHeight: '40rem' }} aria-hidden="true" />}>
          <Story />
          <Method />
          <AppShowcase />
          <Benefits />
          <About />
          <Offer />
          <FinalCta />
          <Faq />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
