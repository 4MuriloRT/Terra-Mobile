import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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
      // A resposta da API é um objeto: { data: [...], count: X }
      const responseData = await fetchCultivares();

      // **A CORREÇÃO ESTÁ AQUI**
      // Verificamos se a resposta tem a propriedade 'data' e se ela é um array
      if (responseData && Array.isArray(responseData.data)) {
        setCultivares(responseData.data);
      } else {
        // Se o formato for inesperado, definimos como um array vazio para evitar erros
        console.error("Formato de dados inesperado da API:", responseData);
        setCultivares([]);
      }
    } catch (error: any) {
      Alert.alert(
        "Erro ao Carregar",
        error.message || "Não foi possível buscar os cultivos."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCultivares();
    }, [])
  );

  const renderItem = ({ item }: { item: Cultivar }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, { flex: 3 }]}>{item.nomePopular}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.tipoPlanta}</Text>
      <View style={[styles.actionsCell, { flex: 1.5 }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("AddCultivoScreen", { cultivar: item })
          }
        >
          <Ionicons name="eye-outline" size={22} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="leaf-outline"
        size={80}
        color="rgba(255, 255, 255, 0.2)"
      />
      <Text style={styles.emptyText}>Nenhum cultivo encontrado.</Text>
      <Text style={styles.emptySubText}>Adicione um novo para começar.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter-outline" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate("AddCultivoScreen", {})}
          >
            <Ionicons name="add-outline" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Novo Cultivo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.white}
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, { flex: 3 }]}>Nome Popular</Text>
              <Text style={[styles.headerText, { flex: 2 }]}>Tipo</Text>
              <Text
                style={[styles.headerText, { flex: 1.5, textAlign: "center" }]}
              >
                Ações
              </Text>
            </View>
            <FlatList
              data={cultivares}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={EmptyListComponent}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E322D",
  },
  header: {
    backgroundColor: colors.primary,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: {
    color: colors.white,
    marginLeft: 5,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
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
  cell: {
    color: colors.white,
    fontSize: 14,
  },
  actionsCell: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  actionButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  emptySubText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 8,
  },
});
