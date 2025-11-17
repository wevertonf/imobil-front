// components/imoveis/ImovelDetalhe.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getImovelById } from '@/services/imoveisService';
import { getFotosByImovelId } from '@/services/fotosImoveisService';
import { useAuth } from '@/context/AuthContext'; // Para verificar se pode editar/excluir
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import { toast } from 'sonner';
import { Edit, Eye, Home, Image, Camera, Trash2, DollarSign, Bed, Bath, Car } from 'lucide-react';

export default function ImovelDetalhe({ imovelId: propId }) {
  const { id } = useParams(); // Se o ID vier pela URL (app router)
  const router = useRouter();
  const { usuario } = useAuth(); // Usuário logado

  // Usar o ID da prop ou da URL
  const imovelId = propId || (id ? parseInt(id, 10) : null);

  const [imovel, setImovel] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fotosLoading, setFotosLoading] = useState(false);

  useEffect(() => {
    if (imovelId) {
      fetchImovel();
    } else {
      setError("ID do imóvel não fornecido.");
      setLoading(false);
    }
  }, [imovelId]);

  const fetchImovel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getImovelById(imovelId);
      if (data) {
        setImovel(data);
        // Carregar fotos após carregar o imóvel
        fetchFotos();
      } else {
        setError("Imóvel não encontrado.");
      }
    } catch (err) {
      setError("Erro ao carregar dados do imóvel: " + (err.message || 'Erro desconhecido'));
      toast.error("Erro ao carregar imóvel: " + (err.message || 'Erro desconhecido'));
      console.error("Erro no componente ImovelDetalhe:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFotos = async () => {
    try {
      setFotosLoading(true);
      const data = await getFotosByImovelId(imovelId);
      setFotos(data);
    } catch (err) {
      console.error("Erro ao carregar fotos do imóvel:", err);
      toast.error("Erro ao carregar fotos do imóvel.");
    } finally {
      setFotosLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <StyledCard
          title="Erro ao carregar imóvel"
          description={error}
          className="w-full max-w-2xl mx-auto shadow-lg"
        >
          <div className="text-center">
            <Link href="/imoveis">
              <StyledButton variant="outline" className="mt-4">
                Voltar para Lista de Imóveis
              </StyledButton>
            </Link>
          </div>
        </StyledCard>
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="container mx-auto py-8 px-4">
        <StyledCard
          title="Imóvel não encontrado"
          description={`O imóvel com ID ${imovelId} não existe ou foi excluído.`}
          className="w-full max-w-2xl mx-auto shadow-lg"
        >
          <div className="text-center">
            <Link href="/imoveis">
              <StyledButton variant="outline" className="mt-4">
                Voltar para Lista de Imóveis
              </StyledButton>
            </Link>
          </div>
        </StyledCard>
      </div>
    );
  }

  // Função para formatar valores monetários
  const formatarPreco = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para formatar status
  const getStatusBadgeVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'DISPONIVEL':
        return 'bg-green-100 text-green-800';
      case 'ALUGADO':
        return 'bg-yellow-100 text-yellow-800';
      case 'VENDIDO':
        return 'bg-red-100 text-red-800';
      case 'PENDENTE':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para formatar finalidade
  const getFinalidadeBadgeVariant = (finalidade) => {
    switch (finalidade?.toUpperCase()) {
      case 'VENDA':
        return 'bg-blue-100 text-blue-800';
      case 'ALUGUEL':
        return 'bg-purple-100 text-purple-800';
      case 'VENDA_E_ALUGUEL':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <StyledCard
        title={imovel.titulo}
        description={`Detalhes do imóvel #${imovel.id}`}
        className="w-full shadow-xl rounded-2xl border-0 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        {/* Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Preço de Venda</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {formatarPreco(imovel.preco_venda)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Preço de Aluguel</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {formatarPreco(imovel.preco_aluguel)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <Bed className="h-5 w-5" />
              <span className="text-sm font-medium">Dormitórios</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {imovel.dormitorios || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <Bath className="h-5 w-5" />
              <span className="text-sm font-medium">Banheiros</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {imovel.banheiros || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <Car className="h-5 w-5" />
              <span className="text-sm font-medium">Garagem</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {imovel.garagem || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <Image className="h-5 w-5" />
              <span className="text-sm font-medium">Fotos</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {fotos.length}
            </p>
          </div>
        </div>

        {/* Detalhes do Imóvel */}
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" /> Detalhes do Imóvel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p className="text-sm text-gray-900 font-mono">{imovel.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Título</p>
                <p className="text-sm text-gray-900">{imovel.titulo}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Descrição</p>
                <p className="text-sm text-gray-900">
                  {imovel.descricao || 'Nenhuma descrição fornecida.'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Finalidade</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFinalidadeBadgeVariant(imovel.finalidade)}`}>
                  {imovel.finalidade}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeVariant(imovel.status)}`}>
                  {imovel.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Área Total</p>
                <p className="text-sm text-gray-900">{imovel.area_total ? `${imovel.area_total} m²` : '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Área Construída</p>
                <p className="text-sm text-gray-900">{imovel.area_construida ? `${imovel.area_construida} m²` : '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Características</p>
                <p className="text-sm text-gray-900">
                  {imovel.caracteristicas || 'Nenhuma característica registrada.'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Destaque</p>
                <p className="text-sm text-gray-900">{imovel.destaque ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200 flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-600" /> Endereço
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-900">
                {imovel.endereco}, {imovel.numero} {imovel.complemento ? `, ${imovel.complemento}` : ''}<br />
                {imovel.bairro ? `${imovel.bairro.nome}, ${imovel.bairro.cidade} - ${imovel.bairro.estado}` : 'Bairro não informado'}<br />
                CEP: {imovel.cep}
              </p>
            </div>
          </div>

          {/* Informações do Proprietário */}
          {imovel.usuario && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" /> Proprietário
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-900">
                  <strong>Nome:</strong> {imovel.usuario.nome}<br />
                  <strong>Email:</strong> {imovel.usuario.email}
                </p>
              </div>
            </div>
          )}

          {/* Informações do Tipo de Imóvel */}
          {imovel.tipoImovel && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" /> Tipo de Imóvel
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-900">
                  <strong>Nome:</strong> {imovel.tipoImovel.nome}<br />
                  <strong>Descrição:</strong> {imovel.tipoImovel.descricao || 'Nenhuma descrição fornecida.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Galeria de Fotos */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-blue-600" /> Fotos do Imóvel
          </h3>
          {fotosLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fotos.length > 0 ? (
                fotos.sort((a, b) => a.ordem - b.ordem).map((foto) => (
                  <div key={foto.id} className="border rounded-lg overflow-hidden shadow-md">
                    <img
                      src={`http://localhost:8080/${foto.caminho}`} // Ajuste a URL base se necessário
                      alt={`Foto do imóvel ${imovel.titulo}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2 bg-gray-100 text-center">
                      <p className="text-xs text-gray-600 truncate">{foto.nome_arquivo}</p>
                      {foto.capa && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Capa</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full py-6">Nenhuma foto encontrada para este imóvel.</p>
              )}
            </div>
          )}
        </div>

        {/* Upload de Fotos (se usuário logado é o proprietário ou admin) */}
        {usuario && (imovel.usuario?.id === usuario.id || usuario.tipo === 'ADMIN') && (
          <div className="mb-8">
            <FotosImoveisUpload imovelId={imovel.id} />
          </div>
        )}

        {/* Botões de Ação */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            {usuario && (imovel.usuario?.id === usuario.id || usuario.tipo === 'ADMIN') && (
              <Link href={`/imoveis/editar/${imovel.id}`}>
                <StyledButton variant="primary" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <Edit className="h-4 w-4 mr-2" /> Editar Imóvel
                </StyledButton>
              </Link>
            )}
            <Link href="/imoveis">
              <StyledButton variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm">
                <Home className="h-4 w-4 mr-2" /> Voltar para Lista
              </StyledButton>
            </Link>
          </div>
        </div>
      </StyledCard>
    </div>
  );
}