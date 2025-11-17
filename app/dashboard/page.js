// app/dashboard/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStatusUsuario } from '@/services/authService'; // Importe a função
import { toast } from 'sonner'; // Se estiver usando

export default function DashboardPage() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const response = await getStatusUsuario();
        setUsuario(response.data);
      } catch (error) {
        // Se o status for 401 (não autorizado), o usuário não está logado
        if (error.response?.status === 401) {
          toast.info("Faça login para acessar esta página.");
          router.push('/login');
        } else {
          console.error("Erro ao verificar status de login:", error);
          toast.error("Erro ao verificar status. Tente novamente.");
          router.push('/login'); // Redirecionar como precaução
        }
      } finally {
        setLoading(false);
      }
    };

    verificarLogin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!usuario) {
    // O redirect já foi feito pelo useEffect, mas é bom ter um fallback
    return <div>Verificando login...</div>;
  }

  // Conteúdo da página do dashboard
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Bem-vindo, {usuario.nome}!</h1>
      {/* ... resto do conteúdo ... */}
    </div>
  );
}