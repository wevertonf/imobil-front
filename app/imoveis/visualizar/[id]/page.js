// src/app/imoveis/visualizar/[id]/page.js
// ✅ Pode continuar sendo Server Component
import ImovelDetalhe from '@/components/imoveis/ImovelDetalhe';
import * as React from 'react'; // Importe o React

export default function VisualizarImovelPage({ params }) { // params é uma Promise
  const { id } = React.use(params); // ✅ Desembrulhe a Promise com React.use()

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