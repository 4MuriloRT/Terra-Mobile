import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList, Cultivar } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { CustomPicker } from "../../components/CustomPicker";
import { fetchCultivares } from "../../services/api";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddPlantioScreen"
>;
type AddPlantioRouteProp = RouteProp<RootStackParamList, "AddPlantioScreen">;

// Função para formatar a data automaticamente no formato DD/MM/AAAA
const maskDate = (text: string) => {
  let digits = text.replace(/\D/g, "");
  digits = digits.slice(0, 8);
  if (digits.length > 4)
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

// Função para converter data DD/MM/AAAA para formato ISO
const toISODate = (dateString: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return null;
  const [day, month, year] = dateString.split("/");
  return new Date(`${year}-${month}-${day}`).toISOString();
};

export default function AddPlantioScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddPlantioRouteProp>();
  const { farmId } = route.params;

  // Estados para os campos do formulário
  const [cultivares, setCultivares] = useState<Cultivar[]>([]);
  const [selectedCultivar, setSelectedCultivar] = useState<string>("");
  const [dataPlantio, setDataPlantio] = useState("");
  const [areaPlantada, setAreaPlantada] = useState("");

  // ✅ NOVOS ESTADOS PARA OS CAMPOS OBRIGATÓRIOS
  const [densidadePlanejada, setDensidadePlanejada] = useState("");
  const [densidadePlantioReal, setDensidadePlantioReal] = useState("");
  const [mmAguaAplicado, setMmAguaAplicado] = useState("");

  // Outros campos opcionais
  const [dataEmergencia, setDataEmergencia] = useState("");
  const [custoSemente, setCustoSemente] = useState("");
  const [custoFertilizante, setCustoFertilizante] = useState("");

  useEffect(() => {
    const loadCultivares = async () => {
      try {
        const token = await AsyncStorage.getItem("@TerraManager:token");
        if (!token) throw new Error("Token não encontrado.");
        const data = await fetchCultivares(token);
        setCultivares(data.data || []);
      } catch (error: any) {
        Alert.alert("Erro", "Não foi possível carregar a lista de cultivares.");
      }
    };
    loadCultivares();
  }, []);

  const handleNextStep = () => {
    if (
      !selectedCultivar ||
      !dataPlantio ||
      !areaPlantada ||
      !densidadePlanejada ||
      !densidadePlantioReal ||
      !mmAguaAplicado
    ) {
      Alert.alert(
        "Erro",
        "Por favor, preencha todos os campos obrigatórios (*)."
      );
      return;
    }

    const dadosPlantio = {
      idCultivar: parseInt(selectedCultivar),
      dataPlantio: toISODate(dataPlantio),
      areaPlantada: parseFloat(areaPlantada.replace(",", ".")) || 0,
      // ✅ NOVOS CAMPOS ADICIONADOS AO PAYLOAD
      densidadePlanejada: parseInt(densidadePlanejada) || 0,
      densidadePlantioReal: parseInt(densidadePlantioReal) || 0,
      mmAguaAplicado: parseInt(mmAguaAplicado) || 0,
      // Campos opcionais
      dataEmergencia: toISODate(dataEmergencia),
      custoSemente: parseFloat(custoSemente.replace(",", ".")) || 0,
      custoFertilizante: parseFloat(custoFertilizante.replace(",", ".")) || 0,
    };

    navigation.navigate("AnaliseSoloScreen", { farmId, dadosPlantio });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adicionar Plantio</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Dados Base do Plantio</Text>

          <Text style={styles.inputLabel}>Cultivar *</Text>
          <CustomPicker
            selectedValue={selectedCultivar}
            onValueChange={(value) => setSelectedCultivar(value)}
            options={cultivares.map((c) => ({
              label: c.nomePopular,
              value: c.id,
            }))}
            placeholder="Selecione um cultivar..."
          />

          <Text style={styles.inputLabel}>Data de Plantio *</Text>
          <TextInput
            style={styles.input}
            value={dataPlantio}
            onChangeText={(text) => setDataPlantio(maskDate(text))}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.inputLabel}>Área Plantada (ha) *</Text>
          <TextInput
            style={styles.input}
            value={areaPlantada}
            onChangeText={setAreaPlantada}
            keyboardType="numeric"
            placeholder="Ex: 10.5"
          />

          {/* ✅ NOVOS CAMPOS ADICIONADOS AO FORMULÁRIO */}
          <Text style={styles.inputLabel}>
            Densidade Planejada (plantas/ha) *
          </Text>
          <TextInput
            style={styles.input}
            value={densidadePlanejada}
            onChangeText={setDensidadePlanejada}
            keyboardType="numeric"
            placeholder="Ex: 300000"
          />

          <Text style={styles.inputLabel}>Densidade Real (plantas/ha) *</Text>
          <TextInput
            style={styles.input}
            value={densidadePlantioReal}
            onChangeText={setDensidadePlantioReal}
            keyboardType="numeric"
            placeholder="Ex: 300000"
          />

          <Text style={styles.inputLabel}>Lâmina de Água Aplicada (mm) *</Text>
          <TextInput
            style={styles.input}
            value={mmAguaAplicado}
            onChangeText={setMmAguaAplicado}
            keyboardType="numeric"
            placeholder="Ex: 50"
          />

          <Text style={styles.inputLabel}>Data de Emergência (Opcional)</Text>
          <TextInput
            style={styles.input}
            value={dataEmergencia}
            onChangeText={(text) => setDataEmergencia(maskDate(text))}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
          />

          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Próximo: Análise de Solo</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 15,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  backButton: { padding: 5 },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  formContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#1E322D",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 25,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    paddingBottom: 5,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: colors.textPrimary,
  },
  nextButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  nextButtonText: { color: colors.white, fontSize: 18, fontWeight: "bold" },
});
