// app/imoveis/meus/page.js
import MeusImoveisList from '@/components/imoveis/MeusImoveisList';

export default function MeusImoveisPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <MeusImoveisList />
    </div>
  );
}