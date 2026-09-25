// src/pages/Talhoes/TalhoesScreen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList, Talhao } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { fetchTalhoesByFazenda, deleteTalhao } from "../../services/api";
import { localTalhoes } from "../../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "TalhoesScreen">;

export default function TalhoesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { fazenda } = route.params;
  const { isOnline } = useNetworkStatus();

  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromCache, setIsFromCache] = useState(false);

  const loadTalhoes = async () => {
    setIsLoading(true);
    try {
      if (isOnline) {
        const result = await fetchTalhoesByFazenda(Number(fazenda.id));
        setTalhoes(result.data);
        await localTalhoes.upsertMany(result.data);
        setIsFromCache(false);
      } else {
        const cached = await localTalhoes.getByFazenda(Number(fazenda.id));
        setTalhoes(cached);
        setIsFromCache(true);
      }
    } catch (error: any) {
      try {
        const cached = await localTalhoes.getByFazenda(Number(fazenda.id));
        setTalhoes(cached);
        setIsFromCache(true);
      } catch {
        Alert.alert("Erro", error?.message || "Não foi possível carregar os talhões.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTalhoes();
    }, [isOnline])
  );

  const handleDelete = (talhao: Talhao) => {
    Alert.alert(
      "Remover Talhão",
      `Deseja remover o talhão "${talhao.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTalhao(talhao.id);
              await localTalhoes.remove(talhao.id);
              setTalhoes((prev) => prev.filter((t) => t.id !== talhao.id));
            } catch (err: any) {
              Alert.alert("Erro", err?.message || "Não foi possível remover o talhão.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Talhao }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="map-outline" size={22} color={colors.accent} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardSub}>{item.areaHa} ha</Text>
        </View>
      </View>
      {item.observacao ? (
        <Text style={styles.cardObs}>{item.observacao}</Text>
      ) : null}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate("AddTalhaoScreen", {
              fazendaId: Number(fazenda.id),
              talhao: item,
            })
          }
        >
          <Ionicons name="pencil-outline" size={16} color={colors.white} />
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="map-outline" size={60} color="rgba(255,255,255,0.3)" />
      <Text style={styles.emptyText}>Nenhum talhão cadastrado.</Text>
      <Text style={styles.emptySubText}>
        Talhões são parcelas da fazenda usadas para controlar plantios e custos.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Talhões</Text>
          <Text style={styles.headerSub}>{fazenda.nome}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddTalhaoScreen", {
              fazendaId: Number(fazenda.id),
            })
          }
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {isFromCache && (
        <View style={styles.cacheWarning}>
          <Ionicons name="cloud-offline-outline" size={14} color="#FCD34D" />
          <Text style={styles.cacheWarningText}>Exibindo dados locais (offline)</Text>
        </View>
      )}

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.white} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={talhoes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E322D" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? 40 : 15,
    backgroundColor: colors.primary,
  },
  backButton: { padding: 4, marginRight: 8 },
  headerCenter: { flex: 1 },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
  addButton: { padding: 8 },
  cacheWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(180,83,9,0.3)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 6,
  },
  cacheWarningText: { color: "#FCD34D", fontSize: 12 },
  content: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(212,163,115,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  cardTitle: { color: colors.white, fontSize: 17, fontWeight: "700" },
  cardSub: { color: colors.accent, fontSize: 13, marginTop: 2 },
  cardObs: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 10 },
  cardActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  deleteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(220,53,69,0.3)",
  },
  btnText: { color: colors.white, fontSize: 14, fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 60, paddingHorizontal: 20 },
  emptyText: { color: "white", fontSize: 18, fontWeight: "bold", marginTop: 16, textAlign: "center" },
  emptySubText: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 8, textAlign: "center" },
});
