// App.tsx
import React, { useEffect, useRef } from "react";
import { StatusBar, View, StyleSheet, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";

import Routes from "./src/routes";
import { colors } from "./src/components/Colors";
import { AuthProvider } from "./src/contexts/AuthContext";
import OfflineBanner from "./src/components/OfflineBanner";
import { runFullSync } from "./src/services/syncService";

export default function App() {
  const wasOffline = useRef(false);

  useEffect(() => {
    // Sincroniza quando a conexão é restaurada
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline =
        state.isConnected === true && state.isInternetReachable !== false;

      if (isOnline && wasOffline.current) {
        wasOffline.current = false;
        runFullSync().catch(console.warn);
      } else if (!isOnline) {
        wasOffline.current = true;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar
            backgroundColor={colors.primary}
            barStyle="light-content"
            translucent={false}
          />
          <OfflineBanner />
          <Routes />
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
