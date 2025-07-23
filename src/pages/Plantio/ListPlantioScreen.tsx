// Em: src/pages/Plantio/ListPlantioScreen.tsx

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  RouteProp,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList, Plantio } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { fetchPlantiosByFazenda } from "../../services/api";

// Tipagem para navegação e rotas
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "ListPlantioScreen"
>;
type ListPlantioRouteProp = RouteProp<RootStackParamList, "ListPlantioScreen">;

export default function ListPlantioScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ListPlantioRouteProp>();
  const { farmId, cultureType } = route.params;

  const [plantios, setPlantios] = useState<Plantio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar os plantios da API
  const loadPlantios = useCallback(async () => {
    if (!farmId || !cultureType) return;

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado.");
      }

      const response = await fetchPlantiosByFazenda(farmId, cultureType, token);
      setPlantios(response.data || []);
    } catch (error: any) {
      Alert.alert("Erro ao Carregar", "Não foi possível buscar os plantios.");
      setPlantios([]);
    } finally {
      setIsLoading(false);
    }
  }, [farmId, cultureType]);

  // Recarrega os dados sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      loadPlantios();
    }, [loadPlantios])
  );

  // Componente para renderizar cada item da lista (card)
  const renderItem = ({ item }: { item: Plantio }) => (
    <View style={styles.card}>
      {/* Área principal do card, clicável para edição */}
      <TouchableOpacity
        style={styles.cardInfoContainer}
        onPress={() =>
          navigation.navigate("AddPlantioScreen", {
            farmId,
            cultureType,
            plantio: item,
          })
        }
      >
        <View style={styles.cardIconContainer}>
          <Ionicons name="leaf-outline" size={32} color={colors.primary} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>
            {item.cultivar?.nomePopular || "Cultivar não informado"}
          </Text>
          <Text style={styles.cardSubtitle}>
            Data: {new Date(item.dataPlantio).toLocaleDateString()}
          </Text>
          <Text style={styles.cardData}>Área: {item.areaPlantada} ha</Text>
        </View>
      </TouchableOpacity>

      {/* Botão de Análise de Solo (Globo), condicional */}
      <View style={styles.cardActions}>
        {item.idAnaliseSolo && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("ResultadoAnaliseSoloScreen", {
                plantioId: item.id,
              })
            }
          >
            <Ionicons name="globe-outline" size={28} color={colors.blue} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plantios de {cultureType}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("SelectCultivarScreen", { farmId, cultureType })
          }
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            style={{ marginTop: 50 }}
            size="large"
            color={colors.white}
          />
        ) : (
          <FlatList
            data={plantios}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 5 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={60}
                  color="rgba(255,255,255,0.3)"
                />
                <Text style={styles.emptyText}>Nenhum plantio encontrado.</Text>
                <Text style={styles.emptySubText}>
                  Clique no botão '+' para adicionar o primeiro.
                </Text>
              </View>
            }
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? 40 : 15,
    paddingBottom: 15,
    backgroundColor: colors.primary,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconContainer: {
    backgroundColor: "rgba(46, 139, 87, 0.1)",
    borderRadius: 50,
    padding: 12,
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardData: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardActions: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  emptySubText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 5,
    textAlign: "center",
  },
});
