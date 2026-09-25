// src/pages/Aplicacoes/AplicacoesScreen.tsx
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

import { RootStackParamList, Aplicacao } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { fetchAplicacoesByOperacao, deleteAplicacao } from "../../services/api";
import { localAplicacoes } from "../../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "AplicacoesScreen">;

export default function AplicacoesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { operacao } = route.params;
  const { isOnline } = useNetworkStatus();

  const [aplicacoes, setAplicacoes] = useState<Aplicacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromCache, setIsFromCache] = useState(false);

  const loadAplicacoes = async () => {
    setIsLoading(true);
    try {
      if (isOnline) {
        const data = await fetchAplicacoesByOperacao(operacao.id);
        setAplicacoes(data);
        await localAplicacoes.upsertMany(data);
        setIsFromCache(false);
      } else {
        const cached = await localAplicacoes.getByOperacao(operacao.id);
        setAplicacoes(cached);
        setIsFromCache(true);
      }
    } catch {
      const cached = await localAplicacoes.getByOperacao(operacao.id);
      setAplicacoes(cached);
      setIsFromCache(true);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAplicacoes();
    }, [isOnline])
  );

  const handleDelete = (ap: Aplicacao) => {
    Alert.alert("Remover Aplicação", `Remover esta aplicação?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAplicacao(ap.id);
            await localAplicacoes.remove(ap.id);
            setAplicacoes((prev) => prev.filter((a) => a.id !== ap.id));
          } catch (err: any) {
            Alert.alert("Erro", err?.message);
          }
        },
      },
    ]);
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("pt-BR") : "-";

  const renderItem = ({ item }: { item: Aplicacao }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, item.tipo === "DEFENSIVO" ? styles.defensivo : styles.fertilizante]}>
          <Text style={styles.typeBadgeText}>{item.tipo}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.dataAplicacao)}</Text>
      </View>

      <Text style={styles.produtoText}>
        {item.nomeProduto || item.produtoEstoque?.nome || "Produto não informado"}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Dose</Text>
          <Text style={styles.detailValue}>
            {item.dosePorHa} {item.unidadeDose}
          </Text>
        </View>
        {item.quantidadeTotal != null && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.detailValue}>{item.quantidadeTotal.toFixed(2)}</Text>
          </View>
        )}
        {item.custoAplicacao != null && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Custo</Text>
            <Text style={styles.detailValue}>R$ {item.custoAplicacao.toFixed(2)}</Text>
          </View>
        )}
      </View>

      {item.observacao ? (
        <Text style={styles.obsText}>{item.observacao}</Text>
      ) : null}

      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
        <Ionicons name="trash-outline" size={15} color="#fff" />
        <Text style={styles.deleteBtnText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Aplicações</Text>
          <Text style={styles.headerSub}>Operação #{operacao.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddAplicacaoScreen", {
              operacaoId: operacao.id,
              areaHa: operacao.areaHa,
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
            data={aplicacoes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="flask-outline" size={60} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyText}>Nenhuma aplicação registrada.</Text>
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
    gap: 6,
    alignItems: "center",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  defensivo: { backgroundColor: "rgba(220,53,69,0.3)" },
  fertilizante: { backgroundColor: "rgba(34,197,94,0.2)" },
  typeBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  dateText: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  produtoText: { color: colors.white, fontSize: 16, fontWeight: "600", marginBottom: 10 },
  details: { flexDirection: "row", gap: 20, marginBottom: 8 },
  detailItem: {},
  detailLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 2 },
  detailValue: { color: colors.accent, fontSize: 14, fontWeight: "600" },
  obsText: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 8 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(220,53,69,0.3)",
    marginTop: 4,
  },
  deleteBtnText: { color: colors.white, fontSize: 14, fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "white", fontSize: 16, marginTop: 16 },
});
