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

        // Promise.allSettled: mesmo que uma chamada falhe (ex: plano Free),
        // as outras continuam normalmente. Sem tela de erro por falta de plano PRO.
        const [climaResult, cotacaoResult, noticiaResult] =
          await Promise.allSettled([
            fetchClima(),
            fetchCotacao("SOJA"),
            fetchNoticia("milho,soja", 7),
          ]);

        // Clima (público — raramente falha, mas tratamos mesmo assim)
        if (climaResult.status === "fulfilled") {
          const climaData = climaResult.value;
          let climaParaExibir = null;
          if (climaData?.previsaoProximosDias?.length > 0) {
            const today = new Date().toISOString().split("T")[0];
            climaParaExibir =
              climaData.previsaoProximosDias.find(
                (p: any) => p.data === today
              ) || climaData.previsaoProximosDias[0];
          }
          setClima(climaParaExibir);
        }

        // Cotação (requer plano PRO — pode retornar 403)
        if (cotacaoResult.status === "fulfilled") {
          setCotacao(cotacaoResult.value);
        }
        // Se falhou por falta de plano, simplesmente fica null (sem crash)

        // Notícias (público — tratamos mesmo assim)
        if (noticiaResult.status === "fulfilled") {
          setNoticias(noticiaResult.value?.articles || []);
        }
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