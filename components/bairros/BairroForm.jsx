// components/bairros/BairroForm.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBairroById, createBairro, updateBairro } from '@/services/bairroService';
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import StyledInput from '@/components/ui/StyledInput';
import { toast } from 'sonner';

export default function BairroForm({ bairroId }) { // bairroId é passado se for edição
  const [formData, setFormData] = useState({
    nome: '',
    cidade: '',
    estado: '',
    cep_inicial: '',
    cep_final: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (bairroId) {
      // Modo de edição: buscar dados do bairro
      const fetchBairro = async () => {
        try {
          setLoading(true);
          const bairro = await getBairroById(bairroId);
          if (bairro) {
            setFormData({
              nome: bairro.nome || '',
              cidade: bairro.cidade || '',
              estado: bairro.estado || '',
              cep_inicial: bairro.cep_inicial || '',
              cep_final: bairro.cep_final || '',
            });
          } else {
            toast.error("Bairro não encontrado.");
            router.push('/bairros'); // Redireciona se não encontrar
          }
        } catch (err) {
          setError('Erro ao carregar dados do bairro.');
          toast.error("Erro ao carregar dados do bairro: " + (err.message || 'Erro desconhecido'));
          console.error("Erro ao buscar bairro:", err);
          router.push('/bairros'); // Redireciona em caso de erro
        } finally {
          setLoading(false);
        }
      };

      fetchBairro();
    }
  }, [bairroId, router]);

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
      if (bairroId) {
        // Modo de atualização
        await updateBairro(bairroId, formData);
        toast.success('Bairro atualizado com sucesso!', {
          position: 'top-center',
        });
      } else {
        // Modo de criação
        await createBairro(formData);
        toast.success('Bairro criado com sucesso!', {
          position: 'top-center',
        });
      }
      router.push('/bairros');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar bairro.';
      setError(errorMsg);
      toast.error("Erro: " + errorMsg, {
        position: 'top-center',
      });
      console.error("Erro ao salvar bairro:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && bairroId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <StyledCard
      title={bairroId ? 'Editar Bairro' : 'Cadastrar Novo Bairro'}
      description={bairroId
        ? 'Altere as informações do bairro abaixo.'
        : 'Preencha os dados para cadastrar um novo bairro no sistema.'}
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
            placeholder="Nome do bairro"
            required
          />

          <StyledInput
            label="Cidade *"
            id="cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            placeholder="Cidade"
            required
          />

          <StyledInput
            label="Estado *"
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            placeholder="UF (SP, RJ, etc.)"
            required
            maxLength={2}
            className="uppercase"
          />

          <StyledInput
            label="CEP Inicial"
            id="cep_inicial"
            name="cep_inicial"
            value={formData.cep_inicial}
            onChange={handleChange}
            placeholder="00000-000"
            pattern="\d{5}-?\d{3}"
          />

          <StyledInput
            label="CEP Final"
            id="cep_final"
            name="cep_final"
            value={formData.cep_final}
            onChange={handleChange}
            placeholder="00000-999"
            pattern="\d{5}-?\d{3}"
          />
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
                {bairroId ? 'Atualizando...' : 'Cadastrando...'}
              </>
            ) : (
              bairroId ? 'Atualizar Bairro' : 'Cadastrar Bairro'
            )}
          </StyledButton>
          <Link href="/bairros">
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