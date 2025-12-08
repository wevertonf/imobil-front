// components/imoveis/ImovelDetalhe.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getImovelById } from '@/services/imoveisService';
import { getFotosByImovelId } from '@/services/fotosImoveisService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import FotosImoveisUpload from '@/components/imoveis/FotosImoveisUpload';

export default function ImovelDetalhe({ imovelId: propId }) {
  const { id } = useParams();
  const router = useRouter();
  const { usuario } = useAuth();

  const imovelId = propId || (id ? parseInt(id, 10) : null);

  const [imovel, setImovel] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fotosLoading, setFotosLoading] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

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
      console.log("Fotos carregadas:", data); // Debug
      
      // Ordenar fotos: Capa primeiro, depois por ID decrescente (últimas inseridas primeiro)
      const fotosOrdenadas = (data || []).sort((a, b) => {
        // Se uma é capa e outra não, capa vem primeiro
        if (a.capa && !b.capa) return -1;
        if (!a.capa && b.capa) return 1;
        
        // Se ambas são capa ou nenhuma é, ordenar por ID decrescente (mais recente primeiro)
        return b.id - a.id;
      });
      
      setFotos(fotosOrdenadas);
      
      // Define a foto de capa como selecionada (ou a primeira se não houver capa)
      if (fotosOrdenadas.length > 0) {
        const fotoCapa = fotosOrdenadas.find(f => f.capa) || fotosOrdenadas[0];
        setFotoSelecionada(fotoCapa);
      }
    } catch (err) {
      console.error("Erro ao carregar fotos do imóvel:", err);
      toast.error("Erro ao carregar fotos do imóvel.");
      setFotos([]);
    } finally {
      setFotosLoading(false);
    }
  };

  const formatarPreco = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'DISPONIVEL': 'bg-emerald-500 bg-opacity-20 text-emerald-300 border-emerald-500',
      'ALUGADO': 'bg-amber-500 bg-opacity-20 text-amber-300 border-amber-500',
      'VENDIDO': 'bg-rose-500 bg-opacity-20 text-rose-300 border-rose-500',
      'PENDENTE': 'bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500'
    };
    return badges[status?.toUpperCase()] || 'bg-gray-500 bg-opacity-20 text-gray-300 border-gray-500';
  };

  const getFinalidadeBadge = (finalidade) => {
    const badges = {
      'VENDA': 'bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500',
      'ALUGUEL': 'bg-purple-500 bg-opacity-20 text-purple-300 border-purple-500',
      'VENDA_E_ALUGUEL': 'bg-indigo-500 bg-opacity-20 text-indigo-300 border-indigo-500'
    };
    return badges[finalidade?.toUpperCase()] || 'bg-gray-500 bg-opacity-20 text-gray-300 border-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white opacity-70">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (error || !imovel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl border border-white border-opacity-20 p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {error ? "Erro ao carregar" : "Imóvel não encontrado"}
          </h2>
          <p className="text-white opacity-70 mb-6">{error || "O imóvel não existe ou foi excluído."}</p>
          <Link href="/imoveis">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all">
              Voltar para Imóveis
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header com título e badges */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{imovel.titulo}</h1>
              <p className="text-white opacity-60">Código do Imóvel: #{imovel.id}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(imovel.status)}`}>
                {imovel.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFinalidadeBadge(imovel.finalidade)}`}>
                {imovel.finalidade}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Fotos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galeria de Fotos */}
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 overflow-hidden">
              {fotosLoading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : fotos.length > 0 ? (
                <>
                  {/* Foto Principal */}
                  <div className="relative h-96 bg-slate-900">
                    <img
                      src={`http://localhost:8080/uploads/${fotoSelecionada?.caminho || fotos[0]?.caminho}`}
                      alt={imovel.titulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Erro ao carregar imagem:", e.target.src);
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23334155"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23cbd5e1"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {fotoSelecionada?.capa && (
                      <div className="absolute top-4 left-4 bg-yellow-500 bg-opacity-90 px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                        FOTO CAPA
                      </div>
                    )}
                  </div>

                  {/* Miniaturas */}
                  <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {fotos.map((foto, index) => (
                      <button
                        key={foto.id}
                        onClick={() => setFotoSelecionada(foto)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          fotoSelecionada?.id === foto.id
                            ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/50'
                            : 'border-white border-opacity-20 hover:border-opacity-50 hover:scale-105'
                        }`}
                      >
                        <img
                          src={`http://localhost:8080/uploads/${foto.caminho}`}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23334155"/%3E%3C/svg%3E';
                          }}
                        />
                        {/* Badge de Capa */}
                        {foto.capa && (
                          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/90 via-transparent to-transparent flex items-end justify-center pb-1">
                            <div className="bg-yellow-500 bg-opacity-90 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-[9px] font-bold text-slate-900">CAPA</span>
                            </div>
                          </div>
                        )}
                        {/* Indicador de posição */}
                        <div className="absolute top-1 left-1 bg-slate-900 bg-opacity-70 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-black opacity-60">
                  <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Nenhuma foto disponível para este imóvel</p>
                </div>
              )}
            </div>

            {/* Upload de Fotos */}
            {usuario && (imovel.usuario?.id === usuario.id || usuario.tipo === 'ADMIN') && (
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Adicionar Fotos
                </h3>
                <FotosImoveisUpload 
                  imovelId={imovel.id} 
                  onUploadSuccess={fetchFotos}
                  fotosExistentes={fotos}
                />
              </div>
            )}

            {/* Descrição */}
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Descrição</h3>
              <p className="text-black opacity-80 leading-relaxed">
                {imovel.descricao || 'Nenhuma descrição fornecida.'}
              </p>
            </div>

            {/* Características */}
            {imovel.caracteristicas && (
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6">
                <h3 className="text-lg font-semibold text-black mb-4">Características</h3>
                <p className="text-black opacity-80 leading-relaxed whitespace-pre-line">
                  {imovel.caracteristicas}
                </p>
              </div>
            )}
          </div>

          {/* Coluna Lateral - Informações */}
          <div className="space-y-6">
            {/* Preços e Info */}
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6 space-y-4">
              <div>
                <p className="text-black opacity-60 text-sm mb-1">Preço de Venda</p>
                <p className="text-2xl font-bold text-black">{formatarPreco(imovel.preco_venda)}</p>
              </div>
              <div>
                <p className="text-black opacity-60 text-sm mb-1">Preço de Aluguel</p>
                <p className="text-2xl font-bold text-black">{formatarPreco(imovel.preco_aluguel)}</p>
              </div>
            </div>

            {/* Características Principais */}
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Características</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white bg-opacity-5 rounded-xl">
                  <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <p className="text-2xl font-bold text-black">{imovel.dormitorios || 0}</p>
                  <p className="text-xs text-black opacity-60">Dormitórios</p>
                </div>
                <div className="text-center p-3 bg-white bg-opacity-5 rounded-xl">
                  <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <p className="text-2xl font-bold text-black">{imovel.banheiros || 0}</p>
                  <p className="text-xs text-black opacity-60">Banheiros</p>
                </div>
                <div className="text-center p-3 bg-white bg-opacity-5 rounded-xl">
                  <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <p className="text-2xl font-bold text-black">{imovel.garagem || 0}</p>
                  <p className="text-xs text-black opacity-60">Garagem</p>
                </div>
                <div className="text-center p-3 bg-white bg-opacity-5 rounded-xl">
                  <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <p className="text-2xl font-bold text-black">{imovel.area_total || 0}</p>
                  <p className="text-xs text-black opacity-60">m² Total</p>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Localização</h3>
              <div className="space-y-2 text-black opacity-80 text-sm">
                <p>{imovel.endereco}, {imovel.numero}</p>
                {imovel.complemento && <p>{imovel.complemento}</p>}
                {imovel.bairro && (
                  <p>{imovel.bairro.nome}, {imovel.bairro.cidade} - {imovel.bairro.estado}</p>
                )}
                <p>CEP: {imovel.cep}</p>
              </div>
            </div>

            {/* Tipo de Imóvel */}
            {imovel.tipoImovel && (
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6">
                <h3 className="text-lg font-semibold text-black mb-2">Tipo</h3>
                <p className="text-black opacity-80">{imovel.tipoImovel.nome}</p>
              </div>
            )}

            {/* Ações */}
            <div className="space-y-3">
              {usuario && (imovel.usuario?.id === usuario.id || usuario.tipo === 'ADMIN') && (
                <Link href={`/imoveis/editar/${imovel.id}`} className="block">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all shadow-lg shadow-purple-500 shadow-opacity-30 hover:shadow-xl font-medium">
                    Editar Imóvel
                  </button>
                </Link>
              )}
              <Link href="/imoveis" className="block">
                <button className="w-full px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-black border border-white border-opacity-30 rounded-xl transition-all font-medium">
                  Voltar para Lista
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}