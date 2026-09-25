// src/hooks/useNetworkStatus.ts
// Hook que monitora o estado da conexão de rede em tempo real

import { useState, useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica o estado inicial
    NetInfo.fetch().then((state: NetInfoState) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setIsOnline(online);
      setIsConnected(state.isConnected);
    });

    // Assina as mudanças de conectividade
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setIsOnline(online);
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return { isOnline, isConnected };
}
