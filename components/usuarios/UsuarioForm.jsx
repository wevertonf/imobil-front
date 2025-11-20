// components/usuarios/UsuarioForm.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserById, createUser, updateUser } from '@/services/usuarioService';
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';
import StyledInput from '@/components/ui/StyledInput';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function UsuarioForm({ userId }) { // userId é passado se for edição
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'CLIENTE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      const fetchUsuario = async () => {
        try {
          setLoading(true);
          const usuario = await getUserById(userId);
          if (usuario) {
            setFormData({
              nome: usuario.nome || '',
              email: usuario.email || '',
              senha: '', // Não exibe senha existente
              tipo: usuario.tipo || 'CLIENTE',
            });
          } else {
            toast.error("Usuário não encontrado.");
            router.push('/usuarios');
          }
        } catch (err) {
          setError('Erro ao carregar dados do usuário.');
          toast.error("Erro ao carregar dados do usuário: " + (err.message || 'Erro desconhecido'));
          console.error("Erro ao buscar usuário:", err);
          router.push('/usuarios');
        } finally {
          setLoading(false);
        }
      };

      fetchUsuario();
    }
  }, [userId, router]);

  // Certifique-se de que o handleChange atualiza o estado corretamente
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("Campo alterado:", name, "Valor:", value); // Log para debug
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("Dados sendo enviados:", formData);

    try {
      if (userId) {
        await updateUser(userId, formData);
        toast.success('Usuário atualizado com sucesso!', {
          position: 'top-center',
        });
      } else {
        if (!formData.senha) {
          setError('Senha é obrigatória para cadastro.');
          setLoading(false);
          return;
        }
        await createUser(formData);
        toast.success('Usuário criado com sucesso!', {
          position: 'top-center',
        });
      }
      router.push('/usuarios');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar usuário.';
      setError(errorMsg);
      toast.error("Erro: " + errorMsg, {
        position: 'top-center',
      });
      console.error("Erro ao salvar usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <StyledCard
      title={userId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
      description={userId
        ? 'Altere as informações do usuário abaixo.'
        : 'Preencha os dados para cadastrar um novo usuário no sistema.'}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mensagem de Erro Global */}
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-medium">Erro:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <StyledInput
            label="Nome *"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome completo"
            required
          />

          <StyledInput
            label="E-mail *"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@exemplo.com"
            required
          />

          {!userId && ( // Campo de senha aparece apenas na criação
            <StyledInput
              label="Senha *"
              id="senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite uma senha segura"
              required={!userId}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">Tipo *</Label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border-gray-300"
            >
              <option value="">Selecione um tipo</option>
              <option value="ADMIN">Administrador</option>
              <option value="CORRETOR">Corretor</option>

            </select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <StyledButton
            type="submit"
            variant="default"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {userId ? 'Atualizando...' : 'Cadastrando...'}
              </>
            ) : (
              userId ? 'Atualizar Usuário' : 'Cadastrar Usuário'
            )}
          </StyledButton>
          <Link href="/usuarios">
            <StyledButton
              variant="outline"
              type="button"
              className="w-full sm:w-auto"
            >
              Voltar para Lista
            </StyledButton>
          </Link>
        </div>
      </form>
    </StyledCard>
  );
}