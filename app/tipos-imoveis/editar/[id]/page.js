// app/tipos-imoveis/editar/[id]/page.js
"use client";

import { useParams } from 'next/navigation';
import TiposImoveisForm from '@/components/tiposImoveis/TiposImoveisForm';

export default function EditarTipoImovelPage() {
  const params = useParams();
  const { id } = params;

  // Converter id para número (pode vir como string)
  const tipoId = parseInt(id, 10);

  if (isNaN(tipoId)) {
    return <div className="p-4 text-red-500">ID de tipo de imóvel inválido.</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <TiposImoveisForm tipoId={tipoId} />
    </div>
  );
}