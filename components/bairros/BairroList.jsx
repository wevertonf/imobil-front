// components/bairros/BairroList.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllBairros, deleteBairro } from '@/services/bairroService';
import { useAuth } from '@/context/AuthContext'; // Importar o contexto de autenticação
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import { toast } from 'sonner';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';

export default function BairroList() {
  const [bairros, setBairros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth(); // Obter status de login do contexto

  useEffect(() => {
    const fetchBairros = async () => {
      try {
        const data = await getAllBairros();
        setBairros(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar bairros.');
        toast.error("Erro ao carregar bairros: " + (err.message || 'Erro desconhecido'));
        console.error("Erro no componente BairroList:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBairros();
  }, []);

  const handleDelete = (bairro) => {
    if (confirm(`Tem certeza que deseja excluir o bairro "${bairro.nome}" (ID: ${bairro.id})?`)) {
      deleteBairro(bairro.id)
        .then(() => {
          setBairros(bairros.filter(b => b.id !== bairro.id));
          toast.success(`Bairro "${bairro.nome}" excluído com sucesso!`);
        })
        .catch((error) => {
          console.error("Erro ao excluir bairro:", error);
          toast.error("Erro ao excluir bairro: " + (error.response?.data?.message || error.message || 'Erro desconhecido'));
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
      title="Gestão de Bairros"
      description="Visualize, edite e gerencie os bairros cadastrados."
      className="w-full max-w-6xl mx-auto"
      footer={
        usuario && ( // Mostrar botão de criar apenas se estiver logado
          <div className="flex justify-end">
            <Link href="/bairros/criar">
              <StyledButton variant="primary" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Novo Bairro
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CEP Inicial</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CEP Final</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bairros.map((bairro) => (
              <tr key={bairro.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bairro.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bairro.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bairro.cidade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bairro.estado}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bairro.cep_inicial}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bairro.cep_final}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    {/* <Link href={`/bairros/visualizar/${bairro.id}`}>
                      <StyledButton variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </StyledButton>
                    </Link> */}
                    <Link href={`/bairros/editar/${bairro.id}`}>
                      <StyledButton variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </StyledButton>
                    </Link>
                    <StyledButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(bairro)}
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
      {bairros.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum bairro encontrado.</p>
          {usuario && ( // Mostrar botão de criar apenas se estiver logado e não houver bairros
            <Link href="/bairros/criar">
              <StyledButton variant="primary" className="mt-4">
                Cadastrar Primeiro Bairro
              </StyledButton>
            </Link>
          )}
        </div>
      )}
    </StyledCard>
  );
}