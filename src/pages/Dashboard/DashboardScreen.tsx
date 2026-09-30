import React, { useState, useEffect } from "react";
import {
  View, ScrollView, StyleSheet, Text,
  Linking, Alert, Image, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DashboardHeader } from "../Header";
import DashboardCarousel from "./DashboardCarousel";
import { useDashboard } from "../../hooks/useDashboard";
import { RootStackParamList } from "../../screens/Types";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// ─── Mini-componentes de conteúdo dos cards ───────────────────────────────────

const ClimaCard = ({ data, loading }: { data: any; loading: boolean }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoCardHeader}>
      <View style={[styles.infoIconCircle, { backgroundColor: "#eff6ff" }]}>
        <Ionicons name="partly-sunny-outline" size={20} color="#2563eb" />
      </View>
      <Text style={styles.infoCardTitle}>Clima</Text>
    </View>
    {loading
      ? <ActivityIndicator color="#2563eb" style={{ marginTop: 8 }} />
      : data
        ? <>
            <Text style={[styles.infoValue, { color: "#2563eb" }]}>
              {data.temperaturaMax.toFixed(1)}°C
            </Text>
            <Text style={styles.infoSub}>{data.condicao}</Text>
          </>
        : <Text style={styles.infoUnavailable}>Indisponível</Text>
    }
  </View>
);

const CotacaoCard = ({ data, loading }: { data: any; loading: boolean }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoCardHeader}>
      <View style={[styles.infoIconCircle, { backgroundColor: "#fffbeb" }]}>
        <Ionicons name="trending-up-outline" size={20} color="#d97706" />
      </View>
      <Text style={styles.infoCardTitle}>Cotação</Text>
    </View>
    {loading
      ? <ActivityIndicator color="#d97706" style={{ marginTop: 8 }} />
      : data
        ? <>
            <Text style={[styles.infoValue, { color: "#d97706" }]}>
              R$ {data.precoAtual.toFixed(2)}
            </Text>
            <Text style={styles.infoSub}>{data.simbolo}</Text>
          </>
        : <Text style={styles.infoUnavailable}>Plano PRO</Text>
    }
  </View>
);

// ─── Botão de atalho rápido ────────────────────────────────────────────────────
const QuickButton = ({
  label, icon, color, bg, onPress,
}: {
  label: string; icon: any; color: string; bg: string; onPress: () => void;
}) => (
  <TouchableOpacity style={styles.quickBtn} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.quickIcon, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.quickLabel} numberOfLines={1}>{label}</Text>
  </TouchableOpacity>
);

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { clima, cotacao, noticias, isLoading } = useDashboard();
  const navigation = useNavigation<NavigationProp>();
  const [currentNoticiaIndex, setCurrentNoticiaIndex] = useState(0);

  // Rotação automática de notícias a cada 10s
  useEffect(() => {
    if (noticias && noticias.length > 1) {
      const timer = setInterval(() => {
        setCurrentNoticiaIndex((prev) => (prev + 1) % noticias.length);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [noticias]);

  const noticiaAtual = noticias?.[currentNoticiaIndex] ?? null;

  const handleNoticiaPress = async (noticia: any) => {
    if (!noticia?.url) {
      Alert.alert("Erro", "Link da notícia não disponível.");
      return;
    }
    try {
      await Linking.openURL(noticia.url);
    } catch {
      Alert.alert("Erro", "Não foi possível abrir o link da notícia.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Header com safe area integrada ─────────────────────────── */}
      <DashboardHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Acesso Rápido ────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Acesso Rápido</Text>
        <View style={styles.quickRow}>
          <QuickButton
            label="Fazendas"
            icon="home-outline"
            color="#4b7940"
            bg="#f0f7ef"
            onPress={() => navigation.navigate("FazendasScreen")}
          />
          <QuickButton
            label="Cultivos"
            icon="leaf-outline"
            color="#2563eb"
            bg="#eff6ff"
            onPress={() => navigation.navigate("CultivosScreen")}
          />
          <QuickButton
            label="Plantio"
            icon="color-filter-outline"
            color="#d97706"
            bg="#fffbeb"
            onPress={() => navigation.navigate("PlantioScreen")}
          />
          <QuickButton
            label="Fornecedores"
            icon="storefront-outline"
            color="#7c3aed"
            bg="#f5f3ff"
            onPress={() => navigation.navigate("FornecedoresScreen")}
          />
        </View>

        {/* ── Carrossel de métricas ────────────────────────────────── */}
        <DashboardCarousel />

        {/* ── Linha: Clima + Cotação ───────────────────────────────── */}
        <Text style={styles.sectionLabel}>Condições de Mercado</Text>
        <View style={styles.row}>
          <ClimaCard   data={clima}   loading={isLoading} />
          <CotacaoCard data={cotacao} loading={isLoading} />
        </View>

        {/* ── Últimas Notícias ─────────────────────────────────────── */}
        {isLoading ? (
          <View style={styles.newsCardLoading}>
            <ActivityIndicator color="#4b7940" size="large" />
            <Text style={styles.loadingText}>Carregando notícias...</Text>
          </View>
        ) : noticias && noticias.length > 0 ? (
          <View style={styles.newsSection}>
            <View style={styles.newsSectionHeader}>
              <Text style={styles.sectionLabel}>Últimas Notícias</Text>
              <Text style={styles.newsCount}>{currentNoticiaIndex + 1}/{noticias.length}</Text>
            </View>

            <TouchableOpacity
              style={styles.newsCard}
              onPress={() => handleNoticiaPress(noticiaAtual)}
              activeOpacity={0.9}
            >
              {noticiaAtual?.img && (
                <Image
                  source={{ uri: noticiaAtual.img }}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.newsBody}>
                <View style={styles.newsTag}>
                  <Ionicons name="newspaper-outline" size={11} color="#4b7940" />
                  <Text style={styles.newsTagText}>Agronegócio</Text>
                </View>
                <Text style={styles.newsTitle} numberOfLines={3}>
                  {noticiaAtual?.titulo}
                </Text>
                <Text style={styles.newsDesc} numberOfLines={2}>
                  {noticiaAtual?.descricao}
                </Text>
                <View style={styles.newsFooter}>
                  <Text style={styles.newsReadMore}>Ler mais</Text>
                  <Ionicons name="arrow-forward" size={14} color="#4b7940" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Dots das notícias */}
            <View style={styles.newsDotsRow}>
              {noticias.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setCurrentNoticiaIndex(i)}
                  style={[styles.newsDot, i === currentNoticiaIndex && styles.newsDotActive]}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* Espaço para a tab bar */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f4",
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },

  // ── Acesso Rápido ─────────────────────────────────────────────────────────
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickBtn: {
    alignItems: "center",
    flex: 1,
  },
  quickIcon: {
    width: 54, height: 54, borderRadius: 16,
    justifyContent: "center", alignItems: "center",
    marginBottom: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
    marginTop: 6,
  },

  // ── Linha Clima + Cotação ─────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  infoIconCircle: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: "center", alignItems: "center",
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 28,
  },
  infoSub: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 3,
  },
  infoUnavailable: {
    fontSize: 13,
    color: "#d1d5db",
    fontStyle: "italic",
    marginTop: 4,
  },

  // ── Notícias ──────────────────────────────────────────────────────────────
  newsSection: { marginBottom: 8 },
  newsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  newsCount: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
  },

  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  newsImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#e5e7eb",
  },
  newsBody: {
    padding: 16,
  },
  newsTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  newsTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4b7940",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    lineHeight: 22,
    marginBottom: 6,
  },
  newsDesc: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 19,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  newsReadMore: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4b7940",
  },

  newsDotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  newsDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: "#d1d5db",
  },
  newsDotActive: {
    width: 20,
    backgroundColor: "#4b7940",
  },

  // Loading
  newsCardLoading: {
    alignItems: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 8,
    color: "#9ca3af",
    fontSize: 13,
  },
});