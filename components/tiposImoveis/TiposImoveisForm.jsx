// components/tiposImoveis/TiposImoveisForm.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTipoImovelById, createTipoImovel, updateTipoImovel } from '@/services/tiposImoveisService';
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import StyledInput from '@/components/ui/StyledInput';
import { toast } from 'sonner';

export default function TiposImoveisForm({ tipoId }) { // tipoId é passado se for edição
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (tipoId) {
      // Modo de edição: buscar dados do tipo
      const fetchTipo = async () => {
        try {
          setLoading(true);
          const tipo = await getTipoImovelById(tipoId);
          if (tipo) {
            setFormData({
              nome: tipo.nome || '',
              descricao: tipo.descricao || '',
            });
          } else {
            toast.error("Tipo de imóvel não encontrado.");
            router.push('/tipos-imoveis'); // Redireciona se não encontrar
          }
        } catch (err) {
          setError('Erro ao carregar dados do tipo de imóvel.');
          toast.error("Erro ao carregar dados do tipo: " + (err.message || 'Erro desconhecido'));
          console.error("Erro ao buscar tipo de imóvel:", err);
          router.push('/tipos-imoveis'); // Redireciona em caso de erro
        } finally {
          setLoading(false);
        }
      };

      fetchTipo();
    }
  }, [tipoId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tipoId) {
        // Modo de atualização
        await updateTipoImovel(tipoId, formData);
        toast.success('Tipo de imóvel atualizado com sucesso!', {
          position: 'top-center',
        });
      } else {
        // Modo de criação
        await createTipoImovel(formData);
        toast.success('Tipo de imóvel criado com sucesso!', {
          position: 'top-center',
        });
      }
      router.push('/tipos-imoveis');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar tipo de imóvel.';
      setError(errorMsg);
      toast.error("Erro: " + errorMsg, {
        position: 'top-center',
      });
      console.error("Erro ao salvar tipo de imóvel:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && tipoId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <StyledCard
      title={tipoId ? 'Editar Tipo de Imóvel' : 'Cadastrar Novo Tipo de Imóvel'}
      description={tipoId
        ? 'Altere as informações do tipo de imóvel abaixo.'
        : 'Preencha os dados para cadastrar um novo tipo de imóvel no sistema.'}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mensagem de Erro Global */}
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-medium">Erro:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <StyledInput
            label="Nome *"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome do tipo (ex: Apartamento)"
            required
          />

          <div className="space-y-2">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descrição detalhada do tipo de imóvel (opcional)"
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <StyledButton
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {tipoId ? 'Atualizando...' : 'Cadastrando...'}
              </>
            ) : (
              tipoId ? 'Atualizar Tipo' : 'Cadastrar Tipo'
            )}
          </StyledButton>
          <Link href="/tipos-imoveis">
            <StyledButton
              variant="outline"
              type="button"
              className="w-full sm:w-auto"
            >
              Cancelar
            </StyledButton>
          </Link>
        </div>
      </form>
    </StyledCard>
  );
}