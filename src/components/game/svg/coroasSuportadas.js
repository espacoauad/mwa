// Lista dos coroaId aceitos pelo desenho de <Coroa> em PlantaFazenda.jsx.
// Vive num arquivo .js puro (não .jsx) para poder ser importada por
// src/data/farm/integridade.test.js, que roda sob `node --test` sem
// transform de JSX — importar um .jsx diretamente quebra com
// ERR_UNKNOWN_FILE_EXTENSION nesse contexto.
//
// Mantida em sincronia manual com os `case` labels do switch em
// PlantaFazenda.jsx: qualquer coroaId aqui precisa ter um `case`
// correspondente lá, e vice-versa.
export const COROAS_SUPORTADAS = ['tomate', 'flor-azul', 'girassol', 'lavanda', 'trigo', 'milho', 'erva', 'laranjeira']
