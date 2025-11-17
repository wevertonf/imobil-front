// app/usuarios/criar/page.js
import UsuarioForm from '@/components/usuarios/UsuarioForm';

export default function CriarUsuarioPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <UsuarioForm />
    </div>
  );
}