// app/tipos-imoveis/page.js
import TiposImoveisList from '@/components/tiposImoveis/TiposImoveisList';

export default function TiposImoveisPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <TiposImoveisList />
    </div>
  );
}