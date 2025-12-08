// components/imoveis/FotosImoveisUpload.jsx
"use client";

import { useState, useEffect } from 'react';
import { uploadFotoImovel } from '@/services/fotosImoveisService';
import { toast } from 'sonner';

export default function FotosImoveisUpload({ imovelId, onUploadSuccess, fotosExistentes = [] }) {
  const [arquivo, setArquivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capa, setCapa] = useState(false);
  const [ordem, setOrdem] = useState(0);

  // Calcular próxima ordem automaticamente
  useEffect(() => {
    if (fotosExistentes && fotosExistentes.length > 0) {
      const maxOrdem = Math.max(...fotosExistentes.map(f => f.ordem || 0));
      setOrdem(maxOrdem + 1);
    } else {
      setOrdem(1);
    }
  }, [fotosExistentes]);

  // Se não há fotos, marcar como capa automaticamente
  useEffect(() => {
    if (fotosExistentes.length === 0) {
      setCapa(true);
    }
  }, [fotosExistentes]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validação
      if (!file.type.startsWith('image/')) {
        setError("Por favor, selecione um arquivo de imagem válido (JPEG, PNG, etc.).");
        setArquivo(null);
        setPreview(null);
        return;
      }

      // Limitar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Arquivo muito grande. Tamanho máximo: 10MB");
        setArquivo(null);
        setPreview(null);
        return;
      }

      setError(null);
      setArquivo(file);

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
      // Criar FormData corretamente
      const formData = new FormData();
      
      // Adicionar o arquivo com o nome 'arquivo' (conforme esperado pelo backend)
      formData.append('arquivo', arquivo);
      
      // Adicionar os dados como JSON string no campo 'dados'
      const dados = {
        imovelId: imovelId,
        capa: capa,
        ordem: ordem,
      };
      formData.append('dados', JSON.stringify(dados));

      console.log('Enviando foto com dados:', dados);
      console.log('Arquivo:', arquivo.name, arquivo.size, 'bytes');

      // Chamar o serviço passando o FormData diretamente
      const response = await uploadFotoImovel(formData);
      
      toast.success(`Foto enviada com sucesso! ${capa ? '🌟 Definida como capa' : '📸'}`);
      
      // Limpar formulário
      setArquivo(null);
      setPreview(null);
      setCapa(false);
      
      // Calcular próxima ordem
      setOrdem(ordem + 1);
      
      // Atualizar lista de fotos no componente pai
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Reset do input file
      const fileInput = document.getElementById('arquivo');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || "Erro ao enviar foto.";
      setError(errorMessage);
      toast.error("Erro: " + errorMessage);
      console.error("Erro no upload de foto:", err);
      console.error("Resposta do servidor:", err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setArquivo(null);
    setPreview(null);
    setError(null);
    const fileInput = document.getElementById('arquivo');
    if (fileInput) fileInput.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-rose-500 bg-opacity-20 border border-rose-500 border-opacity-30 rounded-xl text-rose-300 text-sm">
          <p className="font-medium">⚠️ Erro:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Preview da imagem */}
      {preview && (
        <div className="relative rounded-xl overflow-hidden border-2 border-white border-opacity-20">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover"
          />
          {capa && (
            <div className="absolute top-3 left-3 bg-yellow-500 bg-opacity-90 px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              FOTO CAPA
            </div>
          )}
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={handleClear}
              className="p-2 bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-black rounded-full transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input de arquivo customizado */}
      <div className="space-y-2">
        <label htmlFor="arquivo" className="text-black text-sm font-medium block">
          Selecione uma imagem
        </label>
        <div className="relative">
          <input
            id="arquivo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            required
          />
          <label
            htmlFor="arquivo"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white bg-opacity-5 hover:bg-opacity-10 border-2 border-dashed border-white border-opacity-30 hover:border-opacity-50 rounded-xl cursor-pointer transition-all text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm truncate max-w-xs">
              {arquivo ? arquivo.name : 'Clique para selecionar uma foto'}
            </span>
          </label>
        </div>
        <p className="text-xs text-black opacity-50">
          Formatos aceitos: JPEG, PNG, GIF • Tamanho máximo: 10MB
        </p>
      </div>

      {/* Opções de Capa e Ordem */}
      {arquivo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-20">
          {/* Checkbox Capa */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={capa}
              onChange={(e) => setCapa(e.target.checked)}
              className="w-5 h-5 rounded border-white border-opacity-40 bg-white bg-opacity-10 text-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 cursor-pointer"
            />
            <div className="flex-1">
              <span className="text-black text-sm font-medium block">Definir como Capa</span>
              <span className="text-black opacity-60 text-xs">
                {fotosExistentes.length === 0 ? '(Primeira foto - obrigatório)' : '(Substituir capa atual)'}
              </span>
            </div>
          </label>

          {/* Input Ordem */}
          <div className="space-y-1">
            <label htmlFor="ordem" className="text-black text-sm font-medium block">
              Ordem de Exibição
            </label>
            <input
              id="ordem"
              type="number"
              min="1"
              value={ordem}
              onChange={(e) => setOrdem(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all"
            />
            <p className="text-xs text-black opacity-60">
              Próxima disponível: {ordem}
            </p>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !arquivo}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Enviar Foto {capa && '⭐'}
            </>
          )}
        </button>

        {arquivo && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-black border border-white border-opacity-30 rounded-xl transition-all font-medium"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Info */}
      <div className="text-xs text-black opacity-50 text-center space-y-1">
        <p>ID do Imóvel: {imovelId}</p>
        <p>Total de fotos: {fotosExistentes.length}</p>
      </div>
    </form>
  );
}