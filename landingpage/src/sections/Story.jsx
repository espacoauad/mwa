import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'
import fotoWanessaStory from '../assets/foto-wanessa-story-final.jpg'
import logoMwaClara from '../assets/logo-mwa-clara.png'

export default function Story() {
  return (
    <Section className="bg-forest-deep">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <div className="mx-auto max-w-xl">
            <div className="overflow-hidden rounded-3xl border border-gold/30 bg-cream shadow-2xl shadow-black/20">
              <img
                src={fotoWanessaStory}
                alt="Wanessa Auad, criadora e mentora do MWA"
                className="h-auto w-full"
              />
            </div>
            <div className="relative mx-auto mt-12 flex max-w-md flex-col items-center px-8 pb-4 text-center">
              <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
              <div className="relative rounded-[2.5rem] bg-forest-deep px-10 py-5 shadow-[0_0_35px_rgba(199,154,74,0.12)]">
                <img
                  src={logoMwaClara}
                  alt="MWA — My Wellness Approach"
                  className="mx-auto w-36"
                />
              </div>
              <p className="relative mt-4 text-xs uppercase tracking-[0.2em] text-gold-soft">
                Expertise em bem-estar na palma da sua mão
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <Eyebrow light>A origem do MWA</Eyebrow>
          <Title light>Da história de Wanessa nasceu uma nova forma de viver o bem-estar.</Title>
          <GoldRule className="my-8" />
          <div className="space-y-4 text-sm leading-relaxed text-cream/80 md:text-base">
            <p>
              O MWA nasceu do encontro entre a minha história pessoal e mais de 20 anos de
              experiência acompanhando pessoas em busca de saúde, autoestima e qualidade de vida.
            </p>
            <p>
              Após a gestação do meu filho, eliminei 26 kg. Mas o maior desafio não era apenas
              emagrecer: era aprender a manter o resultado sem voltar ao ciclo das dietas e dos
              recomeços.
            </p>
            <p>
              Nesse processo, compreendi que informação sozinha não transforma. A mudança acontece
              quando alimentação, mentalidade, rotina, consciência e motivação começam a caminhar
              juntas.
            </p>
            <p>
              Há 14 anos, mantenho minha transformação com essa abordagem. Ao longo da minha prática
              profissional, ela também ajudou outras pessoas a tornarem o cuidado mais possível,
              consistente e conectado à vida real.
            </p>
            <p>
              Foi assim que nasceu o <strong className="font-semibold text-gold-soft">My Wellness Approach</strong>:
              uma abordagem de bem-estar construída com experiência pessoal, ciência nutricional e
              prática profissional.
            </p>
            <p>
              Hoje, essa abordagem vive no <strong className="font-semibold text-gold-soft">My Wellness App</strong>.
              O aplicativo coloca minha expertise na palma da sua mão e transforma tudo o que
              aprendi em orientação, educação, inspiração e acompanhamento para o seu dia.
            </p>
          </div>
          <p className="mt-8 border-l-2 border-gold pl-5 font-display text-xl italic leading-relaxed text-gold-soft md:text-2xl">
            O maior resultado não foi perder 26 kg. Foi aprender a permanecer.
          </p>
        </div>
      </div>
    </Section>
  )
}
