// app/imoveis/visualizar/[id]/page.js
"use client";

import ImovelDetalhe from '@/components/imoveis/ImovelDetalhe';

export default function VisualizarImovelPage({ params }) {
  const { id } = params;

  // Converter id para número (pode vir como string)
  const imovelId = parseInt(id, 10);

  if (isNaN(imovelId)) {
    return <div className="p-4 text-red-500">ID de imóvel inválido.</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <ImovelDetalhe imovelId={imovelId} />
    </div>
  );
}