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
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList, Cultivar } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { fetchCultivares, deleteCultivar } from "../../services/api";

type CultivosScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CultivosScreen"
>;

export default function CultivosScreen() {
  const navigation = useNavigation<CultivosScreenNavigationProp>();
  const [cultivares, setCultivares] = useState<Cultivar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCultivares = async () => {
    try {
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) throw new Error("Token não encontrado.");

      const response = await fetchCultivares(token);
      setCultivares(response.data || []);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível carregar os cultivares."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadCultivares();
    }, [])
  );
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadCultivares();
  }, []);

  const handleDelete = (cultivar: Cultivar) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o cultivar "${cultivar.nomePopular}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("@TerraManager:token");
              if (!token) throw new Error("Token não encontrado.");

              await deleteCultivar(cultivar.id, token);
              Alert.alert("Sucesso!", "Cultivar excluído com sucesso.");
              loadCultivares();
            } catch (error: any) {
              Alert.alert(
                "Erro ao Excluir",
                error.message || "Não foi possível excluir o cultivar."
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Cultivar }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="leaf-outline" size={24} color={colors.secondary} />
        <Text style={styles.cardTitle}>{item.nomePopular}</Text>
      </View>
      <Text style={styles.cardSubtitle}>{item.nomeCientifico}</Text>

      <View style={styles.cardInfoRow}>
        <Text style={styles.cardInfoLabel}>Tipo de Planta:</Text>
        <Text style={styles.cardInfoValue}>{item.tipoPlanta}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() =>
            navigation.navigate("AddCultivoScreen", { cultivar: item })
          }
        >
          <Ionicons name="eye-outline" size={18} color={colors.white} />
          <Text style={styles.actionButtonText}>Visualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={18} color={colors.white} />
          <Text style={styles.actionButtonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Cultivares</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddCultivoScreen", {})}
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Novo Cultivar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.white}
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={cultivares}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="nutrition-outline"
                  size={60}
                  color="rgba(255,255,255,0.3)"
                />
                <Text style={styles.emptyText}>
                  Nenhum cultivar encontrado.
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[colors.secondary]}
                tintColor={colors.secondary}
              />
            }
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? 40 : 15,
  },
  headerTitle: { color: colors.white, fontSize: 22, fontWeight: "bold" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: { color: colors.white, marginLeft: 5, fontWeight: "bold" },
  content: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginLeft: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 15,
    fontStyle: "italic",
  },
  cardInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardInfoLabel: { fontSize: 14, color: "rgba(255,255,255,0.6)" },
  cardInfoValue: { fontSize: 14, color: colors.white, fontWeight: "600" },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginTop: 15,
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  actionButtonText: {
    color: colors.white,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "bold",
  },
  viewButton: { backgroundColor: "#3498db" },
  deleteButton: { backgroundColor: "#e74c3c" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
});
