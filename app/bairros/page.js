// app/bairros/page.js
import BairroList from '@/components/bairros/BairroList';

export default function BairrosPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <BairroList />
    </div>
  );
}