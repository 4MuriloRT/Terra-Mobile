import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Welcome from "../pages/Welcome";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import TabRoutes from "../pages/TabNavigator/TabRoutes";
import { colors } from "../components/Colors"; // ajuste o caminho se estiver diferente

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ title: "Login" }} // usa o header padrão
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: "Cadastro" }} // usa o header padrão
      />
      <Stack.Screen
        name="Dashboard"
        component={TabRoutes}
        options={{ headerShown: false }}
      />
    
    </Stack.Navigator>
  );
}
