// components/imoveis/ImoveisList.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllImoveis, deleteImovel } from '@/services/imoveisService';
import { useAuth } from '@/context/AuthContext'; // Importar o contexto de autenticação
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import { toast } from 'sonner';
import { Plus, Edit, Eye, Trash2, Home, MapPin, DollarSign, Bed, Bath, Car } from 'lucide-react';

export default function ImoveisList() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth(); // Obter status de login do contexto

  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const data = await getAllImoveis();
        setImoveis(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar imóveis.');
        toast.error("Erro ao carregar imóveis: " + (err.message || 'Erro desconhecido'));
        console.error("Erro no componente ImoveisList:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImoveis();
  }, []);

  const handleDelete = (imovel) => {
    if (confirm(`Tem certeza que deseja excluir o imóvel "${imovel.titulo}" (ID: ${imovel.id})?`)) {
      deleteImovel(imovel.id)
        .then(() => {
          setImoveis(imoveis.filter(i => i.id !== imovel.id));
          toast.success(`Imóvel "${imovel.titulo}" excluído com sucesso!`);
        })
        .catch((error) => {
          console.error("Erro ao excluir imóvel:", error);
          toast.error("Erro ao excluir imóvel: " + (error.response?.data?.message || error.message || 'Erro desconhecido'));
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
      title="Gestão de Imóveis"
      description="Visualize, edite e gerencie os imóveis cadastrados no sistema."
      className="w-full max-w-6xl mx-auto"
      footer={
        usuario && ( // Mostrar botão de criar apenas se estiver logado
          <div className="flex justify-end">
            <Link href="/imoveis/criar">
              <StyledButton variant="primary" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Novo Imóvel
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bairro</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Venda</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Aluguel</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {imoveis.map((imovel) => (
              <tr key={imovel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{imovel.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold max-w-xs truncate">{imovel.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {imovel.bairro ? `${imovel.bairro.nome}, ${imovel.bairro.cidade}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {imovel.tipoImovel ? imovel.tipoImovel.nome : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {imovel.preco_venda ? `R$ ${imovel.preco_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {imovel.preco_aluguel ? `R$ ${imovel.preco_aluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/imoveis/visualizar/${imovel.id}`}>
                      <StyledButton variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </StyledButton>
                    </Link>
                    {/* Permitir edição apenas para o proprietário ou admin */}
                    {usuario && (imovel.usuario?.id === usuario.id || usuario.tipo === 'ADMIN') && (
                      <Link href={`/imoveis/editar/${imovel.id}`}>
                        <StyledButton variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Edit className="h-4 w-4 mr-1" /> Editar
                        </StyledButton>
                      </Link>
                    )}
                    {usuario && (imovel.usuario?.id === usuario.id || usuario.tipo === 'ADMIN') && (
                      <StyledButton
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(imovel)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Excluir
                      </StyledButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {imoveis.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum imóvel encontrado.</p>
          {usuario && ( // Mostrar botão de criar apenas se estiver logado e não houver imóveis
            <Link href="/imoveis/criar">
              <StyledButton variant="primary" className="mt-4">
                Cadastrar Primeiro Imóvel
              </StyledButton>
            </Link>
          )}
        </div>
      )}
    </StyledCard>
  );
}