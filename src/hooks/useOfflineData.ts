// src/hooks/useOfflineData.ts
// Hook genérico para busca de dados com suporte a cache offline

import { useState, useCallback } from "react";
import { useNetworkStatus } from "./useNetworkStatus";

type FetchFn<T> = () => Promise<T>;
type LocalFn<T> = () => Promise<T>;

interface UseOfflineDataOptions<T> {
  fetchFromApi: FetchFn<T>;
  fetchFromLocal: LocalFn<T>;
  onSuccess?: (data: T, fromCache: boolean) => void;
}

interface UseOfflineDataResult<T> {
  data: T | null;
  isLoading: boolean;
  isFromCache: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useOfflineData<T>({
  fetchFromApi,
  fetchFromLocal,
  onSuccess,
}: UseOfflineDataOptions<T>): UseOfflineDataResult<T> {
  const { isOnline } = useNetworkStatus();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (isOnline) {
      try {
        const apiData = await fetchFromApi();
        setData(apiData);
        setIsFromCache(false);
        onSuccess?.(apiData, false);
      } catch (err: any) {
        // Se a API falhar, tenta o cache
        try {
          const localData = await fetchFromLocal();
          setData(localData);
          setIsFromCache(true);
          onSuccess?.(localData, true);
        } catch {
          setError(err?.message || "Erro ao carregar dados.");
        }
      }
    } else {
      // Sem conexão: usa cache local
      try {
        const localData = await fetchFromLocal();
        setData(localData);
        setIsFromCache(true);
        onSuccess?.(localData, true);
      } catch {
        setError("Sem conexão e nenhum dado local disponível.");
      }
    }

    setIsLoading(false);
  }, [isOnline, fetchFromApi, fetchFromLocal]);

  return { data, isLoading, isFromCache, error, refresh };
}
