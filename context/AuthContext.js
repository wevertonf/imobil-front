// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { getStatusUsuario } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const response = await getStatusUsuario();
        if (response.data.logado) {
          setUsuario(response.data.usuario);
        } else {
          setUsuario(null);
        }
      } catch (error) {
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarLogin();
  }, []);

  const login = (userData) => {
    setUsuario(userData);
  };

  const logout = () => {
    setUsuario(null);
  };

  // Retorna apenas os estados e funções básicas para o Provider
  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// O hook useAuth retorna os valores do contexto e adiciona as funções auxiliares
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Funções auxiliares definidas dentro do hook, usando o 'context' atual
  const isAdmin = () => context.usuario?.tipo === 'ADMIN';
  const isCorretor = () => context.usuario?.tipo === 'CORRETOR';
  const isVisitante = () => context.usuario === null;

  // Retorna o contexto original + as funções auxiliares
  return { ...context, isAdmin, isCorretor, isVisitante };
};