// postcss.config.js (NOVO - pode não ser mais necessário)
// Para o Next.js 14+ com Turbopack, a configuração automática geralmente é suficiente. O @tailwindcss/postcss é usado internamente. Se você não tiver um postcss.config.js, não precisa criar um.
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
