// components/tiposImoveis/TiposImoveisList.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllTiposImoveis, deleteTipoImovel } from '@/services/tiposImoveisService';
import { useAuth } from '@/context/AuthContext'; // Importar o contexto de autenticação
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import { toast } from 'sonner';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';

export default function TiposImoveisList() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth(); // Obter status de login do contexto

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const data = await getAllTiposImoveis();
        setTipos(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar tipos de imóveis.');
        toast.error("Erro ao carregar tipos de imóveis: " + (err.message || 'Erro desconhecido'));
        console.error("Erro no componente TiposImoveisList:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  const handleDelete = (tipo) => {
    if (confirm(`Tem certeza que deseja excluir o tipo "${tipo.nome}" (ID: ${tipo.id})?`)) {
      deleteTipoImovel(tipo.id)
        .then(() => {
          setTipos(tipos.filter(t => t.id !== tipo.id));
          toast.success(`Tipo "${tipo.nome}" excluído com sucesso!`);
        })
        .catch((error) => {
          console.error("Erro ao excluir tipo de imóvel:", error);
          toast.error("Erro ao excluir tipo: " + (error.response?.data?.message || error.message || 'Erro desconhecido'));
        });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Erro: {error}
      </div>
    );
  }

  return (
    <StyledCard
      title="Gestão de Tipos de Imóveis"
      description="Visualize, edite e gerencie os tipos de imóveis cadastrados."
      className="w-full max-w-4xl mx-auto"
      footer={
        usuario && ( // Mostrar botão de criar apenas se estiver logado
          <div className="flex justify-end">
            <Link href="/tipos-imoveis/criar">
              <StyledButton variant="primary" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Novo Tipo
              </StyledButton>
            </Link>
          </div>
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tipos.map((tipo) => (
              <tr key={tipo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tipo.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{tipo.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{tipo.descricao || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    {/* <Link href={`/tipos-imoveis/visualizar/${tipo.id}`}>
                      <StyledButton variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </StyledButton>
                    </Link> */}
                    <Link href={`/tipos-imoveis/editar/${tipo.id}`}>
                      <StyledButton variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </StyledButton>
                    </Link>
                    <StyledButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(tipo)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </StyledButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tipos.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum tipo de imóvel encontrado.</p>
          {usuario && ( // Mostrar botão de criar apenas se estiver logado e não houver tipos
            <Link href="/tipos-imoveis/criar">
              <StyledButton variant="primary" className="mt-4">
                Cadastrar Primeiro Tipo
              </StyledButton>
            </Link>
          )}
        </div>
      )}
    </StyledCard>
  );
}