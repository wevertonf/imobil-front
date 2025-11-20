// src/components/imoveis/ImoveisList.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllImoveis, getImoveisByUsuarioId } from '@/services/imoveisService';
import { useAuth } from '@/context/AuthContext';
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import { toast } from 'sonner';
import { Plus, Edit, Eye, Trash2, Home, MapPin, DollarSign, Bed, Bath, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMeusImoveis } from '@/services/imoveisService';


// Componente para exibir um único imóvel
function ImovelItem({ imovel, usuarioLogado }) {
  const { id, titulo, descricao, preco_venda, preco_aluguel, finalidade, status, dormitorios, banheiros, garagem, area_total, endereco, numero, bairro, tipoImovel } = imovel;

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{descricao}</p>
        </div>
        <div className="flex flex-col items-end">
          {status && (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${status.toUpperCase() === 'DISPONIVEL' ? 'bg-green-100 text-green-800' :
                status.toUpperCase() === 'ALUGADO' ? 'bg-yellow-100 text-yellow-800' :
                  status.toUpperCase() === 'VENDIDO' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
              }`}>
              {status}
            </span>
          )}
          {finalidade && (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-1 ${finalidade.toUpperCase() === 'VENDA' ? 'bg-blue-100 text-blue-800' :
                finalidade.toUpperCase() === 'ALUGUEL' ? 'bg-purple-100 text-purple-800' :
                  'bg-indigo-100 text-indigo-800'
              }`}>
              {finalidade}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Bed className="h-4 w-4 mr-1 text-gray-500" />
          <span>{dormitorios || 0} dorm(s)</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Bath className="h-4 w-4 mr-1 text-gray-500" />
          <span>{banheiros || 0} banh(s)</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Car className="h-4 w-4 mr-1 text-gray-500" />
          <span>{garagem || 0} vaga(s)</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          <span>{bairro ? `${bairro.nome}, ${bairro.cidade}` : 'Bairro não informado'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Home className="h-4 w-4 mr-1 text-gray-500" />
          <span>{tipoImovel ? tipoImovel.nome : 'Tipo não informado'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
          <span>
            {preco_venda ? `Venda: R$ ${preco_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Preço não informado'}
            {preco_venda && preco_aluguel ? ' / ' : ''}
            {preco_aluguel ? `Aluguel: R$ ${preco_aluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Link href={`/imoveis/visualizar/${id}`}>
          <StyledButton variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Ver
          </StyledButton>
        </Link>
        {/* Botões de edição e exclusão aparecem apenas para proprietário ou admin */}
        {(usuarioLogado && (usuarioLogado.tipo === 'ADMIN' || imovel.usuario?.id === usuarioLogado.id)) && (
          <>
            <Link href={`/imoveis/editar/${id}`}>
              <StyledButton variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-1" /> Editar
              </StyledButton>
            </Link>
            {/* Botão de exclusão (precisa de confirmação) */}
            <StyledButton
              variant="danger"
              size="sm"
              onClick={() => handleDelete(imovel)} // Supondo que handleDelete esteja disponível no escopo pai
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </StyledButton>
          </>
        )}
      </div>
    </div>
  );
}


export default function ImoveisList({ usuarioIdFiltro = null }) { // <-- Parâmetro opcional
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario: usuarioLogado } = useAuth(); // Pegar usuário logado do contexto
  const router = useRouter(); // Para redirecionar se não estiver logado

  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (usuarioIdFiltro) {
          // Buscar imóveis de um usuário específico (ex: via parâmetro)
          data = await getImoveisByUsuarioId(usuarioIdFiltro);
        } else if (usuarioLogado) {
          // Buscar MEUS imóveis (do usuário logado) se não houver filtro específico e estiver logado
          data = await getMeusImoveis();
        } else {
          // Buscar todos os imóveis (público)
          data = await getAllImoveis();
        }

        setImoveis(data);
      } catch (err) {
        console.error("Erro no componente ImoveisList:", err);
        if (err.response?.status === 401) {
          // Se o backend retornar 401 (não autorizado) ao tentar buscar meus imóveis
          toast.info("Faça login para acessar seus imóveis.");
          router.push('/login');
          return; // Sai do useEffect
        }
        setError(err.message || 'Erro ao carregar imóveis.');
        toast.error("Erro ao carregar imóveis: " + (err.message || 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchImoveis();
  }, [usuarioIdFiltro, usuarioLogado, router]); // <-- Adicione usuarioLogado e router como dependências

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
      title={usuarioIdFiltro ? 'Meus Imóveis' : 'Todos os Imóveis'}
      description={usuarioIdFiltro
        ? 'Listagem dos imóveis que você cadastrou.'
        : 'Listagem de todos os imóveis do sistema.'}
      className="w-full max-w-6xl mx-auto"
      footer={
        // Mostrar botão de criar apenas se NÃO estiver filtrando por usuário específico
        // (ou se estiver filtrando pelo usuário logado e ele for admin/corretor)
        !usuarioIdFiltro && usuarioLogado && (usuarioLogado.tipo === 'ADMIN' || usuarioLogado.tipo === 'CORRETOR') && (
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
      {imoveis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <ImovelItem key={imovel.id} imovel={imovel} usuarioLogado={usuarioLogado} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {usuarioIdFiltro
              ? 'Você não cadastrou nenhum imóvel ainda.'
              : 'Nenhum imóvel encontrado.'}
          </p>
          {!usuarioIdFiltro && usuarioLogado && ( // Mostrar botão de criar apenas se estiver logado e não estiver filtrando
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