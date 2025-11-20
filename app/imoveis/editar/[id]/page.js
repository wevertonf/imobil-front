// app/imoveis/editar/[id]/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Importar o contexto
import { getImovelById } from '@/services/imoveisService';
import ImoveisForm from '@/components/imoveis/ImoveisForm';
import { toast } from 'sonner';

export default function EditarImovelPage() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario: usuarioLogado } = useAuth(); // Pegar usuário logado
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissaoNegada, setPermissaoNegada] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!usuarioLogado) {
      toast.info("Faça login para acessar esta página.");
      router.push('/login');
      return;
    }

    const fetchImovel = async () => {
      try {
        const data = await getImovelById(parseInt(id, 10));
        if (data) {
          // Verificar se o usuário logado é o proprietário ou admin
          if (usuarioLogado.tipo !== 'ADMIN' && data.usuario?.id !== usuarioLogado.id) {
            setPermissaoNegada(true);
            toast.error("Você não tem permissão para editar este imóvel.");
            return;
          }
          setImovel(data);
        } else {
          toast.error("Imóvel não encontrado.");
          router.push('/imoveis');
        }
      } catch (error) {
        console.error("Erro ao carregar imóvel para edição:", error);
        toast.error("Erro ao carregar imóvel.");
        router.push('/imoveis');
      } finally {
        setLoading(false);
      }
    };

    if (id && usuarioLogado) {
      fetchImovel();
    }
  }, [id, usuarioLogado, router]);

  if (loading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  if (permissaoNegada) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 font-semibold">Acesso negado.</p>
        <p>Você não tem permissão para editar este imóvel.</p>
        <button
          onClick={() => router.push('/imoveis')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  if (!imovel) {
    return <div className="p-4 text-center">Imóvel não encontrado.</div>;
  }

  // Renderizar o formulário apenas se tiver permissão
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <ImoveisForm imovel={imovel} /> {/* Passar o imóvel carregado */}
    </div>
  );
}