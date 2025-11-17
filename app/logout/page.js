// app/logout/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUsuario } from '@/services/authService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Importe o hook do contexto

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth(); // <-- Pegue a função logout do contexto

  useEffect(() => {
    const fazerLogout = async () => {
      try {
        console.log("Iniciando processo de logout no frontend..."); // Log temporário
        await logoutUsuario(); // Chama a função do serviço para invalidar sessão no backend
        console.log("Logout no backend realizado com sucesso."); // Log temporário

        // Atualize o estado global de autenticação (contexto)
        logout(); // <-- Chama a função do contexto para limpar o estado

        console.log("Estado de autenticação limpo no frontend."); // Log temporário
        toast.success("Você saiu com sucesso.");
        router.push('/login'); // Redireciona para login
      } catch (error) {
        console.error("Erro ao fazer logout no frontend:", error);
        const errorMessage = error.response?.data?.message || "Erro ao fazer logout. Tente novamente.";
        toast.error(errorMessage);
        // Mesmo com erro no backend, limpe o estado local e redirecione
        logout();
        router.push('/login'); // Redireciona para segurança
      }
    };

    fazerLogout();
  }, [router, logout]); // Adicione 'logout' às dependências do useEffect

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-4">Saindo...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}