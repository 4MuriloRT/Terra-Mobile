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

import { RootStackParamList, Cultivar } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { fetchCultivares } from "../../services/api";

type CultivosScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CultivosScreen"
>;

export default function CultivosScreen() {
  const navigation = useNavigation<CultivosScreenNavigationProp>();
  const [cultivares, setCultivares] = useState<Cultivar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCultivares = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) throw new Error("Token não encontrado.");

      const response = await fetchCultivares(token);
      setCultivares(response.data || []); // Acessa o array 'data' da resposta da API
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível carregar os cultivares."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Recarrega os dados sempre que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      loadCultivares();
    }, [])
  );

  const handleDelete = (cultivarId: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este cultivar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            // Lógica para chamar a API de exclusão virá aqui
            console.log("Excluir cultivar com ID:", cultivarId);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Cultivar }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cellText, { flex: 2 }]}>{item.nomeCientifico}</Text>
      <Text style={[styles.cellText, { flex: 2 }]}>{item.nomePopular}</Text>
      <Text style={[styles.cellText, { flex: 1.5 }]}>{item.tipoPlanta}</Text>
      <Text style={[styles.cellText, { flex: 1.5 }]}>{item.tipoSolo}</Text>
      <View style={styles.actionsCell}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("AddCultivoScreen", { cultivar: item })
          }
        >
          <Ionicons name="eye-outline" size={22} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="nutrition-outline"
        size={60}
        color="rgba(255,255,255,0.3)"
      />
      <Text style={styles.emptyText}>Nenhum cultivar encontrado.</Text>
      <Text style={styles.emptySubText}>
        Clique em 'Novo Cultivar' para começar.
      </Text>
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
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 2 }]}>Nome Científico</Text>
          <Text style={[styles.headerText, { flex: 2 }]}>Nome Popular</Text>
          <Text style={[styles.headerText, { flex: 1.5 }]}>Tipo Planta</Text>
          <Text style={[styles.headerText, { flex: 1.5 }]}>Tipo Solo</Text>
          <Text style={[styles.headerText, { flex: 1, textAlign: "center" }]}>
            Ações
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.white}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={cultivares}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    marginLeft: 5,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    paddingBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cellText: {
    color: colors.white,
    fontSize: 14,
  },
  actionsCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  actionButton: {
    padding: 5,
  },
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
  emptySubText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
  },
});
