import feminino1 from '../../assets/evolucao/feminino-estagio-1.png'
import feminino2 from '../../assets/evolucao/feminino-estagio-2.png'
import feminino3 from '../../assets/evolucao/feminino-estagio-3.png'
import feminino4 from '../../assets/evolucao/feminino-estagio-4.png'
import feminino5 from '../../assets/evolucao/feminino-estagio-5.png'
import masculino1 from '../../assets/evolucao/masculino-estagio-1.png'
import masculino2 from '../../assets/evolucao/masculino-estagio-2.png'
import masculino3 from '../../assets/evolucao/masculino-estagio-3.png'
import masculino4 from '../../assets/evolucao/masculino-estagio-4.png'
import masculino5 from '../../assets/evolucao/masculino-estagio-5.png'

const AVATARES = {
  feminino: [feminino1, feminino2, feminino3, feminino4, feminino5],
  masculino: [masculino1, masculino2, masculino3, masculino4, masculino5],
}

export function calcularEstagioCorporal({ peso, altura, cintura }) {
  const pesoNumero = Number(peso)
  const alturaMetros = Number(altura) / 100
  const cinturaNumero = Number(cintura)

  if (!pesoNumero || !alturaMetros) return 3

  const imc = pesoNumero / (alturaMetros * alturaMetros)
  const relacaoCinturaAltura = cinturaNumero > 0 ? cinturaNumero / Number(altura) : null

  // A cintura ajuda a diferenciar estágios próximos, sem transformar o avatar
  // em diagnóstico. O resultado continua sendo explicitamente ilustrativo.
  if (imc >= 35 || (relacaoCinturaAltura && relacaoCinturaAltura >= 0.62)) return 1
  if (imc >= 30 || (relacaoCinturaAltura && relacaoCinturaAltura >= 0.56)) return 2
  if (imc >= 25 || (relacaoCinturaAltura && relacaoCinturaAltura >= 0.51)) return 3
  if (imc >= 18.5) return 4
  return 5
}

export default function AvatarEvolucaoRealista({
  sexo = 'feminino',
  estagio = 3,
  tamanho = 'grande',
  mostrarEtapas = false,
}) {
  const sexoSeguro = sexo === 'masculino' ? 'masculino' : 'feminino'
  const estagioSeguro = Math.min(5, Math.max(1, Number(estagio) || 3))
  const alturas = { pequeno: 'h-24', medio: 'h-40', grande: 'h-64' }

  return (
    <div className="flex flex-col items-center">
      <img
        src={AVATARES[sexoSeguro][estagioSeguro - 1]}
        alt={`Avatar corporal ${sexoSeguro}, estágio ilustrativo ${estagioSeguro} de 5`}
        className={`${alturas[tamanho] ?? alturas.grande} w-auto object-contain`}
      />
      {mostrarEtapas && (
        <div className="mt-2 flex items-center gap-1.5" aria-label={`Estágio ${estagioSeguro} de 5`}>
          {AVATARES[sexoSeguro].map((_, indice) => (
            <span
              key={indice}
              className={`h-2.5 w-2.5 rounded-full ${
                indice + 1 === estagioSeguro ? 'bg-sage' : 'bg-cinza'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
