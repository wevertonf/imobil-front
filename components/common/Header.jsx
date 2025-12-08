// components/common/Header.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { usuario, isAdmin, isCorretor, isVisitante, carregando, logout } = useAuth();
  const router = useRouter();
  const [pathname, setPathname] = useState(typeof window !== 'undefined' ? window.location.pathname : '');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  const isActive = (path) => pathname === path;

  if (carregando) {
    return (
      <header className="sticky top-0 z-50 bg-slate-900 bg-opacity-80 backdrop-blur-xl border-b border-white border-opacity-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="h-8 w-48 bg-white bg-opacity-10 rounded-lg animate-pulse"></div>
            <div className="flex gap-3">
              <div className="h-10 w-20 bg-white bg-opacity-10 rounded-lg animate-pulse"></div>
              <div className="h-10 w-20 bg-white bg-opacity-10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900 bg-opacity-80 backdrop-blur-xl border-b border-white border-opacity-10 shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/imoveis" className="group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500 shadow-opacity-30 group-hover:shadow-xl group-hover:shadow-purple-500 group-hover:shadow-opacity-40 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Laion Imobiliária
              </h1>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {usuario ? (
              <>
                {/* Links de navegação */}
                <div className="hidden md:flex items-center gap-2">
                  {(isAdmin() || isCorretor()) && (
                    <>
                      <Link href="/imoveis">
                        <button 
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive('/imoveis')
                              ? 'bg-gray bg-opacity-20 text-white border-white border-opacity-30'
                              : 'text-white opacity-70 hover:opacity-100 hover:bg-gray hover:bg-opacity-10'
                          }`}
                        >
                          Imóveis
                        </button>
                      </Link>

                      {(usuario.tipo === 'ADMIN' || usuario.tipo === 'CORRETOR') && (
                        <Link href="/imoveis/meus">
                          <button 
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              isActive('/imoveis/meus')
                                ? 'bg-black bg-opacity-20 text-white border border-white border-opacity-30'
                                : 'text-white opacity-70 hover:opacity-100 hover:bg-gray hover:bg-opacity-10'
                            }`}
                          >
                            Meus Imóveis
                          </button>
                        </Link>
                      )}
                    </>
                  )}

                  {isAdmin() && (
                    <>
                      <Link href="/bairros">
                        <button 
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive('/bairros')
                              ? 'bg-black bg-opacity-20 text-white border border-white border-opacity-30'
                              : 'text-white opacity-70 hover:opacity-100 hover:bg-gray hover:bg-opacity-10'
                          }`}
                        >
                          Bairros
                        </button>
                      </Link>

                      <Link href="/tipos-imoveis">
                        <button 
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive('/tipos-imoveis')
                              ? 'bg-black bg-opacity-20 text-white border border-white border-opacity-30'
                              : 'text-white opacity-70 hover:opacity-100 hover:bg-gray hover:bg-opacity-10'
                          }`}
                        >
                          Tipos
                        </button>
                      </Link>

                      <Link href="/usuarios">
                        <button 
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive('/usuarios')
                              ? 'bg-black bg-opacity-20 text-white border border-white border-opacity-30'
                              : 'text-white opacity-70 hover:opacity-100 hover:bg-gray hover:bg-opacity-10'
                          }`}
                        >
                          Usuários
                        </button>
                      </Link>
                    </>
                  )}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white border-opacity-20">
                  <div className="hidden sm:flex flex-col items-center">
                    <span className="text-sm text-white font-medium">Olá, {usuario.nome}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      {usuario.tipo}
                    </span>
                  </div>
                  
                  <Link href="/logout">
                    <button className="px-4 py-2 bg-gray bg-opacity-10 hover:bg-opacity-20 text-white border-white border-opacity-30 rounded-xl text-sm font-medium transition-all hover:shadow-lg">
                      Sair
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              // Botão de Login quando não está logado
              <Link href="/login">
                <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-500 shadow-opacity-30 hover:shadow-xl hover:shadow-purple-500 hover:shadow-opacity-40">
                  Entrar
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}