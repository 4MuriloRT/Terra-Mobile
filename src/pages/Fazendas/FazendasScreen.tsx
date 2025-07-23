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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList, Farm } from "../../screens/Types";
import { colors } from "../../components/Colors";

type FazendasScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FazendasScreen"
>;

const API_BASE_URL = "http://192.168.3.40:3000";

export default function FazendasScreen() {
  const navigation = useNavigation<FazendasScreenNavigationProp>();
  const [fazendas, setFazendas] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar as fazendas do backend
  const fetchFazendas = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token)
        throw new Error("Token não encontrado. Faça login novamente.");

      // ✅ URL CORRIGIDA para corresponder ao seu backend
      const response = await fetch(`${API_BASE_URL}/fazenda/lista`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({
            message: "Não foi possível carregar os dados das fazendas.",
          }));
        throw new Error(errorData.message);
      }

      // ✅ RESPOSTA DA API TRATADA CORRETAMENTE
      // O backend retorna um objeto { data: [...] }, então pegamos o array 'data'
      const result = await response.json();
      setFazendas(result.data);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Recarrega os dados sempre que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      fetchFazendas();
    }, [])
  );

  const renderItem = ({ item }: { item: Farm }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => navigation.navigate("AddFarmScreen", { farm: item })}
    >
      <Text style={[styles.cellText, { flex: 1 }]}>{item.nome}</Text>
      <Text style={[styles.cellText, { flex: 1, textAlign: "right" }]}>
        {item.municipio} - {item.uf}
      </Text>
      <View style={styles.iconContainer}>
        <Ionicons
          name="chevron-forward-outline"
          size={22}
          color={colors.white}
        />
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
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cellText: {
    color: colors.white,
    fontSize: 16,
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
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
