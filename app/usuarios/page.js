// /app/usuarios/page.js
"use client";

import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '@/services/usuarioService';
import UsuarioList from '@/components/usuarios/UsuarioList';
import { toast } from 'sonner';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsuarios(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar usuários.');
        toast.error("Erro ao carregar usuários: " + (err.message || 'Erro desconhecido'));
        console.error("Erro no componente UsuariosPage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = (usuario) => {
    if (confirm(`Tem certeza que deseja excluir o usuário "${usuario.nome}" (ID: ${usuario.id})?`)) {
      deleteUser(usuario.id)
        .then(() => {
          setUsuarios(usuarios.filter(u => u.id !== usuario.id));
          toast.success(`Usuário "${usuario.nome}" excluído com sucesso!`);
        })
        .catch((error) => {
          console.error("Erro ao excluir usuário:", error);
          toast.error("Erro ao excluir usuário: " + (error.response?.data?.message || error.message || 'Erro desconhecido'));
        });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
      <UsuarioList
        usuarios={usuarios}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onEdit={(usuario) => console.log("Editar usuário:", usuario.id)} // Placeholder, implemente se necessário
      />
    </div>
  );
}