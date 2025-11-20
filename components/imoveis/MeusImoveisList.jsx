// components/imoveis/MeusImoveisList.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMeusImoveis, deleteImovel } from '@/services/imoveisService'; // Importar função de exclusão
import { useAuth } from '@/context/AuthContext';
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import { toast } from 'sonner';
import { Plus, Edit, Eye, Trash2, Home, MapPin, DollarSign, Bed, Bath, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Componente para exibir um único imóvel (reutilizável)
function ImovelItem({ imovel, usuarioLogado, onDelete }) { // <-- Adicionar onDelete como prop
  console.log("ImovelItem props:", { imovel, usuarioLogado });
  // Lógica de permissão: Admin pode editar/excluir qualquer um, proprietário pode editar/excluir seus próprios
  const podeEditarExcluir = usuarioLogado && (
    usuarioLogado.tipo === 'ADMIN' ||  // Admin pode editar/excluir qualquer imóvel
    imovel.id_usuario === usuarioLogado.id // Proprietário pode editar/excluir seus próprios
  );
  console.log("Pode editar/excluir?", podeEditarExcluir); // Log temporário
  console.log("Tipo do usuário logado:", usuarioLogado?.tipo); // Log temporário
  console.log("ID do usuário no imóvel:", imovel.id_usuario); // Log temporário
  console.log("ID do usuário logado:", usuarioLogado?.id); // Log temporário
  

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{imovel.titulo}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{imovel.descricao}</p>
        </div>
        <div className="flex flex-col items-end">
          {imovel.status && (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              imovel.status.toUpperCase() === 'DISPONIVEL' ? 'bg-green-100 text-green-800' :
              imovel.status.toUpperCase() === 'ALUGADO' ? 'bg-yellow-100 text-yellow-800' :
              imovel.status.toUpperCase() === 'VENDIDO' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {imovel.status}
            </span>
          )}
          {imovel.finalidade && (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-1 ${
              imovel.finalidade.toUpperCase() === 'VENDA' ? 'bg-blue-100 text-blue-800' :
              imovel.finalidade.toUpperCase() === 'ALUGUEL' ? 'bg-purple-100 text-purple-800' :
              'bg-indigo-100 text-indigo-800'
            }`}>
              {imovel.finalidade}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Bed className="h-4 w-4 mr-1 text-gray-500" />
          <span>{imovel.dormitorios || 0} dorm(s)</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Bath className="h-4 w-4 mr-1 text-gray-500" />
          <span>{imovel.banheiros || 0} banh(s)</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Car className="h-4 w-4 mr-1 text-gray-500" />
          <span>{imovel.garagem || 0} vaga(s)</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          <span>{imovel.bairro ? `${imovel.bairro.nome}, ${imovel.bairro.cidade}` : 'Bairro não informado'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Home className="h-4 w-4 mr-1 text-gray-500" />
          <span>{imovel.tipoImovel ? imovel.tipoImovel.nome : 'Tipo não informado'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
          <span>
            {imovel.preco_venda ? `Venda: R$ ${imovel.preco_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Preço não informado'}
            {imovel.preco_venda && imovel.preco_aluguel ? ' / ' : ''}
            {imovel.preco_aluguel ? `Aluguel: R$ ${imovel.preco_aluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Link href={`/imoveis/visualizar/${imovel.id}`}>
          <StyledButton variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Ver
          </StyledButton>
        </Link>
        {/* Botões de edição e exclusão aparecem apenas se o usuário tiver permissão */}
        {podeEditarExcluir && (
          <>
            <Link href={`/imoveis/editar/${imovel.id}`}>
              <StyledButton variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-1" /> Editar
              </StyledButton>
            </Link>
            <StyledButton
              variant="danger"
              size="sm"
              onClick={() => onDelete(imovel)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </StyledButton>
          </>
        )}
      </div>
    </div>
  );
}

// Componente principal da lista
export default function MeusImoveisList() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario: usuarioLogado } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!usuarioLogado) {
      toast.info("Faça login para acessar seus imóveis.");
      router.push('/login');
      return;
    }

    const fetchMeusImoveis = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMeusImoveis();
        setImoveis(data);
      } catch (err) {
        console.error("Erro no componente MeusImoveisList:", err);
        if (err.response?.status === 401) {
          toast.error("Sua sessão expirou. Faça login novamente.");
          router.push('/login');
          return;
        }
        setError(err.message || 'Erro ao carregar seus imóveis.');
        toast.error("Erro ao carregar seus imóveis: " + (err.message || 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchMeusImoveis();
    // Log temporário para debug
    console.log("Usuário logado no MeusImoveisList:", usuarioLogado);
  }, [usuarioLogado, router]);

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

  if (!usuarioLogado) {
    return <div>Verificando login...</div>;
  }

  // --- Função de exclusão (definida no escopo do componente pai) ---
  const handleDelete = (imovel) => {
    if (confirm(`Tem certeza que deseja excluir o imóvel "${imovel.titulo}" (ID: ${imovel.id})?`)) {
      deleteImovel(imovel.id) // Chama a função do serviço
        .then(() => {
          // Atualiza a lista localmente após exclusão bem-sucedida
          setImoveis(imoveis.filter(i => i.id !== imovel.id));
          toast.success(`Imóvel "${imovel.titulo}" excluído com sucesso!`);
        })
        .catch((error) => {
          console.error("Erro ao excluir imóvel:", error);
          toast.error("Erro ao excluir imóvel: " + (error.response?.data?.message || error.message || 'Erro desconhecido'));
        });
    }
  };

  return (
    <StyledCard
      title="Meus Imóveis"
      description={`Lista de imóveis cadastrados por você (${usuarioLogado.nome}).`}
      className="w-full max-w-6xl mx-auto"
      footer={
        usuarioLogado && (usuarioLogado.tipo === 'ADMIN' || usuarioLogado.tipo === 'CORRETOR') && (
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
            <ImovelItem
              key={imovel.id}
              imovel={imovel}
              usuarioLogado={usuarioLogado}
              onDelete={handleDelete} // <-- Passa a função handleDelete para o filho
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Você ainda não cadastrou nenhum imóvel.</p>
          {usuarioLogado && (usuarioLogado.tipo === 'ADMIN' || usuarioLogado.tipo === 'CORRETOR') && (
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