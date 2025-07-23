// Em: src/pages/Plantio/ResultadoAnaliseSoloScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../screens/Types";
import { colors } from "../../components/Colors";
import {
  getCalculoCalagem,
  getCalculoAdubacao,
  getComparativoNutrientes,
} from "../../services/api";

type ResultadoRouteProp = RouteProp<
  RootStackParamList,
  "ResultadoAnaliseSoloScreen"
>;

type ColorKeys = keyof typeof colors;
// --- Componentes de UI para Organização ---

const SectionCard = ({ title, iconName, children }: any) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Ionicons name={iconName} size={24} color={colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const InfoChip = ({
  label,
  value,
  color = "primary",
}: {
  label: string;
  value: string;
  color?: ColorKeys | string;
}) => (
  <View style={styles.chipContainer}>
    <Text style={styles.chipLabel}>{label}</Text>
    <View
      style={[
        styles.chip,
        { borderColor: colors[color as ColorKeys] || color },
      ]}
    >
      <Text
        style={[
          styles.chipValue,
          { color: colors[color as ColorKeys] || color },
        ]}
      >
        {value}
      </Text>
    </View>
  </View>
);

const NutrientBox = ({ label, value, unit, color = colors.primary }: any) => (
  <View style={[styles.nutrientBox, { backgroundColor: `${color}15` }]}>
    <Text style={styles.nutrientLabel}>{label}</Text>
    <Text style={[styles.nutrientValue, { color }]}>{value}</Text>
    <Text style={styles.nutrientUnit}>{unit}</Text>
  </View>
);

const ComparisonRow = ({ nutrient, soloValue, cultivarValue }: any) => (
  <View style={styles.tableRow}>
    <View style={[styles.tableCell, { flex: 1.5, backgroundColor: "#f0f0f0" }]}>
      <Text style={styles.tableTextHeader}>{nutrient}</Text>
    </View>
    <View style={styles.tableCell}>
      <Text style={styles.tableText}>{soloValue}</Text>
    </View>
    <View style={styles.tableCell}>
      <Text style={styles.tableText}>{cultivarValue}</Text>
    </View>
  </View>
);

export default function ResultadoAnaliseSoloScreen() {
  const navigation = useNavigation();
  const route = useRoute<ResultadoRouteProp>();
  const { plantioId } = route.params;

  const [loading, setLoading] = useState(true);
  const [calagem, setCalagem] = useState<any>(null);
  const [adubacao, setAdubacao] = useState<any>(null);
  const [comparativo, setComparativo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("@TerraManager:token");
        if (!token) throw new Error("Token não encontrado.");

        // Busca todos os dados em paralelo
        const [calagemRes, adubacaoRes, comparativoRes] = await Promise.all([
          getCalculoCalagem(plantioId, token),
          getCalculoAdubacao(plantioId, token),
          getComparativoNutrientes(plantioId, token),
        ]);

        setCalagem(calagemRes.data || calagemRes);
        setAdubacao(adubacaoRes.data || adubacaoRes);
        setComparativo(comparativoRes.data || comparativoRes);
      } catch (error: any) {
        Alert.alert(
          "Erro",
          "Não foi possível carregar os resultados da análise."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plantioId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carregando Resultados...</Text>
          <View style={{ width: 24 }} />
        </View>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado da Análise</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionCard title="Calagem" iconName="leaf-outline">
          <View style={styles.infoRow}>
            <InfoChip
              label="Recomendação de Calagem"
              value={calagem?.rencomedacaoCalagem ?? "N/A"}
              color="primary"
            />
            <InfoChip
              label="Recomendação Total"
              value={calagem?.recomendacaoCalagemTotal ?? "N/A"}
              color="secondary"
            />
          </View>
        </SectionCard>

        <SectionCard title="Adubação" iconName="water-outline">
          <InfoChip
            label="Área Total"
            value={`${adubacao?.areaHa ?? "0"} ha`}
            color="blue"
          />
          <Text style={styles.subHeader}>Doses por Hectare</Text>
          <View style={styles.infoRow}>
            <NutrientBox
              label="Nitrogênio (N)"
              value={adubacao?.n ?? "N/A"}
              unit="kg/ha"
              color="#3498db"
            />
            <NutrientBox
              label="Fósforo (P)"
              value={adubacao?.p ?? "N/A"}
              unit="kg/ha"
              color="#2ecc71"
            />
            <NutrientBox
              label="Potássio (K)"
              value={adubacao?.k ?? "N/A"}
              unit="kg/ha"
              color="#e67e22"
            />
          </View>
          <Text style={styles.subHeader}>Total para a Área</Text>
          <View style={styles.infoRow}>
            <NutrientBox
              label="N Total"
              value={adubacao?.nTotalAreaKg ?? "N/A"}
              unit="kg"
              color="#3498db"
            />
            <NutrientBox
              label="P Total"
              value={adubacao?.pTotalAreaKg ?? "N/A"}
              unit="kg"
              color="#2ecc71"
            />
            <NutrientBox
              label="K Total"
              value={adubacao?.kTotalAreaKg ?? "N/A"}
              unit="kg"
              color="#e67e22"
            />
          </View>
        </SectionCard>

        <SectionCard
          title="Comparativo de Nutrientes"
          iconName="stats-chart-outline"
        >
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>
              Nutriente
            </Text>
            <Text style={styles.tableHeaderText}>Análise Solo</Text>
            <Text style={styles.tableHeaderText}>Recomendado</Text>
          </View>
          <ComparisonRow
            nutrient="pH"
            soloValue={comparativo?.analiseSolo?.ph ?? "N/A"}
            cultivarValue={comparativo?.cultivar?.ph ?? "N/A"}
          />
          <ComparisonRow
            nutrient="Nitrogênio (N)"
            soloValue={comparativo?.analiseSolo?.n ?? "N/A"}
            cultivarValue={comparativo?.cultivar?.n ?? "N/A"}
          />
          <ComparisonRow
            nutrient="Fósforo (P)"
            soloValue={comparativo?.analiseSolo?.p ?? "N/A"}
            cultivarValue={comparativo?.cultivar?.p ?? "N/A"}
          />
          <ComparisonRow
            nutrient="Potássio (K)"
            soloValue={comparativo?.analiseSolo?.k ?? "N/A"}
            cultivarValue={comparativo?.cultivar?.k ?? "N/A"}
          />
          <ComparisonRow
            nutrient="Cálcio (Ca)"
            soloValue={comparativo?.analiseSolo?.ca ?? "N/A"}
            cultivarValue={comparativo?.cultivar?.ca ?? "N/A"}
          />
          <ComparisonRow
            nutrient="Magnésio (Mg)"
            soloValue={comparativo?.analiseSolo?.mg ?? "N/A"}
            cultivarValue={comparativo?.cultivar?.mg ?? "N/A"}
          />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? 10 : 40,
    paddingBottom: 15,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: { padding: 5 },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  content: { padding: 15, paddingBottom: 30 },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginLeft: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  chipContainer: { alignItems: "center", margin: 10 },
  chipLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  chip: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipValue: { fontSize: 16, fontWeight: "bold" },
  nutrientBox: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    margin: 5,
    alignItems: "center",
    minWidth: "30%",
  },
  nutrientLabel: { fontSize: 12, color: "#666", fontWeight: "500" },
  nutrientValue: { fontSize: 18, fontWeight: "bold", marginVertical: 2 },
  nutrientUnit: { fontSize: 11, color: "#888" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    color: "#495057",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  tableCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tableText: { color: colors.textPrimary, textAlign: "center" },
  tableTextHeader: { color: colors.textPrimary, fontWeight: "bold" },
});
