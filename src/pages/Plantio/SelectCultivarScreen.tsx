// src/pages/Plantio/SelectCultivarScreen.tsx
import React, { useState, useEffect } from "react";
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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList, Cultivar } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { fetchCultivares } from "../../services/api";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "SelectCultivarScreen"
>;
type SelectCultivarRouteProp = RouteProp<
  RootStackParamList,
  "SelectCultivarScreen"
>;

export default function SelectCultivarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SelectCultivarRouteProp>();
  const { farmId, cultureType } = route.params;

  const [cultivares, setCultivares] = useState<Cultivar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCultivares = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("@TerraManager:token");
        if (!token) throw new Error("Token não encontrado.");
        const response = await fetchCultivares(token);
        // Filtra os cultivares pelo tipo de cultura selecionado
        const filteredData = response.data.filter(
          (c: Cultivar) => c.tipoPlanta === cultureType
        );
        setCultivares(filteredData || []);
      } catch (error: any) {
        Alert.alert("Erro", "Não foi possível carregar os cultivares.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCultivares();
  }, [cultureType]);

  const handleSelectCultivar = (cultivarId: string) => {
    navigation.navigate('AddPlantioScreen', { 
        farmId, 
        cultivarId, 
        cultureType 
    });
};

  const renderItem = ({ item }: { item: Cultivar }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectCultivar(item.id)}
    >
      <Text style={styles.cardTitle}>{item.nomePopular}</Text>
      <Text style={styles.cardSubtitle}>{item.nomeCientifico}</Text>
      <Ionicons
        name="arrow-forward-circle"
        size={24}
        color={colors.secondary}
        style={styles.cardIcon}
      />
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Selecione o Cultivar</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.white} />
        ) : (
          <FlatList
            data={cultivares}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="leaf-outline"
                  size={60}
                  color="rgba(255,255,255,0.3)"
                />
                <Text style={styles.emptyText}>
                  Nenhum cultivar de {cultureType} encontrado.
                </Text>
                <Text style={styles.emptySubText}>
                  Cadastre um novo cultivar na área de gestão.
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
  container: { flex: 1, backgroundColor: "#1E322D" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? 40 : 15,
    paddingBottom: 15,
    backgroundColor: colors.primary,
  },
  backButton: { padding: 5 },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  content: { flex: 1, paddingHorizontal: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
  },
  cardTitle: { flex: 1, fontSize: 18, fontWeight: "bold", color: colors.white },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontStyle: "italic",
  },
  cardIcon: { marginLeft: 15 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  emptySubText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 5,
  },
});
