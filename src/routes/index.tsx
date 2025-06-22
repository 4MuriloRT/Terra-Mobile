import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Removi a importação desnecessária do NavigationContainer
// Não é necessário importar 'View' aqui, o erro provavelmente está em outro lugar
// mas vamos garantir que a estrutura de rotas esteja limpa.

import Welcome from "../pages/Welcome";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import TabRoutes from "../pages/TabNavigator/TabRoutes";
import { colors } from "../components/Colors";
import DashboardScreen from "../pages/Dashboard/DashboardScreen";
import FazendasScreen from "../pages/Fazendas/FazendasScreen";
import AddFarmScreen from "../pages/Fazendas/AddFarmScreen";
import AddCultivoScreen from "../pages/Cultivos/AddCultivoScreen";
import CultivosScreen from "../pages/Cultivos/CultivosScreen";

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
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: "Cadastro" }}
      />

      <Stack.Screen
        name="DashboardTabs"
        component={TabRoutes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FazendasScreen"
        component={FazendasScreen}
        options={{ title: "Gestão de Fazendas" }}
      />
      <Stack.Screen
        name="AddFarmScreen"
        component={AddFarmScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AddCultivoScreen"
        component={AddCultivoScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CultivosScreen"
        component={CultivosScreen}
        options={{ title: "Gestão de Cultivos" }}
      />
    </Stack.Navigator>
  );
}
