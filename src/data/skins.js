// Gamificação MWA — catálogo de skins e tabela de recompensas em Sementes 🌱

// Quanto cada tarefa vale (as refs evitam ganhar 2x pela mesma tarefa)
export const RECOMPENSAS = {
  boas_vindas: { sementes: 50, label: 'Bem-vinda ao programa' },
  refeicao: { sementes: 5, label: 'Refeição registrada' },
  agua: { sementes: 10, label: 'Meta de água batida' },
  exercicio: { sementes: 10, label: 'Exercício registrado' },
  dica: { sementes: 10, label: 'Dica do dia lida' },
  pesagem: { sementes: 30, label: 'Pesagem semanal feita' },
  divulgacao: { sementes: 15, label: 'Compartilhou o app' },
  joguinho: { sementes: 10, label: 'Jogo da Colheita: 300+ pontos' },
  hall_fama: { sementes: 25, label: 'Estrela no Hall da Fama' },
  indicacao: { sementes: 20, label: 'Indicou uma amiga (até 3x/dia)' },
  jogo_prato: { sementes: 10, label: 'Monte Seu Prato: missão concluída' },
  jogo_vf: { sementes: 10, label: 'Verdadeiro, Falso ou Depende: rodada concluída' },
  jogo_troca: { sementes: 10, label: 'Troca Inteligente: rodada concluída' },
  jogo_saciedade: { sementes: 10, label: 'Batalha da Saciedade: rodada concluída' },
  jogo_rotulos: { sementes: 10, label: 'Detetive dos Rótulos: rodada concluída' },
  estrela_dia: { sementes: 5, label: 'Estrela do dia conquistada' },
  constelacao: { sementes: 25, label: 'Constelação da semana completa' },
  momento_mwa: { sementes: 5, label: 'Momento MWA do dia' },
}

// Coleção Elegante: linha premium de objetivo longo, ao lado das skins originais.
// Marcadas com `elegante` para a loja poder agrupá-las.
// IMPORTANTE: o primeiro item de cada lista é o padrão gratuito e o fallback de
// itemPorId() — a Coleção Elegante entra no fim, nunca no topo.
export const PERSONAGENS = [
  { id: 'borboleta', emoji: '🦋', nome: 'Borboleta', preco: 0 },
  { id: 'joaninha', emoji: '🐞', nome: 'Joaninha', preco: 40 },
  { id: 'abelha', emoji: '🐝', nome: 'Abelhinha', preco: 40 },
  { id: 'passarinho', emoji: '🐦', nome: 'Passarinho', preco: 60 },
  { id: 'coelha', emoji: '🐰', nome: 'Coelhinha', preco: 80 },
  { id: 'raposa', emoji: '🦊', nome: 'Raposa', preco: 100 },
  { id: 'coruja', emoji: '🦉', nome: 'Coruja Sábia', preco: 120 },
  { id: 'panda', emoji: '🐼', nome: 'Panda', preco: 150 },
  { id: 'flamingo', emoji: '🦩', nome: 'Flamingo', preco: 180 },
  { id: 'unicornio', emoji: '🦄', nome: 'Unicórnio', preco: 250 },
  { id: 'pavao', emoji: '🦚', nome: 'Pavão Real', preco: 300 },
  { id: 'gato-persa', emoji: '🐱', nome: 'Gatinho Persa', preco: 400 },
  // Coleção Elegante — linha premium, objetivo de longo prazo
  { id: 'garca', emoji: '🕊️', nome: 'Garça Real', preco: 500, elegante: true },
  { id: 'cisne', emoji: '🦢', nome: 'Cisne', preco: 550, elegante: true },
  { id: 'leoa', emoji: '🦁', nome: 'Leoa', preco: 600, elegante: true },
  { id: 'beija-flor', emoji: '🕊', nome: 'Beija-flor Dourado', preco: 650, elegante: true },
  { id: 'siamesa', emoji: '🐈', nome: 'Gata Siamesa', preco: 700, elegante: true },
  { id: 'fenix', emoji: '🔥', nome: 'Fênix', preco: 900, elegante: true },
]

export const FUNDOS = [
  { id: 'creme', nome: 'Creme', preco: 0, css: 'linear-gradient(135deg, #F5F1E8, #E8E4DC)' },
  { id: 'sage', nome: 'Jardim', preco: 30, css: 'linear-gradient(135deg, #DCE5C8, #879B55)' },
  { id: 'ceu', nome: 'Céu', preco: 50, css: 'linear-gradient(135deg, #DCEFF5, #7FB6C9)' },
  { id: 'lavanda', nome: 'Lavanda', preco: 70, css: 'linear-gradient(135deg, #EDE4F5, #B49BD6)' },
  { id: 'rosa', nome: 'Rosé', preco: 90, css: 'linear-gradient(135deg, #F9E3E3, #E8A0A8)' },
  { id: 'por-do-sol', nome: 'Pôr do Sol', preco: 120, css: 'linear-gradient(135deg, #F7D9B0, #E58F65)' },
  { id: 'oceano', nome: 'Oceano', preco: 150, css: 'linear-gradient(135deg, #B8E0DD, #3E8E8B)' },
  { id: 'floresta', nome: 'Floresta', preco: 180, css: 'linear-gradient(135deg, #879B55, #344528)' },
  { id: 'dourado', nome: 'Dourado Real', preco: 250, css: 'linear-gradient(135deg, #F3E5C8, #D4AF7A)' },
  { id: 'noite', nome: 'Noite Estrelada', preco: 300, css: 'linear-gradient(135deg, #3D4663, #131A33)' },
  // Coleção Elegante
  { id: 'marmore', nome: 'Mármore', preco: 400, css: 'linear-gradient(135deg, #F7F5F0, #D9D5CC)', elegante: true },
  { id: 'champagne', nome: 'Champagne', preco: 500, css: 'linear-gradient(135deg, #F6E9D2, #C9A15C)', elegante: true },
  { id: 'jardim-noturno', nome: 'Jardim Noturno', preco: 650, css: 'linear-gradient(135deg, #2E3B23, #0F1508)', elegante: true },
]

export const MOLDURAS = [
  { id: 'nenhuma', nome: 'Simples', preco: 0, classe: 'ring-2 ring-cinza' },
  { id: 'folhas', nome: 'Folhagem', preco: 50, classe: 'ring-4 ring-sage', decor: '🌿' },
  { id: 'flor', nome: 'Florada', preco: 80, classe: 'ring-4 ring-pink-300', decor: '🌸' },
  { id: 'estrela', nome: 'Estrelada', preco: 120, classe: 'ring-4 ring-amber-300', decor: '⭐' },
  { id: 'coroa', nome: 'Coroa', preco: 200, classe: 'ring-4 ring-ouro', decor: '👑' },
  { id: 'diamante', nome: 'Diamante', preco: 350, classe: 'ring-4 ring-cyan-300', decor: '💎' },
  // Coleção Elegante
  { id: 'ouro-escovado', nome: 'Ouro Escovado', preco: 450, classe: 'ring-4 ring-ouro', elegante: true },
  { id: 'esmeralda', nome: 'Esmeralda', preco: 600, classe: 'ring-4 ring-emerald-600', elegante: true },
]

export const CATALOGO = { personagem: PERSONAGENS, fundo: FUNDOS, moldura: MOLDURAS }

export function itemPorId(categoria, id) {
  return CATALOGO[categoria].find((s) => s.id === id) ?? CATALOGO[categoria][0]
}
