// src/pages/Fazendas/FazendasScreen.tsx
import React, { useState, useCallback, useEffect } from "react";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList, Farm } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { fetchFarms } from "../../services/api";
import { localFarms } from "../../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

type NavigationProp = StackNavigationProp<RootStackParamList, "FazendasScreen">;

export default function FazendasScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { isOnline } = useNetworkStatus();
  const [fazendas, setFazendas] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromCache, setIsFromCache] = useState(false);

  const loadFazendas = async () => {
    setIsLoading(true);
    try {
      if (isOnline) {
        const result = await fetchFarms();
        setFazendas(result.data);
        // Salva no cache local
        await localFarms.save(result.data);
        setIsFromCache(false);
      } else {
        // Modo offline: usa cache
        const cached = await localFarms.getAll();
        setFazendas(cached);
        setIsFromCache(true);
      }
    } catch (error: any) {
      // Se API falhar, tenta cache
      try {
        const cached = await localFarms.getAll();
        setFazendas(cached);
        setIsFromCache(true);
      } catch {
        Alert.alert("Erro", error?.message || "Não foi possível carregar as fazendas.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFazendas();
    }, [isOnline])
  );

  const renderItem = ({ item }: { item: Farm }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => navigation.navigate("AddFarmScreen", { farm: item })}
    >
      <View style={styles.farmInfo}>
        <Text style={styles.farmName}>{item.nome}</Text>
        <Text style={styles.farmLocation}>
          {item.municipio} - {item.uf}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.talhaoButton}
          onPress={() => navigation.navigate("TalhoesScreen", { fazenda: item })}
        >
          <Ionicons name="map-outline" size={18} color={colors.accent} />
          <Text style={styles.talhaoText}>Talhões</Text>
        </TouchableOpacity>
        <Ionicons name="chevron-forward-outline" size={22} color={colors.white} />
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="earth-outline" size={60} color="rgba(255,255,255,0.3)" />
      <Text style={styles.emptyText}>Nenhuma fazenda encontrada.</Text>
      <Text style={styles.emptySubText}>
        Clique no botão '+' para cadastrar a primeira.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Fazendas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddFarmScreen", {})}
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
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Nome</Text>
          <Text style={styles.headerText}>Localização</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.white}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={fazendas}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{ paddingTop: 10 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E322D",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? 40 : 15,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
  cacheWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(180,83,9,0.3)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 6,
  },
  cacheWarningText: {
    color: "#FCD34D",
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    paddingBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  farmLocation: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  talhaoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  talhaoText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  emptySubText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
  },
});
