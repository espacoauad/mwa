// Lista dos ids de bichinhos aceitos pelo objeto ANIMAIS em
// AnimalFazendaSvg.jsx. Vive num arquivo .js puro (não .jsx) para poder ser
// importada por src/data/farm/integridade.test.js, que roda sob
// `node --test` sem transform de JSX — importar um .jsx diretamente quebra
// com ERR_UNKNOWN_FILE_EXTENSION nesse contexto.
//
// Mantida em sincronia manual com as chaves do objeto ANIMAIS em
// AnimalFazendaSvg.jsx: qualquer id aqui precisa ter um componente
// correspondente lá, e vice-versa.
export const IDS_ANIMAIS = ['galinha', 'coelho', 'abelha', 'borboleta', 'vaquinha']
