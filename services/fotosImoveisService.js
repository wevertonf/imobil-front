// services/fotosImoveisService.js
import { apiGeral } from './authService'; // Usar a instância já configurada com withCredentials
import { toast } from 'sonner'; // Opcional, mas útil para feedbacks

// --- Funções CRUD para Fotos de Imóveis ---

// GET /fotos-imoveis
export const getAllFotos = async () => {
  try {
    const response = await apiGeral.get('/fotos-imoveis');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar fotos de imóveis:", error);
    throw error;
  }
};

// GET /fotos-imoveis/{id}
export const getFotoById = async (id) => {
  try {
    const response = await apiGeral.get(`/fotos-imoveis/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar foto com ID ${id}:`, error);
    throw error;
  }
};

// GET /fotos-imoveis/imoveis/{id}
export const getFotosByImovelId = async (imovelId) => {
  try {
    const response = await apiGeral.get(`/fotos-imoveis/imoveis/${imovelId}`);
    return response.data; // Retorna uma lista de fotos
  } catch (error) {
    console.error(`Erro ao buscar fotos do imóvel com ID ${imovelId}:`, error);
    throw error;
  }
};

// POST /fotos-imoveis (upload de arquivo multipart/form-data)
export const uploadFotoImovel = async (arquivo, dados) => {
  try {
    // Criar FormData para enviar arquivo e dados JSON
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('dados', JSON.stringify(dados)); // Converter objeto JS para string JSON

    // Configuração especial para upload de arquivos
    const response = await apiGeral.post('/fotos-imoveis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Importante!
        // Não inclua 'application/json' aqui
      },
      // withCredentials: true já está configurado na instância apiGeral
    });

    return response.data; // O backend pode retornar uma mensagem ou o ID da foto criada
  } catch (error) {
    console.error("Erro ao fazer upload da foto:", error);
    // O erro pode conter detalhes do backend (ex: mensagem de validação)
    throw error;
  }
};

// PUT /fotos-imoveis/{id}
export const updateFotoImovel = async (id, fotoDTO) => {
  try {
    const response = await apiGeral.put(`/fotos-imoveis/${id}`, fotoDTO);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar foto com ID ${id}:`, error);
    throw error;
  }
};

// DELETE /fotos-imoveis/{id}
export const deleteFotoImovel = async (id) => {
  try {
    await apiGeral.delete(`/fotos-imoveis/${id}`);
    return true; // Indica sucesso
  } catch (error) {
    console.error(`Erro ao excluir foto com ID ${id}:`, error);
    throw error;
  }
};