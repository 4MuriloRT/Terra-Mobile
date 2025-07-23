// src/routes/index.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
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
import PlantioScreen from "../pages/Plantio/PlantioScreen";
import ListPlantioScreen from "../pages/Plantio/ListPlantioScreen";
import SelectCultivarScreen from "../pages/Plantio/SelectCultivarScreen";
import AddPlantioScreen from "../pages/Plantio/AddPlantioScreen";
//import AnaliseSoloScreen from "../pages/Plantio/AnaliseSoloScreen";
import ResultadoAnaliseSoloScreen from "../pages/Plantio/ResultadoAnaliseSoloScreen";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      {/* ... Suas telas existentes ... */}
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCultivoScreen"
        component={AddCultivoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CultivosScreen"
        component={CultivosScreen}
        options={{ title: "Gestão de Cultivos" }}
      />
      <Stack.Screen
        name="PlantioScreen"
        component={PlantioScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListPlantioScreen"
        component={ListPlantioScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectCultivarScreen"
        component={SelectCultivarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPlantioScreen"
        component={AddPlantioScreen}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="ResultadoAnaliseSoloScreen"
        component={ResultadoAnaliseSoloScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
