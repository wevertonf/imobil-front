// components/imoveis/FotosImoveisUpload.jsx
"use client";

import { useState } from 'react';
import { uploadFotoImovel } from '@/services/fotosImoveisService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FotosImoveisUpload({ imovelId }) { // Recebe o ID do imóvel como prop
  const [arquivo, setArquivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validação básica (opcional)
      if (!file.type.startsWith('image/')) {
        setError("Por favor, selecione um arquivo de imagem válido (JPEG, PNG, etc.).");
        setArquivo(null);
        return;
      }
      setError(null); // Limpa erro anterior
      setArquivo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo) {
      setError("Por favor, selecione uma imagem.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Dados que serão enviados como JSON
      const dados = {
        imovelId: imovelId, // ID do imóvel ao qual a foto pertence
        capa: false, // Valor padrão
        ordem: 0,   // Valor padrão
        // nome_arquivo: arquivo.name, // O nome do arquivo será gerado no backend
      };

      const response = await uploadFotoImovel(arquivo, dados);
      toast.success("Foto enviada com sucesso!");
      // Limpar o formulário após sucesso
      setArquivo(null);
      // Opcional: Atualizar a lista de fotos no componente pai (ImovelDetalhe)
      // Ex: onFotoAdicionada(response.data) se ImovelDetalhe passar essa função como prop

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao enviar foto.";
      setError(errorMessage);
      toast.error("Erro: " + errorMessage);
      console.error("Erro no upload de foto:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md rounded-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Enviar Nova Foto</CardTitle>
        <CardDescription>
          Carregue uma imagem para este imóvel. O arquivo será salvo no servidor.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">Erro:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="arquivo">Arquivo de Imagem *</Label>
            <Input
              id="arquivo"
              type="file"
              accept="image/*" // Apenas imagens
              onChange={handleFileChange}
              required
              className="focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border-gray-300"
            />
          </div>
          <div className="text-sm text-gray-500">
            <p>ID do Imóvel: {imovelId}</p>
            {/* Outros campos do DTO podem ser adicionados aqui se necessário */}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              "Enviar Foto"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setArquivo(null)} // Limpar campo
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Limpar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}