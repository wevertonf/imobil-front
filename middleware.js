// src/middleware.js
import { NextResponse } from 'next/server';
//import type { NextRequest } from 'next/server';

// Caminhos que NÃO exigem autenticação
const publicPaths = [
  '/',              // Página inicial (pode ser pública ou privada, depende da regra)
  '/login',         // Página de login
  '/cadastro',      // Página de cadastro (se existir)
  // '/api/auth',   // Pastas ou prefixos de API de autenticação, se necessário
  // '/public/**',  // Se tiver uma pasta de arquivos públicos
];

export function middleware(request) {
  // Verificar se o caminho atual é público
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Se NÃO for um caminho público, verificar autenticação
  if (!isPublicPath) {
    // Para sessões baseadas em cookie (como JSESSIONID do Spring Boot)
    const sessionId = request.cookies.get('JSESSIONID'); // Nome do cookie de sessão do Spring/Tomcat

    if (!sessionId) {
      // Não há sessão ativa, redirecionar para login
      // Preserve a URL original (opcional)
      // const requestedUrl = request.url;
      const loginUrl = new URL('/login', request.url);
      // loginUrl.searchParams.set('redirect', requestedUrl);
      return NextResponse.redirect(loginUrl);
    }
    // Se houver JSESSIONID, prosseguir normalmente (backend verifica validade)
  }

  // Permitir acesso (prosseguir para a próxima rota)
  return NextResponse.next();
}

// Configurar para quais caminhos o middleware deve ser aplicado
export const config = {
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // <-- Antigo, muito genérico
  matcher: [
    // Proteger rotas específicas
    '/usuarios/:path*',      // Protege /usuarios e /usuarios/qualquer-coisa
    '/bairros/:path*',       // Protege /bairros e /bairros/qualquer-coisa
    '/tipos-imoveis/:path*', // Protege /tipos-imoveis e /tipos-imoveis/qualquer-coisa
    '/imoveis/:path*',       // Protege /imoveis e /imoveis/qualquer-coisa
    '/dashboard/:path*',     // Protege /dashboard e /dashboard/qualquer-coisa
    // Adicione outras rotas que devem exigir login
    // '/admin/:path*',       // Exemplo: área administrativa
    // '/perfil/:path*',      // Exemplo: perfil do usuário
    /*
     * Opcional: Proteger caminhos genéricos, exceto os públicos
     * '/((?!api|_next/static|_next/image|favicon.ico|login|cadastro|public).*)',
     * Mas o padrão acima é mais explícito e claro.
     */
  ],
};