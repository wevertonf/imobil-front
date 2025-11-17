// app/imoveis/editar/[id]/page.js
"use client";

import { useParams } from 'next/navigation';
import ImoveisForm from '@/components/imoveis/ImoveisForm';

export default function EditarImovelPage() {
  const params = useParams();
  const { id } = params;

  const imovelId = parseInt(id, 10);

  if (isNaN(imovelId)) {
    return <div className="p-4 text-red-500">ID de imóvel inválido.</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <ImoveisForm imovelId={imovelId} />
    </div>
  );
}