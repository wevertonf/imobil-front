// app/usuarios/visualizar/[id]/page.js
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserById } from '@/services/usuarioService';
import UsuarioDetalhe from '@/components/usuarios/UsuarioDetalhe';
import { toast } from 'sonner'; // Opcional, mas recomendado para feedbacks

export default function VisualizarUsuarioPage() {
  const { id } = useParams(); // Obtém o ID da URL
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        setError(null); // Limpa erro anterior

        const usuarioData = await getUserById(parseInt(id, 10)); // Converte ID para número

        if (usuarioData) {
          setUsuario(usuarioData);
        } else {
          // Se getUsuarioById retornar null (404), definimos usuario como null
          setUsuario(null);
          setError("Usuário não encontrado.");
          // toast.warning("Usuário não encontrado."); // Opcional: mostrar toast
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes do usuário:", err);
        setError("Erro ao carregar os dados do usuário.");
        // toast.error("Erro ao carregar usuário: " + (err.message || 'Erro desconhecido')); // Opcional: mostrar toast
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Verifica se o ID foi fornecido
      fetchUsuario();
    }
  }, [id]); // Executa quando o ID mudar

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <UsuarioDetalhe usuario={usuario} loading={loading} error={error} />
    </div>
  );
}