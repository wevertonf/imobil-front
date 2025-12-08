// app/login/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUsuario } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Home, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUsuario(formData);

      if (response.data.logado) {
        login(response.data.usuario);
        toast.success("Login realizado com sucesso! 🎉");
        router.push('/imoveis');
      } else {
        toast.error(response.data.mensagem || "Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      const errorMessage = error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Efeitos de fundo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/30 mb-4 transform hover:scale-110 transition-transform duration-300">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Laion Imobiliária</h1>
        </div>

        <Card className="shadow-2xl rounded-2xl border border-purple-500/20 bg-slate-800/50 backdrop-blur-xl transform hover:scale-[1.01] transition-transform duration-300">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Bem-vindo de Volta
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Entre com suas credenciais para continuar
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo E-mail */}
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-gray-200 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  E-mail
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-slate-900/50 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all pl-4 h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2 group">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha" className="text-gray-200 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    Senha
                  </Label>
                  
                </div>
                <div className="relative">
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    className="bg-slate-900/50 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all pl-4 h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Botão Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all h-12 rounded-xl font-semibold text-base group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Entrar
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            

            
          </CardContent>

        
        </Card>

      </div>
    </div>
  );
}