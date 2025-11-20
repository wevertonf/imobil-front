// components/imoveis/ImoveisForm.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getImovelById, createImovel, updateImovel } from '@/services/imoveisService';
import { getAllTiposImoveis } from '@/services/tiposImoveisService';
import { getAllBairros } from '@/services/bairroService';
import { useAuth } from '@/context/AuthContext'; // Para obter o ID do usuário logado
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import StyledInput from '@/components/ui/StyledInput';
import { toast } from 'sonner';

export default function ImoveisForm({ imovelId }) { // imovelId é passado se for edição
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco_venda: null,
    preco_aluguel: null,
    finalidade: 'VENDA_E_ALUGUEL', // Valor padrão
    status: 'DISPONIVEL',         // Valor padrão
    dormitorios: 0,
    banheiros: 0,
    garagem: 0,
    area_total: null,
    area_construida: null,
    endereco: '',
    numero: '',
    complemento: '',
    cep: '',
    caracteristicas: '',
    destaque: false,

    // IDs para relacionamentos
    tipoImovelId: null,
    bairroId: null,
    // usuarioId: será preenchido automaticamente com o ID do usuário logado
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [podeEditar, setPodeEditar] = useState(true); // Estado para controlar permissão de edição
  const { usuario: usuarioLogado } = useAuth();
  const [tiposImoveis, setTiposImoveis] = useState([]);
  const [bairros, setBairros] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Carregar tipos e bairros
    const fetchTiposEBairros = async () => {
      try {
        const [tipos, bairros] = await Promise.all([
          getAllTiposImoveis(),
          getAllBairros()
        ]);
        setTiposImoveis(tipos);
        setBairros(bairros);
      } catch (err) {
        setError('Erro ao carregar tipos ou bairros.');
        toast.error("Erro ao carregar dados necessários: " + (err.message || 'Erro desconhecido'));
        console.error("Erro ao carregar tipos/bairros:", err);
      }
    };

    fetchTiposEBairros();

    if (imovelId) {
      // Modo de edição: buscar dados do imóvel
      const fetchImovel = async () => {
        try {
          setLoading(true);
          setError(null);
          setPodeEditar(true); // Reiniciar permissão ao tentar carregar
          const data = await getImovelById(imovelId);
          if (data) {
            // Verificar se o usuário logado pode editar este imóvel
            if (usuarioLogado.tipo !== 'ADMIN' && data.id_usuario !== usuarioLogado.id) {
              setError("Você não tem permissão para editar este imóvel.");
              setPodeEditar(false); // Estado para desabilitar campos/botões
              toast.error("Você não tem permissão para editar este imóvel.");
              // Opcional: redirecionar
              // router.push('/imoveis');
              return;
            }
            setFormData({
              titulo: data.titulo || '',
              descricao: data.descricao || '',
              preco_venda: data.preco_venda || null,
              preco_aluguel: data.preco_aluguel || null,
              finalidade: data.finalidade || 'VENDA_E_ALUGUEL',
              status: data.status || 'DISPONIVEL',
              dormitorios: data.dormitorios || 0,
              banheiros: data.banheiros || 0,
              garagem: data.garagem || 0,
              area_total: data.area_total || null,
              area_construida: data.area_construida || null,
              endereco: data.endereco || '',
              numero: data.numero || '',
              complemento: data.complemento || '',
              cep: data.cep || '',
              caracteristicas: data.caracteristicas || '',
              destaque: data.destaque || false,
              // IDs para relacionamentos
              tipoImovelId: data.id_tipo_imovel || null,
              bairroId: data.id_bairro || null,
              // usuarioId: data.id_usuario || null, // Pode não ser editável
            });
          } else {
            toast.error("Imóvel não encontrado.");
            router.push('/imoveis'); // Redireciona se não encontrar
          }
        } catch (err) {
          setError('Erro ao carregar dados do imóvel.');
          toast.error("Erro ao carregar dados do imóvel: " + (err.message || 'Erro desconhecido'));
          console.error("Erro ao buscar imóvel:", err);
          router.push('/imoveis'); // Redireciona em caso de erro
        } finally {
          setLoading(false);
        }
      };

      fetchImovel();
    } else {
      // Modo de criação: preencher usuarioId automaticamente
      if (usuarioLogado) {
        setFormData(prev => ({
          ...prev,
          usuarioId: usuarioLogado.id // Preenche automaticamente com ID do usuário logado
        }));
      }
    }
  }, [imovelId, router, usuarioLogado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!podeEditar) { // Verificar se pode editar antes de enviar
        toast.error("Você não tem permissão para salvar alterações neste imóvel.");
        return;
    }
    setError(null);
    setLoading(true);

    // Adicionar o ID do usuário logado (se não estiver no formData)
    const dadosParaEnviar = {
      ...formData,
      usuarioId: usuarioLogado?.id // Preenche com o ID do usuário logado
    };

    try {
      if (imovelId) {
        // Modo de atualização
        await updateImovel(imovelId, dadosParaEnviar);
        toast.success('Imóvel atualizado com sucesso!', {
          position: 'top-center',
        });
      } else {
        // Modo de criação
        await createImovel(dadosParaEnviar);
        toast.success('Imóvel criado com sucesso!', {
          position: 'top-center',
        });
      }
      router.push('/imoveis');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar imóvel.';
      setError(errorMsg);
      toast.error("Erro: " + errorMsg, {
        position: 'top-center',
      });
      console.error("Erro ao salvar imóvel:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && imovelId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="p-4 text-red-500 text-center">
        Erro: {error}
      </div>
    );
  }

  return (
    <StyledCard
      title={imovelId ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
      description={imovelId
        ? 'Altere as informações do imóvel abaixo.'
        : 'Preencha os dados para cadastrar um novo imóvel no sistema. O proprietário será você.'}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mensagem de Erro Global */}
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-medium">Erro:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Título */}
          <div className="space-y-2 md:col-span-2">
            <StyledInput
              label="Título *"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Casa térrea no Jardim Paulista"
              required
            />
          </div>

          {/* Campo Descrição */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Detalhes sobre o imóvel..."
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Campo Preço de Venda */}
          <div className="space-y-2">
            <StyledInput
              label="Preço de Venda (R$)"
              id="preco_venda"
              name="preco_venda"
              type="number"
              step="0.01"
              value={formData.preco_venda ?? ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {/* Campo Preço de Aluguel */}
          <div className="space-y-2">
            <StyledInput
              label="Preço de Aluguel (R$)"
              id="preco_aluguel"
              name="preco_aluguel"
              type="number"
              step="0.01"
              value={formData.preco_aluguel ?? ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {/* Campo Finalidade */}
          <div className="space-y-2">
            <label htmlFor="finalidade" className="block text-sm font-medium text-gray-700">
              Finalidade *
            </label>
            <select
              id="finalidade"
              name="finalidade"
              value={formData.finalidade}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="VENDA">Venda</option>
              <option value="ALUGUEL">Aluguel</option>
              <option value="VENDA_E_ALUGUEL">Venda e Aluguel</option>
            </select>
          </div>

          {/* Campo Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="DISPONIVEL">Disponível</option>
              <option value="ALUGADO">Alugado</option>
              <option value="VENDIDO">Vendido</option>
              <option value="PENDENTE">Pendente</option>
            </select>
          </div>

          {/* Campo Dormitórios */}
          <div className="space-y-2">
            <StyledInput
              label="Dormitórios"
              id="dormitorios"
              name="dormitorios"
              type="number"
              min="0"
              value={formData.dormitorios}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* Campo Banheiros */}
          <div className="space-y-2">
            <StyledInput
              label="Banheiros"
              id="banheiros"
              name="banheiros"
              type="number"
              min="0"
              value={formData.banheiros}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* Campo Garagem */}
          <div className="space-y-2">
            <StyledInput
              label="Garagem"
              id="garagem"
              name="garagem"
              type="number"
              min="0"
              value={formData.garagem}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* Campo Área Total */}
          <div className="space-y-2">
            <StyledInput
              label="Área Total (m²)"
              id="area_total"
              name="area_total"
              type="number"
              step="0.01"
              value={formData.area_total ?? ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {/* Campo Área Construída */}
          <div className="space-y-2">
            <StyledInput
              label="Área Construída (m²)"
              id="area_construida"
              name="area_construida"
              type="number"
              step="0.01"
              value={formData.area_construida ?? ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {/* Campo Endereço */}
          <div className="space-y-2 md:col-span-2">
            <StyledInput
              label="Endereço *"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Rua, Avenida, etc."
              required
            />
          </div>

          {/* Campo Número */}
          <div className="space-y-2">
            <StyledInput
              label="Número *"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              placeholder="123"
              required
            />
          </div>

          {/* Campo Complemento */}
          <div className="space-y-2">
            <StyledInput
              label="Complemento"
              id="complemento"
              name="complemento"
              value={formData.complemento}
              onChange={handleChange}
              placeholder="Apto 56, Bloco A, etc."
            />
          </div>

          {/* Campo CEP */}
          <div className="space-y-2 md:col-span-2">
            <StyledInput
              label="CEP *"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="00000-000"
              pattern="\d{5}-?\d{3}"
              required
            />
          </div>

          {/* Campo Características */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="caracteristicas" className="block text-sm font-medium text-gray-700">
              Características
            </label>
            <textarea
              id="caracteristicas"
              name="caracteristicas"
              value={formData.caracteristicas}
              onChange={handleChange}
              placeholder="Sacada, Ar condicionado, Andar alto, etc."
              rows="2"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Campo Destaque */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center">
              <input
                id="destaque"
                name="destaque"
                type="checkbox"
                checked={formData.destaque}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="destaque" className="ml-2 block text-sm text-gray-900">
                Destaque
              </label>
            </div>
          </div>

          {/* Campo Tipo de Imóvel */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="tipoImovelId" className="block text-sm font-medium text-gray-700">
              Tipo de Imóvel *
            </label>
            <select
              id="tipoImovelId"
              name="tipoImovelId"
              value={formData.tipoImovelId || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Selecione um tipo...</option>
              {tiposImoveis.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Bairro */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="bairroId" className="block text-sm font-medium text-gray-700">
              Bairro *
            </label>
            <select
              id="bairroId"
              name="bairroId"
              value={formData.bairroId || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Selecione um bairro...</option>
              {bairros.map((bairro) => (
                <option key={bairro.id} value={bairro.id}>
                  {bairro.nome} - {bairro.cidade}, {bairro.estado}
                </option>
              ))}
            </select>
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
                {imovelId ? 'Atualizando...' : 'Cadastrando...'}
              </>
            ) : (
              imovelId ? 'Atualizar Imóvel' : 'Cadastrar Imóvel'
            )}
          </StyledButton>
          <Link href="/imoveis">
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