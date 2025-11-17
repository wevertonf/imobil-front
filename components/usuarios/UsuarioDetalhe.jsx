// src/components/usuarios/UsuarioDetalhe.jsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, User, Mail, UserRound, Home, Building } from 'lucide-react'; // Ícones (instale lucide-react se não tiver)
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UsuarioDetalhe({ usuario, loading = false, error = null }) {
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="shadow-xl rounded-xl border-0 bg-gradient-to-br from-gray-50 to-gray-100">
          <CardHeader className="border-b border-gray-200 pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-24 mt-4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-24 mt-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-10 w-full sm:w-32" />
              <Skeleton className="h-10 w-full sm:w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="w-full max-w-2xl mx-auto shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert className="w-full max-w-2xl mx-auto shadow-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Usuário não encontrado</AlertTitle>
          <AlertDescription>
            O usuário solicitado não existe ou foi excluído.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Link href="/usuarios">
            <Button variant="outline" className="text-gray-700 hover:text-gray-900">
              Voltar para Lista de Usuários
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Função para formatar o tipo de usuário com cor
  const getTipoBadgeVariant = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case 'ADMIN':
        return 'destructive'; // Vermelho
      case 'CORRETOR':
        return 'default';     // Azul (padrão)
      case 'CLIENTE':
        return 'secondary';   // Cinza
      default:
        return 'outline';     // Borda
    }
  };

  // Função para obter cor de fundo baseada no tipo
  const getTipoBgColor = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'CORRETOR':
        return 'bg-blue-100 text-blue-800';
      case 'CLIENTE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-4xl">
      <Card className="shadow-2xl rounded-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-gray-50">
        {/* Cabeçalho com gradiente e informações principais */}
        <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white pb-6 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <UserRound className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {usuario.nome || 'Nome não informado'}
                </CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  Detalhes do usuário #{usuario.id}
                </CardDescription>
              </div>
            </div>
            {usuario.tipo && (
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getTipoBgColor(usuario.tipo)}`}>
                {usuario.tipo}
              </div>
            )}
          </div>
        </CardHeader>

        {/* Conteúdo principal */}
        <CardContent className="p-6 space-y-8">
          {/* Seção: Informações Pessoais */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 border-gray-200 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" /> Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p className="text-lg font-semibold text-gray-900 font-mono bg-white px-3 py-1 rounded border border-gray-300">
                  {usuario.id}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-lg font-semibold text-gray-900">
                  {usuario.nome || '-'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <p className="text-lg font-semibold text-blue-600 break-all">
                    {usuario.email || '-'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Separador */}
          <Separator className="my-2 bg-gray-300" />

          {/* Seção: Detalhes do Perfil */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 border-gray-200 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" /> Detalhes do Perfil
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-500">Tipo de Usuário</p>
              <div className="mt-1">
                {usuario.tipo ? (
                  <Badge variant={getTipoBadgeVariant(usuario.tipo)} className="text-sm">
                    {usuario.tipo}
                  </Badge>
                ) : (
                  <span className="text-gray-500 italic">Não definido</span>
                )}
              </div>
            </div>
          </section>

          {/* Ações */}
          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <Link href={`/usuarios/editar/${usuario.id}`} className="w-full sm:w-auto">
              <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform hover:scale-[1.02]">
                <UserRound className="h-4 w-4 mr-2" /> Editar Perfil
              </Button>
            </Link>
            <Link href="/usuarios" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm">
                <Home className="h-4 w-4 mr-2" /> Voltar para Lista
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}