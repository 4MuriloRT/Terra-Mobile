// src/pages/Header/index.tsx
import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Platform, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../contexts/AuthContext";
import { RootStackParamList } from "../../screens/Types";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const getFirstName = () => {
    if (user?.nome) return user.nome.split(" ")[0];
    return "Bem-vindo";
  };

  const getPlanoBadge = () => {
    const plano = (user as any)?.tipoPlano || "FREE";
    const map: Record<string, { label: string; color: string }> = {
      FREE:    { label: "Free",    color: "#6b7280" },
      PRO:     { label: "Pro",     color: "#4b7940" },
      PREMIUM: { label: "Premium", color: "#D4A373" },
      BASICO:  { label: "Básico",  color: "#6b7280" },
    };
    return map[plano] ?? map["FREE"];
  };

  const handleProfilePress = () => {
    const plano = getPlanoBadge();
    Alert.alert(
      user?.nome || "Perfil",
      `Email: ${user?.email || "—"}\nPlano: ${plano.label}\nFunção: ${user?.role || "USER"}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair da Conta",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
          },
        },
      ]
    );
  };

  const badge = getPlanoBadge();

  return (
    // paddingTop = insets.top garante que o header começa ABAIXO da status bar do celular
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      {/* Esquerda: logo + saudação */}
      <View style={styles.left}>
        <View style={styles.logoCircle}>
          <FontAwesome5 name="leaf" size={16} color="#4b7940" />
        </View>
        <View>
          <Text style={styles.greeting}>Olá, {getFirstName()} 👋</Text>
          <Text style={styles.subtitle}>Terra Manager</Text>
        </View>
      </View>

      {/* Direita: sino + avatar interativo */}
      <View style={styles.right}>
        {/* Sino de notificações */}
        <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert("Notificações", "Nenhuma notificação no momento.")}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Avatar — clicável para ver perfil / logout */}
        <TouchableOpacity onPress={handleProfilePress} style={styles.avatarBtn} activeOpacity={0.8}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {user?.nome?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          {/* Badge do plano */}
          <View style={[styles.planoBadge, { backgroundColor: badge.color }]}>
            <Text style={styles.planoBadgeText}>{badge.label}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a2e1a",
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // Sem borderRadius no topo — ele vai até o edge do celular
  },

  // Esquerda
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(75,121,64,0.25)",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "rgba(75,121,64,0.5)",
  },
  greeting: { fontSize: 16, fontWeight: "700", color: "#fff" },
  subtitle:  { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 },

  // Direita
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  avatarBtn: { alignItems: "center" },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#4b7940",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.3)",
  },
  avatarInitial: { fontSize: 18, fontWeight: "800", color: "#fff" },
  planoBadge: {
    position: "absolute",
    bottom: -5,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1a2e1a",
  },
  planoBadgeText: { fontSize: 8, fontWeight: "700", color: "#fff" },
});
