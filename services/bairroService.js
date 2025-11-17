// services/bairroService.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Instância genérica para outros recursos (bairros, tipos-imoveis, etc.)
// Usando a instância já configurada com withCredentials no authService
import { apiGeral } from './authService'; // Importa a instância já configurada

// Se preferir uma instância específica para bairros, você pode criar:
// const apiBairros = axios.create({
//   baseURL: `${API_BASE_URL}/bairros`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// --- Funções CRUD para Bairros ---

// GET /bairros
export const getAllBairros = async () => {
  try {
    const response = await apiGeral.get('/bairros'); // Chamada para http://localhost:8080/bairros
    return response.data; // Retorna a lista de bairros
  } catch (error) {
    console.error("Erro ao buscar bairros:", error);
    throw error;
  }
};

// GET /bairros/{id}
export const getBairroById = async (id) => {
  try {
    const response = await apiGeral.get(`/bairros/${id}`); // Chamada para http://localhost:8080/bairros/123
    return response.data; // Retorna o objeto do bairro
  } catch (error) {
    console.error(`Erro ao buscar bairro com ID ${id}:`, error);
    throw error;
  }
};

// POST /bairros
export const createBairro = async (bairroDTO) => {
  try {
    const response = await apiGeral.post('/bairros', bairroDTO); // Chamada para http://localhost:8080/bairros
    // O backend responde com 201 Created e header Location
    return response.data; // Se o backend retornar o objeto criado
  } catch (error) {
    console.error("Erro ao criar bairro:", error);
    throw error;
  }
};

// PUT /bairros/{id}
export const updateBairro = async (id, bairroDTO) => {
  try {
    const response = await apiGeral.put(`/bairros/${id}`, bairroDTO); // Chamada para http://localhost:8080/bairros/123
    return response.data; // Retorna o objeto atualizado
  } catch (error) {
    console.error(`Erro ao atualizar bairro com ID ${id}:`, error);
    throw error;
  }
};

// DELETE /bairros/{id}
export const deleteBairro = async (id) => {
  try {
    // O DELETE geralmente não tem corpo de resposta (204 No Content)
    await apiGeral.delete(`/bairros/${id}`); // Chamada para http://localhost:8080/bairros/123
    // Se chegar aqui, a exclusão foi bem-sucedida
    return true; // Indica sucesso
  } catch (error) {
    console.error(`Erro ao excluir bairro com ID ${id}:`, error);
    throw error;
  }
};