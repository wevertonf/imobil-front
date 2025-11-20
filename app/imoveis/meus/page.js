// app/imoveis/meus/page.js
// Esta página é para "Meus Imóveis"
// Ela deve garantir que o usuário está logado e exibir a lista filtrada
// O filtro agora é feito automaticamente pelo ImoveisList se usuarioLogado estiver presente e usuarioIdFiltro for null

import ImoveisList from '@/components/imoveis/ImoveisList';

export default function MeusImoveisPage() {
  // O componente ImoveisList já lida com o login e o filtro "meus imóveis"
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* usuarioIdFiltro = null, então ImoveisList.js usará getMeusImoveis() se usuarioLogado existir */}
      <ImoveisList usuarioIdFiltro={null} />
    </div>
  );
}