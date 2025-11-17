// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils'; // helper
import Header from '@/components/common/Header'; // Importe o Header
//import { AuthProvider } from '@/context/AuthContext'; // Importe o provedor de autenticação
import AuthProviderWrapper from '@/components/providers/AuthProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Imobiliaria Web',
  description: 'Sistema de gerenciamento de imóveis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <AuthProviderWrapper>
          <div className="relative flex min-h-screen flex-col bg-background">
            <Header /> {/* Agora o Header pode usar useAuth */}
            <div className="flex-1">{children}</div>
          </div>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}