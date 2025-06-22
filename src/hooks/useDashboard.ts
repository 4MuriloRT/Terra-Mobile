import { useState, useEffect } from "react";
import { fetchClima, fetchCotacao, fetchNoticia } from "../services/api";

interface Clima {
  data: string;
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
  img: string;
}

export const useDashboard = () => {
  const [clima, setClima] = useState<Clima | null>(null);
  const [cotacao, setCotacao] = useState<Cotacao | null>(null);
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [climaData, cotacaoData, noticiaData] = await Promise.all([
          fetchClima(),
          fetchCotacao("SOJA"),
          fetchNoticia("milho,soja", 7),
        ]);

        let climaParaExibir = null;
        if (climaData?.previsaoProximosDias?.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          climaParaExibir = climaData.previsaoProximosDias.find(
            (p: any) => p.data === today
          );

          if (!climaParaExibir) {
            climaParaExibir = climaData.previsaoProximosDias[0];
          }
        }
        setClima(climaParaExibir);

        setCotacao(cotacaoData);
        setNoticias(noticiaData.articles || []);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro ao carregar os dados.");
        console.error("Erro no useDashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { clima, cotacao, noticias, isLoading, error };
};
