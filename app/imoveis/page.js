// app/imoveis/page.js
import ImoveisList from '@/components/imoveis/ImoveisList';

export default function ImoveisPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <ImoveisList />
    </div>
  );
}