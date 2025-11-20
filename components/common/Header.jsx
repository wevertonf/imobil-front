// components/common/Header.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // Importe o hook do contexto

export default function Header() {
  const { usuario, isAdmin, isCorretor, isVisitante, carregando, logout } = useAuth();
  const router = useRouter();
  const [pathname, setPathname] = useState(typeof window !== 'undefined' ? window.location.pathname : '');

  useEffect(() => {
    // Atualiza o pathname quando a página carrega (para o highlight do menu)
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  const isActive = (path) => pathname === path;

  if (carregando) {
    // Pode retornar um skeleton ou simplesmente não renderizar o header enquanto carrega
    return (
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-xl font-bold">Imobiliaria Web</h1>
          </Link>
          <div className="flex space-x-4">
            <div className="h-10 w-20 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold">Imobiliaria Web</h1>
        </Link>
        <div className="flex space-x-4 items-center">
          {usuario ? ( // Se estiver logado
            <>
              {/* Links baseados no tipo de usuário */}
              {isAdmin() && (
                <>
                  <Link href="/usuarios">
                    <Button variant={isActive('/usuarios') ? 'secondary' : 'ghost'} size="sm" className="text-white hover:text-white hover:opacity-90">
                      Usuários
                    </Button>
                  </Link>
                  <Link href="/tipos-imoveis">
                    <Button variant={isActive('/tipos-imoveis') ? 'secondary' : 'ghost'} size="sm" className="text-white hover:text-white hover:opacity-90">
                      Tipos de Imóveis
                    </Button>
                  </Link>
                  <Link href="/bairros">
                    <Button variant={isActive('/bairros') ? 'secondary' : 'ghost'} size="sm" className="text-white hover:text-white hover:opacity-90">
                      Bairros
                    </Button>
                  </Link>
                </>
              )}
              {(isAdmin() || isCorretor()) && ( // Links para admin e corretor
                <>
                  <Link href="/imoveis">
                    <Button variant={isActive('/imoveis') ? 'secondary' : 'ghost'} size="sm" className="text-white hover:text-white hover:opacity-90">
                      Imóveis
                    </Button>
                  </Link>
                  {/* Corretor pode ver seus próprios imóveis */}
                  {(usuario.tipo === 'ADMIN' || usuario.tipo === 'CORRETOR') && ( // Mostrar apenas para admin ou corretor
                    <Link href="/imoveis/meus">
                      <Button variant={isActive('/imoveis/meus') ? 'secondary' : 'ghost'} size="sm" className="text-white hover:text-white hover:opacity-90">
                        Meus Imóveis
                      </Button>
                    </Link>
                  )}
                </>
              )}
              <div className="ml-4 flex items-center space-x-2">
                <span className="text-sm hidden sm:inline">Olá, {usuario.nome}</span>
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">{usuario.tipo}</span>
                <Link href="/logout">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                    Sair
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            // Se NÃO estiver logado, mostrar botão de login
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}