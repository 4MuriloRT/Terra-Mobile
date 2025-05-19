import React from "react";
import { StatusBar, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import { colors } from "./src/components/Colors"; // importe as cores
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={colors.primary} // usando a cor do arquivo colors
          barStyle="light-content"
          translucent={false}
        />
        <Routes />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // fundo do app
  },
});
