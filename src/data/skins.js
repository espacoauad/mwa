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
  joguinho: { sementes: 10, label: 'Joguinho: 300+ pontos' },
  jogo_avatar: { sementes: 10, label: 'Jogo das Escolhas: 300+ pontos' },
  hall_fama: { sementes: 25, label: 'Estrela no Hall da Fama' },
  indicacao: { sementes: 20, label: 'Indicou uma amiga (até 3x/dia)' },
  jogo_treino: { sementes: 10, label: 'Jogo do Treino: 300+ pontos' },
  jogo_mente: { sementes: 15, label: 'Jardim de Afirmações completo' },
  jogo_restaurante: { sementes: 10, label: 'Restaurante Saudável: 300+ pontos' },
}

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
]

export const MOLDURAS = [
  { id: 'nenhuma', nome: 'Simples', preco: 0, classe: 'ring-2 ring-cinza' },
  { id: 'folhas', nome: 'Folhagem', preco: 50, classe: 'ring-4 ring-sage', decor: '🌿' },
  { id: 'flor', nome: 'Florada', preco: 80, classe: 'ring-4 ring-pink-300', decor: '🌸' },
  { id: 'estrela', nome: 'Estrelada', preco: 120, classe: 'ring-4 ring-amber-300', decor: '⭐' },
  { id: 'coroa', nome: 'Coroa', preco: 200, classe: 'ring-4 ring-ouro', decor: '👑' },
  { id: 'diamante', nome: 'Diamante', preco: 350, classe: 'ring-4 ring-cyan-300', decor: '💎' },
]

export const CATALOGO = { personagem: PERSONAGENS, fundo: FUNDOS, moldura: MOLDURAS }

export function itemPorId(categoria, id) {
  return CATALOGO[categoria].find((s) => s.id === id) ?? CATALOGO[categoria][0]
}
