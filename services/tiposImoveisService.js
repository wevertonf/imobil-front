// services/tiposImoveisService.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Instância genérica para outros recursos (bairros, tipos-imoveis, etc.)
// Usando a instância já configurada com withCredentials no authService
import { apiGeral } from './authService'; // Importa a instância já configurada

// --- Funções CRUD para Tipos de Imóveis ---

// GET /tipos-imoveis
export const getAllTiposImoveis = async () => {
  try {
    const response = await apiGeral.get('/tipos-imoveis'); // Chamada para http://localhost:8080/tipos-imoveis
    return response.data; // Retorna a lista de tipos
  } catch (error) {
    console.error("Erro ao buscar tipos de imóveis:", error);
    throw error;
  }
};

// GET /tipos-imoveis/{id}
export const getTipoImovelById = async (id) => {
  try {
    const response = await apiGeral.get(`/tipos-imoveis/${id}`); // Chamada para http://localhost:8080/tipos-imoveis/123
    return response.data; // Retorna o objeto do tipo
  } catch (error) {
    console.error(`Erro ao buscar tipo de imóvel com ID ${id}:`, error);
    throw error;
  }
};

// POST /tipos-imoveis
export const createTipoImovel = async (tipoDTO) => {
  try {
    const response = await apiGeral.post('/tipos-imoveis', tipoDTO); // Chamada para http://localhost:8080/tipos-imoveis
    // O backend responde com 201 Created e header Location
    return response.data; // Se o backend retornar o objeto criado
  } catch (error) {
    console.error("Erro ao criar tipo de imóvel:", error);
    throw error;
  }
};

// PUT /tipos-imoveis/{id}
export const updateTipoImovel = async (id, tipoDTO) => {
  try {
    const response = await apiGeral.put(`/tipos-imoveis/${id}`, tipoDTO); // Chamada para http://localhost:8080/tipos-imoveis/123
    return response.data; // Retorna o objeto atualizado
  } catch (error) {
    console.error(`Erro ao atualizar tipo de imóvel com ID ${id}:`, error);
    throw error;
  }
};

// DELETE /tipos-imoveis/{id}
export const deleteTipoImovel = async (id) => {
  try {
    // O DELETE geralmente não tem corpo de resposta (204 No Content)
    await apiGeral.delete(`/tipos-imoveis/${id}`); // Chamada para http://localhost:8080/tipos-imoveis/123
    // Se chegar aqui, a exclusão foi bem-sucedida
    return true; // Indica sucesso
  } catch (error) {
    console.error(`Erro ao excluir tipo de imóvel com ID ${id}:`, error);
    throw error;
  }
};