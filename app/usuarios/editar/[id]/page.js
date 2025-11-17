// app/usuarios/editar/[id]/page.js
"use client";

import { useParams } from 'next/navigation';
import UsuarioForm from '@/components/usuarios/UsuarioForm';

export default function EditarUsuarioPage() {
  const { id } = useParams();

  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return <div className="p-4 text-red-500">ID de usuário inválido.</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <UsuarioForm userId={userId} />
    </div>
  );
}