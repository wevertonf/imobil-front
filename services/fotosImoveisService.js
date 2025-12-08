// services/fotosImoveisService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Criar instância do axios com credenciais
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para enviar cookies de sessão
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * Upload de foto de imóvel
 * @param {FormData} formData - FormData já montado com 'arquivo' e 'dados'
 */
export const uploadFotoImovel = async (formData) => {
  try {
    const response = await api.post('/fotos-imoveis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer upload de foto:', error);
    throw error;
  }
};

/**
 * Buscar todas as fotos de um imóvel
 */
export const getFotosByImovelId = async (imovelId) => {
  try {
    const response = await api.get(`/fotos-imoveis/imoveis/${imovelId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fotos do imóvel:', error);
    throw error;
  }
};

/**
 * Buscar foto por ID
 */
export const getFotoById = async (id) => {
  try {
    const response = await api.get(`/fotos-imoveis/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar foto:', error);
    throw error;
  }
};

/**
 * Atualizar dados de uma foto (não o arquivo)
 */
export const updateFoto = async (id, dados) => {
  try {
    const response = await api.put(`/fotos-imoveis/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    throw error;
  }
};

/**
 * Excluir uma foto
 */
export const deleteFoto = async (id) => {
  try {
    const response = await api.delete(`/fotos-imoveis/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir foto:', error);
    throw error;
  }
};

/**
 * Definir foto como capa
 */
export const setFotoAsCapa = async (id, imovelId) => {
  try {
    const response = await api.put(`/fotos-imoveis/${id}`, {
      capa: true,
      imovelId: imovelId,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao definir foto como capa:', error);
    throw error;
  }
};