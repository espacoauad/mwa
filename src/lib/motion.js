// Variantes de movimento compartilhadas (framer-motion) para entradas em stagger.
//
// Uso:
//   <motion.div variants={containerEntrada} initial={reduzido ? false : 'oculto'} animate="visivel">
//     <motion.div variants={itemEntrada}>...</motion.div>
//   </motion.div>
//
// `reduzido` deve vir de `useReducedMotion()` (framer-motion) — passar
// `initial={false}` no container faz os filhos montarem direto no estado
// "visivel", sem animação de entrada.

export const containerEntrada = {
  oculto: {},
  visivel: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

export const itemEntrada = {
  oculto: { opacity: 0, y: 16 },
  visivel: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
  },
}
