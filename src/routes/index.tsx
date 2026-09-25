// src/routes/index.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../components/Colors";

// Auth
import Welcome from "../pages/Welcome";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";

// Tab Navigator
import TabRoutes from "../pages/TabNavigator/TabRoutes";

// Dashboard
import DashboardScreen from "../pages/Dashboard/DashboardScreen";

// Fazendas
import FazendasScreen from "../pages/Fazendas/FazendasScreen";
import AddFarmScreen from "../pages/Fazendas/AddFarmScreen";

// Talhões (novo)
import TalhoesScreen from "../pages/Talhoes/TalhoesScreen";
import AddTalhaoScreen from "../pages/Talhoes/AddTalhaoScreen";

// Cultivares
import AddCultivoScreen from "../pages/Cultivos/AddCultivoScreen";
import CultivosScreen from "../pages/Cultivos/CultivosScreen";

// Plantio
import PlantioScreen from "../pages/Plantio/PlantioScreen";
import ListPlantioScreen from "../pages/Plantio/ListPlantioScreen";
import SelectCultivarScreen from "../pages/Plantio/SelectCultivarScreen";
import AddPlantioScreen from "../pages/Plantio/AddPlantioScreen";
import ResultadoAnaliseSoloScreen from "../pages/Plantio/ResultadoAnaliseSoloScreen";

// Operações de Plantio (novo)
import OperacoesScreen from "../pages/Operacoes/OperacoesScreen";
import AddOperacaoScreen from "../pages/Operacoes/AddOperacaoScreen";

// Aplicações (novo)
import AplicacoesScreen from "../pages/Aplicacoes/AplicacoesScreen";
import AddAplicacaoScreen from "../pages/Aplicacoes/AddAplicacaoScreen";

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
      {/* ── Auth ── */}
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

      {/* ── Tab Navigator ── */}
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

      {/* ── Fazendas ── */}
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

      {/* ── Talhões ── */}
      <Stack.Screen
        name="TalhoesScreen"
        component={TalhoesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTalhaoScreen"
        component={AddTalhaoScreen}
        options={{ headerShown: false }}
      />

      {/* ── Cultivares ── */}
      <Stack.Screen
        name="AddCultivoScreen"
        component={AddCultivoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CultivosScreen"
        component={CultivosScreen}
        options={{ title: "Gestão de Cultivares" }}
      />

      {/* ── Plantio ── */}
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

      {/* ── Operações de Plantio ── */}
      <Stack.Screen
        name="OperacoesScreen"
        component={OperacoesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddOperacaoScreen"
        component={AddOperacaoScreen}
        options={{ headerShown: false }}
      />

      {/* ── Aplicações ── */}
      <Stack.Screen
        name="AplicacoesScreen"
        component={AplicacoesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddAplicacaoScreen"
        component={AddAplicacaoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
