// services/imoveisService.js
import { apiGeral } from './authService'; // Importa a instância já configurada com withCredentials
import { toast } from 'sonner'; // Opcional, mas útil para feedbacks

// --- Funções CRUD para Imóveis ---

// GET /imoveis
export const getAllImoveis = async () => {
  try {
    const response = await apiGeral.get('/imoveis'); // Chamada para http://localhost:8080/imoveis
    return response.data; // Retorna a lista de imóveis
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    throw error;
  }
};

// GET /imoveis/{id}
export const getImovelById = async (id) => {
  try {
    const response = await apiGeral.get(`/imoveis/${id}`); // Chamada para http://localhost:8080/imoveis/123
    return response.data; // Retorna o objeto do imóvel
  } catch (error) {
    console.error(`Erro ao buscar imóvel com ID ${id}:`, error);
    throw error;
  }
};

// GET /imoveis/usuario/{id}
export const getImoveisByUsuarioId = async (usuarioId) => {
  try {
    const response = await apiGeral.get(`/imoveis/usuario/${usuarioId}`); // Chamada para http://localhost:8080/imoveis/usuario/123
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar imóveis do usuário com ID ${usuarioId}:`, error);
    throw error;
  }
};

// GET /imoveis/bairro/{id}
export const getImoveisByBairroId = async (bairroId) => {
  try {
    const response = await apiGeral.get(`/imoveis/bairro/${bairroId}`); // Chamada para http://localhost:8080/imoveis/bairro/123
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar imóveis do bairro com ID ${bairroId}:`, error);
    throw error;
  }
};

// GET /imoveis/tipo/{id}
export const getImoveisByTipoId = async (tipoId) => {
  try {
    const response = await apiGeral.get(`/imoveis/tipo/${tipoId}`); // Chamada para http://localhost:8080/imoveis/tipo/123
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar imóveis do tipo com ID ${tipoId}:`, error);
    throw error;
  }
};

// POST /imoveis
export const createImovel = async (imovelDTO) => {
  try {
    const response = await apiGeral.post('/imoveis', imovelDTO); // Chamada para http://localhost:8080/imoveis
    // O backend responde com 201 Created e header Location
    return response.data; // Se o backend retornar o objeto criado
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    // O erro pode conter detalhes específicos do backend (ex: mensagem de validação)
    throw error;
  }
};

// PUT /imoveis/{id}
export const updateImovel = async (id, imovelDTO) => {
  try {
    const response = await apiGeral.put(`/imoveis/${id}`, imovelDTO); // Chamada para http://localhost:8080/imoveis/123
    return response.data; // Retorna o objeto atualizado
  } catch (error) {
    console.error(`Erro ao atualizar imóvel com ID ${id}:`, error);
    throw error;
  }
};

// DELETE /imoveis/{id}
export const deleteImovel = async (id) => {
  try {
    // O DELETE geralmente não tem corpo de resposta (204 No Content)
    await apiGeral.delete(`/imoveis/${id}`); // Chamada para http://localhost:8080/imoveis/123
    // Se chegar aqui, a exclusão foi bem-sucedida
    return true; // Indica sucesso
  } catch (error) {
    console.error(`Erro ao excluir imóvel com ID ${id}:`, error);
    throw error;
  }
};