import { useState, useEffect } from 'react';
import {
  fetchClima,
  fetchCotacao,
  fetchNoticia,
} from '../services/api';

// --- DEFINIÇÃO DAS INTERFACES ---
interface Clima {
  temperaturaMax: number;
  condicao: string;
}

interface Cotacao {
  precoAtual: number;
  simbolo: string;
}

interface Noticia {
  titulo: string;
  url: string;
  descricao: string;
  img: string; // Campo para a URL da imagem
}

// ... (importações e interfaces existentes)

export const useDashboard = () => {
  const [clima, setClima] = useState<Clima | null>(null);
  const [cotacao, setCotacao] = useState<Cotacao | null>(null);
  // Renomeando para o plural e ajustando o tipo para ser um array de Noticia
  const [noticias, setNoticias] = useState<Noticia[]>([]); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          climaData,
          cotacaoData,
          noticiaData,
        ] = await Promise.all([
          fetchClima(),
          fetchCotacao('SOJA'),
          fetchNoticia('agronegocio,rural'), // Não precisamos mais passar o 'size' aqui, pois já definimos no serviço
        ]);

        const today = new Date().toISOString().split('T')[0];
        const climaDeHoje = climaData.previsaoProximosDias.find((p: any) => p.data === today);
        setClima(climaDeHoje || null);

        setCotacao(cotacaoData);
        
        // Salvamos o array completo de artigos de notícia
        setNoticias(noticiaData.articles || []);
        
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao carregar os dados.');
        console.error("Erro no useDashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Retornando a lista de notícias
  return { clima, cotacao, noticias, isLoading, error };
};