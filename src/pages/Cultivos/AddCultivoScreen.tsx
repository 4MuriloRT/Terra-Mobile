import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CustomPicker } from "../../components/CustomPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList } from "../../screens/Types";
import { colors } from "../../components/Colors";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCultivoScreen"
>;

// --- DADOS PARA OS SELETORES ---
const tiposDeSoloDisponiveis = [
  { label: "Selecione o tipo de solo...", value: "" },
  { label: "Arenoso", value: "ARENOSO" },
  { label: "Argiloso", value: "ARGILOSO" },
  { label: "Siltoso", value: "SILTOSO" },
  { label: "Misto", value: "MISTO" },
  { label: "Humífero", value: "HUMIFERO" },
  { label: "Calcário", value: "CALCARIO" },
  { label: "Gleissolo", value: "GLEISSOLO" },
  { label: "Latossolo", value: "LATOSSOLO" },
  { label: "Cambissolo", value: "CAMBISSOLO" },
  { label: "Organossolo", value: "ORGANOSSOLO" },
  { label: "Neossolo", value: "NEOSSOLO" },
  { label: "Planossolo", value: "PLANOSSOLO" },
  { label: "Vertissolo", value: "VERTISSOLO" },
];

const pragasDisponiveis = [
  { label: "Selecione a praga...", value: "" },
  { label: "Lagarta-do-cartucho", value: "LAGARTA_DO_CARTUCHO" },
  { label: "Helicoverpa", value: "HELICOVERPA" },
  { label: "Mosca-branca", value: "MOSCA_BRANCA" },
  { label: "Vaquinha", value: "VAQUINHA" },
  { label: "Percevejo-verde", value: "PERCEVEJO_VERDE" },
  { label: "Percevejo-marrom", value: "PERCEVEJO_MARROM" },
  { label: "Lagarta-da-soja", value: "LAGARTA_DA_SOJA" },
  { label: "Broca-da-cana", value: "BROCA_DA_CANA" },
  { label: "Pulgão-do-algodoeiro", value: "PULGAO_DO_ALGODOEIRO" },
  { label: "Bicudo-do-algodoeiro", value: "BICUDO_DO_ALGODOEIRO" },
];

// Função para formatar a data
const maskDate = (text: string) => {
  let digits = text.replace(/\D/g, "");
  digits = digits.slice(0, 8);

  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  } else if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return digits;
};

export default function AddCultivoScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [nomeCientifico, setNomeCientifico] = useState("");
  const [nomePopular, setNomePopular] = useState("");
  const [tipoPlanta, setTipoPlanta] = useState("");
  const [tipoSolo, setTipoSolo] = useState("");
  const [phSolo, setPhSolo] = useState("");
  const [plantioInicio, setPlantioInicio] = useState("");
  const [plantioFim, setPlantioFim] = useState("");
  const [periodoDias, setPeriodoDias] = useState("");
  const [agua, setAgua] = useState("");
  const [nitrogenio, setNitrogenio] = useState("");
  const [fosforo, setFosforo] = useState("");
  const [potassio, setPotassio] = useState("");
  const [cicloDias, setCicloDias] = useState("");
  const [observacao, setObservacao] = useState("");
  const [praga, setPraga] = useState("");
  const [fornecedor, setFornecedor] = useState("");

  const handleCreateCultivo = async () => {
    if (!nomeCientifico || !nomePopular) {
      Alert.alert(
        "Erro",
        "Por favor, preencha pelo menos o nome científico e popular."
      );
      return;
    }

    const cultivoData = {
      nomeCientifico,
      nomePopular,
      tipoPlanta,
      tipoSolo,
      fornecedor,
      praga,
      observacao,
      phSolo: parseFloat(phSolo) || 0,
      dataPlantioInicio: plantioInicio,
      dataPlantioFim: plantioFim,
      periodoDias: parseInt(periodoDias, 10) || 0,
      agua: parseInt(agua, 10) || 0,
      aduboNitrogenio: parseInt(nitrogenio, 10) || 0,
      aduboFosforo: parseInt(fosforo, 10) || 0,
      aduboPotassio: parseInt(potassio, 10) || 0,
      tempoCicloDias: parseInt(cicloDias, 10) || 0,
    };

    try {
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) {
        Alert.alert(
          "Erro de Autenticação",
          "Seu token não foi encontrado. Por favor, faça login novamente."
        );
        return;
      }
      const API_BASE_URL = "http://192.168.3.3:3000";
      const response = await fetch(`${API_BASE_URL}/cultivar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cultivoData),
      });

      if (response.ok) {
        Alert.alert("Sucesso!", "O cultivo foi cadastrado no banco de dados.");
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Erro ao Salvar",
          errorData.message || "Não foi possível cadastrar o cultivo."
        );
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível se conectar ao servidor."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
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
          <Text style={styles.headerTitle}>Adicionar Cultivar</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.inputLabel}>Nome Científico</Text>
          <TextInput
            style={styles.input}
            value={nomeCientifico}
            onChangeText={setNomeCientifico}
          />
          <Text style={styles.inputLabel}>Nome Popular</Text>
          <TextInput
            style={styles.input}
            value={nomePopular}
            onChangeText={setNomePopular}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tipo de Planta</Text>
              <TextInput
                style={styles.input}
                value={tipoPlanta}
                onChangeText={setTipoPlanta}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tipo de Solo</Text>
              <CustomPicker
                selectedValue={tipoSolo}
                onValueChange={setTipoSolo}
                options={tiposDeSoloDisponiveis}
                placeholder="Selecione o tipo de solo..."
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>pH do Solo</Text>
          <TextInput
            style={styles.input}
            value={phSolo}
            onChangeText={setPhSolo}
            keyboardType="numeric"
            placeholder="0"
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Plantio Início</Text>
              <TextInput
                style={styles.input}
                value={plantioInicio}
                onChangeText={(text) => setPlantioInicio(maskDate(text))}
                keyboardType="numeric"
                placeholder="dd/mm/aaaa"
                maxLength={10}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Plantio Fim</Text>
              <TextInput
                style={styles.input}
                value={plantioFim}
                onChangeText={(text) => setPlantioFim(maskDate(text))}
                keyboardType="numeric"
                placeholder="dd/mm/aaaa"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Período (dias)</Text>
              <TextInput
                style={styles.input}
                value={periodoDias}
                onChangeText={setPeriodoDias}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Água (mm)</Text>
              <TextInput
                style={styles.input}
                value={agua}
                onChangeText={setAgua}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>N (kg/ha)</Text>
              <TextInput
                style={styles.input}
                value={nitrogenio}
                onChangeText={setNitrogenio}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>P (kg/ha)</Text>
              <TextInput
                style={styles.input}
                value={fosforo}
                onChangeText={setFosforo}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>K (kg/ha)</Text>
              <TextInput
                style={styles.input}
                value={potassio}
                onChangeText={setPotassio}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Ciclo (dias)</Text>
          <TextInput
            style={styles.input}
            value={cicloDias}
            onChangeText={setCicloDias}
            keyboardType="numeric"
            placeholder="0"
          />

          <Text style={styles.inputLabel}>Observação</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            value={observacao}
            onChangeText={setObservacao}
            multiline={true}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Praga</Text>
              <CustomPicker
                selectedValue={praga}
                onValueChange={setPraga}
                options={pragasDisponiveis}
                placeholder="Selecione a praga..."
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Fornecedor</Text>
              <TextInput
                style={styles.input}
                value={fornecedor}
                onChangeText={setFornecedor}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateCultivo}
          >
            <Text style={styles.createButtonText}>CADASTRAR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.primary },
  header: {
    backgroundColor: colors.primary,
    padding: 15,
    paddingTop: Platform.OS === "ios" ? 44 : 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: colors.white },
  formContent: { padding: 20, backgroundColor: "#1E322D", flexGrow: 1 },
  inputLabel: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: "center",
    fontSize: 16,
    color: colors.textPrimary,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  column: { flex: 1 },
  createButton: {
    backgroundColor: "#4B7940",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  createButtonText: { color: colors.white, fontSize: 18, fontWeight: "bold" },
});
