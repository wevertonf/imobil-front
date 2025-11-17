// app/bairros/editar/[id]/page.js
"use client";

import { useParams } from 'next/navigation';
import BairroForm from '@/components/bairros/BairroForm';

export default function EditarBairroPage() {
  const params = useParams();
  const { id } = params;

  // Converter id para número (pode vir como string)
  const bairroId = parseInt(id, 10);

  if (isNaN(bairroId)) {
    return <div className="p-4 text-red-500">ID de bairro inválido.</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <BairroForm bairroId={bairroId} />
    </div>
  );
}