// src/services/usuarioService.js
import { apiGeral } from './authService'; // Importa a instância com withCredentials

// ... (não precisa mais de apiUsuario) ...

// GET /users
export const getAllUsers = async () => {
  try {
    const response = await apiGeral.get('/users'); // Chamada para http://localhost:8080/users
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// GET /users/{id}
export const getUserById = async (id) => {
  try {
    const response = await apiGeral.get(`/users/${id}`); // Chamada para http://localhost:8080/users/123
    return response.data;
  } catch (error) {
    // ... tratamento de erro ...
  }
};

// POST /users
export const createUser = async (userData) => {
  try {
    const response = await apiGeral.post('/users', userData); // Chamada para http://localhost:8080/users
    return response.data;
  } catch (error) {
    // ... tratamento de erro ...
  }
};

// PUT /users/{id}
export const updateUser = async (id, userData) => {
  try {
    const response = await apiGeral.put(`/users/${id}`, userData); // Chamada para http://localhost:8080/users/123
    return response.data;
  } catch (error) {
    // ... tratamento de erro ...
  }
};

// DELETE /users/{id}
export const deleteUser = async (id) => {
  try {
    await apiGeral.delete(`/users/${id}`); // Chamada para http://localhost:8080/users/123
    return { sucesso: true, mensagem: "Usuário excluído com sucesso." };
  } catch (error) {
    // ... tratamento de erro ...
  }
};