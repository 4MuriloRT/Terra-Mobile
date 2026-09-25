// src/pages/Operacoes/OperacoesScreen.tsx
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
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList, OperacaoPlantio, TipoEtapaOperacao } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { fetchOperacoesByPlantio, deleteOperacaoPlantio } from "../../services/api";
import { localOperacoes } from "../../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "OperacoesScreen">;

const ETAPA_LABELS: Record<TipoEtapaOperacao, string> = {
  PREPARO_SOLO: "Preparo do Solo",
  SEMEADURA: "Semeadura",
  APLICACAO_DEFENSIVO: "Aplicação de Defensivo",
  APLICACAO_FERTILIZANTE: "Aplicação de Fertilizante",
  IRRIGACAO: "Irrigação",
  COLHEITA: "Colheita",
  OUTROS: "Outros",
};

const ETAPA_ICONS: Record<TipoEtapaOperacao, string> = {
  PREPARO_SOLO: "construct-outline",
  SEMEADURA: "leaf-outline",
  APLICACAO_DEFENSIVO: "flask-outline",
  APLICACAO_FERTILIZANTE: "nutrition-outline",
  IRRIGACAO: "water-outline",
  COLHEITA: "basket-outline",
  OUTROS: "ellipsis-horizontal-outline",
};

export default function OperacoesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { plantio } = route.params;
  const { isOnline } = useNetworkStatus();

  const [operacoes, setOperacoes] = useState<OperacaoPlantio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromCache, setIsFromCache] = useState(false);

  const loadOperacoes = async () => {
    setIsLoading(true);
    try {
      if (isOnline) {
        const data = await fetchOperacoesByPlantio(plantio.id);
        setOperacoes(data);
        await localOperacoes.upsertMany(data);
        setIsFromCache(false);
      } else {
        const cached = await localOperacoes.getByPlantio(plantio.id);
        setOperacoes(cached);
        setIsFromCache(true);
      }
    } catch {
      const cached = await localOperacoes.getByPlantio(plantio.id);
      setOperacoes(cached);
      setIsFromCache(true);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOperacoes();
    }, [isOnline])
  );

  const handleDelete = (op: OperacaoPlantio) => {
    Alert.alert(
      "Remover Operação",
      `Remover "${ETAPA_LABELS[op.tipoEtapa]}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteOperacaoPlantio(op.id);
              await localOperacoes.remove(op.id);
              setOperacoes((prev) => prev.filter((o) => o.id !== op.id));
            } catch (err: any) {
              Alert.alert("Erro", err?.message);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const renderItem = ({ item }: { item: OperacaoPlantio }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={ETAPA_ICONS[item.tipoEtapa] as any}
            size={20}
            color={colors.accent}
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{ETAPA_LABELS[item.tipoEtapa]}</Text>
          <Text style={styles.cardSub}>
            {formatDate(item.dataInicio)} • {item.areaHa} ha
          </Text>
        </View>
      </View>

      <View style={styles.costs}>
        {item.custoTotal != null && (
          <Text style={styles.costText}>
            Custo: R$ {item.custoTotal.toFixed(2)}
          </Text>
        )}
        {item.custoPorHa != null && (
          <Text style={styles.costSubText}>
            R$ {item.custoPorHa.toFixed(2)}/ha
          </Text>
        )}
      </View>

      {item.talhao && (
        <Text style={styles.talhaoText}>
          <Ionicons name="map-outline" size={12} /> {item.talhao.nome}
        </Text>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            navigation.navigate("AplicacoesScreen", { operacao: item })
          }
        >
          <Ionicons name="flask-outline" size={15} color={colors.accent} />
          <Text style={[styles.btnText, { color: colors.accent }]}>Aplicações</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate("AddOperacaoScreen", {
              plantioId: plantio.id,
              operacao: item,
              areaMaxima: plantio.areaPlantada,
            })
          }
        >
          <Ionicons name="pencil-outline" size={15} color={colors.white} />
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={15} color="#fff" />
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Operações</Text>
          <Text style={styles.headerSub}>Plantio #{plantio.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddOperacaoScreen", {
              plantioId: plantio.id,
              areaMaxima: plantio.areaPlantada,
            })
          }
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {isFromCache && (
        <View style={styles.cacheWarning}>
          <Ionicons name="cloud-offline-outline" size={14} color="#FCD34D" />
          <Text style={styles.cacheText}>Dados locais (offline)</Text>
        </View>
      )}

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.white} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={operacoes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="clipboard-outline" size={60} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyText}>Nenhuma operação registrada.</Text>
                <Text style={styles.emptySubText}>
                  Registre etapas do ciclo: preparo do solo, semeadura, colheita...
                </Text>
              </View>
            )}
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
    paddingTop: Platform.OS === "android" ? 40 : 15,
    paddingBottom: 12,
    backgroundColor: colors.primary,
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerCenter: { flex: 1 },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
  addButton: { padding: 8 },
  cacheWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(180,83,9,0.3)",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  cacheText: { color: "#FCD34D", fontSize: 12 },
  content: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212,163,115,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  cardTitle: { color: colors.white, fontSize: 16, fontWeight: "700" },
  cardSub: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  costs: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 6 },
  costText: { color: colors.accent, fontSize: 14, fontWeight: "600" },
  costSubText: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  talhaoText: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 8 },
  cardActions: { flexDirection: "row", gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "rgba(212,163,115,0.15)",
    borderWidth: 1,
    borderColor: "rgba(212,163,115,0.3)",
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  deleteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "rgba(220,53,69,0.3)",
  },
  btnText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 60, paddingHorizontal: 20 },
  emptyText: { color: "white", fontSize: 18, fontWeight: "bold", marginTop: 16, textAlign: "center" },
  emptySubText: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 8, textAlign: "center" },
});
