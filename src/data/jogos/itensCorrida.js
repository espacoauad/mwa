// Itens da Corrida da Escolha — apenas METADADOS do jogo (svgId + tipo).
// Nutrição não é duplicada aqui: vem de src/data/alimentos.js (fonte única).

import { ALIMENTOS } from '../alimentos.js'

function porId(alimentoId) {
  const alimento = ALIMENTOS.find((a) => a.id === alimentoId)
  if (!alimento) throw new Error(`[corrida] alimento não encontrado por id: ${alimentoId}`)
  return alimento
}

// alimentosExtras.js gera ids por posição (br-001, br-002…), instáveis se o
// arquivo ganhar novas linhas no meio — por isso resolvemos por nome exato.
function porNome(nome) {
  const alimento = ALIMENTOS.find((a) => a.nome === nome)
  if (!alimento) throw new Error(`[corrida] alimento não encontrado por nome: ${nome}`)
  return alimento
}

const SAUDAVEIS = [
  { svgId: 'banana', alimentoId: 'banana' },
  { svgId: 'maca', alimentoId: 'maca' },
  { svgId: 'morango', alimentoId: 'morango' },
  { svgId: 'brocolis', alimentoId: 'brocolis' },
  { svgId: 'cenoura', alimentoId: 'cenoura' },
  { svgId: 'iogurte-natural', alimentoId: 'iogurte-natural' },
  { svgId: 'ovo', alimentoId: 'ovo' },
  { svgId: 'aveia', alimentoId: 'aveia' },
  { svgId: 'batata-doce', alimentoId: 'batata-doce' },
  { svgId: 'salada-verde', alimentoId: 'salada-verde' },
].map(({ svgId, alimentoId }) => ({ svgId, tipo: 'saudavel', alimento: porId(alimentoId) }))

const NAO_SAUDAVEIS = [
  { svgId: 'hamburguer', nome: 'Hambúrguer completo' },
  { svgId: 'pizza', nome: 'Pizza de muçarela' },
  { svgId: 'batata-frita', nome: 'Batata inglesa frita' },
  { svgId: 'cachorro-quente', nome: 'Cachorro-quente completo' },
  { svgId: 'coxinha', nome: 'Coxinha de frango' },
  { svgId: 'brigadeiro', nome: 'Brigadeiro' },
  { svgId: 'bolo-chocolate', nome: 'Bolo de chocolate' },
  { svgId: 'sorvete', nome: 'Sorvete de creme' },
  { svgId: 'refrigerante', nome: 'Refrigerante comum' },
  { svgId: 'biscoito-recheado', nome: 'Biscoito recheado' },
].map(({ svgId, nome }) => ({ svgId, tipo: 'naoSaudavel', alimento: porNome(nome) }))

export const ITENS_CORRIDA = [...SAUDAVEIS, ...NAO_SAUDAVEIS]

// 50% de chance de cada tipo, depois um item aleatório dentro do tipo sorteado.
export function sortearItem() {
  const lista = Math.random() < 0.5 ? SAUDAVEIS : NAO_SAUDAVEIS
  return lista[Math.floor(Math.random() * lista.length)]
}
