// components/usuarios/UsuarioList.jsx

"use client"; //No Next.js 13+ com App Router, os componentes são Server Components por padrão.
// Hooks do React (como useState, useEffect, useRouter) só funcionam em Client Components.

/* 
Server Components (padrão): São renderizados no servidor. São mais eficientes para conteúdo estático ou que não precisa
de interatividade imediata. Não podem usar hooks do React.
Client Components ("use client"): São renderizados no cliente (navegador). São necessários quando você precisa de:
- Estado (useState)
- Efeitos (useEffect)
- Eventos (onClick, onSubmit)
- Navegação (useRouter)
- Outros hooks do React
Como UsuarioList.jsx faz requisições assíncronas (getAllUsers, deleteUser) e gerencia estado (useState, useEffect),
ele precisa ser um Client Component.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Plus, Edit, Eye } from 'lucide-react';
import StyledCard from '@/components/ui/StyledCard';
import StyledButton from '@/components/ui/StyledButton';

export default function UsuarioList({ usuarios, loading, error, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Erro: {error}
      </div>
    );
  }

  return (
    <StyledCard 
      title="Gestão de Usuários" 
      description="Visualize, edite e gerencie os usuários do sistema."
      footer={
        <div className="flex justify-end">
          <Link href="/usuarios/criar">
            <StyledButton variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Novo Usuário
            </StyledButton>
          </Link>
        </div>
      }
      className="w-full"
    >
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</TableHead>
              <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{usuario.id}</TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{usuario.nome}</TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{usuario.email}</TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    usuario.tipo === 'ADMIN' ? 'bg-red-100 text-red-800' :
                    usuario.tipo === 'CORRETOR' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {usuario.tipo}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    <Link href={`/usuarios/visualizar/${usuario.id}`}>
                      <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                    </Link>
                    <Link href={`/usuarios/editar/${usuario.id}`}>
                      <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4 mr-1" /> Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o usuário <strong>{usuario.nome}</strong> (ID: {usuario.id})?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(usuario)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {usuarios.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum usuário encontrado.</p>
        </div>
      )}
    </StyledCard>
  );
}