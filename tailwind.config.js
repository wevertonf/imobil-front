/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Caminhos para App Router
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Mantenha este também se tiver páginas antigas
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Se você tiver outras pastas com código JSX/TSX que usa Tailwind
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
