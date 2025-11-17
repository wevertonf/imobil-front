// services/authService.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiAuth = axios.create({
  baseURL: `${API_BASE_URL}/auth`, // <-- Atualizado para /auth
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial para enviar/receber cookies de sessão
});

// Instância genérica para outros recursos (usuários, imóveis, etc.)
export const apiGeral = axios.create({
  baseURL: API_BASE_URL, // Base: http://localhost:8080
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <--- ESTA LINHA É CRUCIAL AQUI TAMBÉM!
});

// Função para fazer login
export const loginUsuario = async (credentials) => {
  try {
    const response = await apiAuth.post('/login', credentials);
    // O backend retorna 200 OK com os dados do usuário
    // A resposta já está no formato correto
    // Mas para manter consistência com getStatusUsuario, vamos encapsular
    return { data: { usuario: response.data, logado: true, mensagem: "Login bem-sucedido." } };
  } catch (error) {
    console.error("Erro no authService.loginUsuario:", error);
    // Se o backend retornar 401, o error.response.status será 401
    // Se for erro de rede, error.response pode ser undefined
    if (error.response && error.response.status === 401) {
        // Credenciais inválidas
        return { data: { usuario: null, logado: false, mensagem: error.response.data?.message || "Credenciais inválidas." } };
    }
    // Outro erro (rede, 500, etc.)
    throw error; // O erro será tratado no componente que chama esta função
  }
};

export const logoutUsuario = async () => {
  try {
    console.log("Tentando fazer logout..."); // Log temporário para debug
    const response = await apiAuth.post('/logout');
    console.log("Logout bem-sucedido:", response.status, response.data); // Log temporário
    return response;
  } catch (error) {
    console.error("Erro no authService.logoutUsuario:", error); // Log detalhado
    // O erro será tratado no componente que chama esta função
    throw error;
  }
};

// Função para verificar status de login
export const getStatusUsuario = async () => {
  try {
    const response = await apiAuth.get('/status');
    // O backend retorna 200 OK com os dados do usuário logado
    return { data: { usuario: response.data, logado: true, mensagem: "Usuário logado." } };
  } catch (error) {
    // Verificar se o erro é 401 (não autorizado = usuário não logado)
    if (error.response && error.response.status === 401) {
      // O usuário não está logado - não é um erro de verdade, é um status
      // Retornar um objeto indicando que não está logado
      return { data: { usuario: null, logado: false, mensagem: error.response.data?.message || "Usuário não está logado." } };
    } else {
      // Outro erro (rede, 500, etc.) - esse sim é um erro real
      console.error("Erro ao verificar status de login:", error);
      throw error; // Relança o erro para quem chamou lidar (ex: mostrar mensagem genérica)
    }
  }
};