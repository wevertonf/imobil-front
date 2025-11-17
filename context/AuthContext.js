// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { getStatusUsuario } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Verificar status de login ao montar o provedor (quando o app inicia ou o provedor é reinserido)
    const verificarLogin = async () => {
      try {
        const response = await getStatusUsuario();
        // getStatusUsuario agora deve retornar { usuario: {...}, logado: true/false }
        if (response.data.logado) {
          setUsuario(response.data.usuario);
        } else {
          setUsuario(null);
        }
      } catch (error) {
        // Se der 401 ou outro erro, assume que não está logado
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarLogin();
  }, []);

  // Função para atualizar o estado após login bem-sucedido
  const login = (userData) => {
    setUsuario(userData);
  };

  // Função para atualizar o estado após logout
  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};