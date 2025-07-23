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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList, Cultivar } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { createCultivar, updateCultivar } from "../../services/api";
import { CustomPicker } from "../../components/CustomPicker";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCultivoScreen"
>;
type AddCultivoScreenRouteProp = RouteProp<
  RootStackParamList,
  "AddCultivoScreen"
>;

// --- FUNÇÕES DE FORMATAÇÃO DE DATA ---
const maskDate = (text: string) => {
  let digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 4)
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const toAPIDate = (dateString: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return null;
  const [day, month, year] = dateString.split("/");
  return new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day))
  ).toISOString();
};

const fromAPIDate = (dateString: string) => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) return "";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

// --- OPÇÕES PARA OS SELETORES ---
const tipoPlantaOptions = [
  { label: "Soja", value: "SOJA" },
  { label: "Milho", value: "MILHO" },
  { label: "Feijão", value: "FEIJAO" },
  { label: "Arroz", value: "ARROZ" },
  { label: "Café", value: "CAFE" },
  { label: "Algodão", value: "ALGODAO" },
  { label: "Banana", value: "BANANA" },
  { label: "Laranja", value: "LARANJA" },
];

const tipoSoloOptions = [
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

export default function AddCultivoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddCultivoScreenRouteProp>();
  const cultivarToEdit = route.params?.cultivar;
  const isEditMode = !!cultivarToEdit;

  const [isLoading, setIsLoading] = useState(false);
  // --- Estados do formulário ---
  const [nomeCientifico, setNomeCientifico] = useState("");
  const [nomePopular, setNomePopular] = useState("");
  const [tipoPlanta, setTipoPlanta] = useState("");
  const [tipoSolo, setTipoSolo] = useState("");
  const [phSolo, setPhSolo] = useState("");
  const [dataPlantioInicio, setDataPlantioInicio] = useState("");
  const [dataPlantioFim, setDataPlantioFim] = useState("");
  const [periodoDias, setPeriodoDias] = useState("");
  const [mmAgua, setMmAgua] = useState("");
  const [aduboNitrogenio, setAduboNitrogenio] = useState("");
  const [aduboFosforo, setAduboFosforo] = useState("");
  const [aduboPotassio, setAduboPotassio] = useState("");
  const [aduboCalcio, setAduboCalcio] = useState(""); // Adicionado
  const [aduboMagnesio, setAduboMagnesio] = useState(""); // Adicionado
  const [tempoCicloDias, setTempoCicloDias] = useState("");
  const [densidadePlantio, setDensidadePlantio] = useState("");
  const [densidadeColheita, setDensidadeColheita] = useState("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    if (isEditMode && cultivarToEdit) {
      setNomeCientifico(cultivarToEdit.nomeCientifico || "");
      setNomePopular(cultivarToEdit.nomePopular || "");
      setTipoPlanta(cultivarToEdit.tipoPlanta || "");
      setTipoSolo(cultivarToEdit.tipoSolo || "");
      setPhSolo(cultivarToEdit.phSolo?.toString() || "");
      setDataPlantioInicio(fromAPIDate(cultivarToEdit.dataPlantioInicio));
      setDataPlantioFim(fromAPIDate(cultivarToEdit.dataPlantioFim));
      setPeriodoDias(cultivarToEdit.periodoDias?.toString() || "");
      setMmAgua(cultivarToEdit.mmAgua?.toString() || "");
      setAduboNitrogenio(cultivarToEdit.aduboNitrogenio?.toString() || "");
      setAduboFosforo(cultivarToEdit.aduboFosforo?.toString() || "");
      setAduboPotassio(cultivarToEdit.aduboPotassio?.toString() || "");
      setAduboCalcio(cultivarToEdit.aduboCalcio?.toString() || ""); // Adicionado
      setAduboMagnesio(cultivarToEdit.aduboMagnesio?.toString() || ""); // Adicionado
      setTempoCicloDias(cultivarToEdit.tempoCicloDias?.toString() || "");
      setDensidadePlantio(cultivarToEdit.densidadePlantio?.toString() || "");
      setDensidadeColheita(cultivarToEdit.densidadeColheita?.toString() || "");
      setObservacao(cultivarToEdit.observacao || "");
    }
  }, [isEditMode, cultivarToEdit]);

  const handleCreateOrUpdate = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) throw new Error("Sessão expirada.");

      const cultivarData = {
        nomeCientifico,
        nomePopular,
        tipoPlanta,
        tipoSolo,
        observacao,
        phSolo: parseFloat(phSolo.replace(",", ".")) || 0,
        dataPlantioInicio: toAPIDate(dataPlantioInicio)!,
        dataPlantioFim: toAPIDate(dataPlantioFim)!,
        periodoDias: parseInt(periodoDias, 10) || 0,
        mmAgua: parseInt(mmAgua, 10) || 0,
        aduboNitrogenio: parseInt(aduboNitrogenio, 10) || 0,
        aduboFosforo: parseInt(aduboFosforo, 10) || 0,
        aduboPotassio: parseInt(aduboPotassio, 10) || 0,
        aduboCalcio: parseInt(aduboCalcio, 10) || 0, // Adicionado
        aduboMagnesio: parseInt(aduboMagnesio, 10) || 0, // Adicionado
        tempoCicloDias: parseInt(tempoCicloDias, 10) || 0,
        densidadePlantio: parseInt(densidadePlantio, 10) || 0,
        densidadeColheita: parseInt(densidadeColheita, 10) || 0,
      };

      if (isEditMode && cultivarToEdit) {
        await updateCultivar(cultivarToEdit.id, cultivarData, token);
        Alert.alert("Sucesso!", "Cultivar atualizado com sucesso.");
      } else {
        await createCultivar(cultivarData as Omit<Cultivar, "id">, token);
        Alert.alert("Sucesso!", "Cultivar cadastrado com sucesso.");
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Erro ao Salvar", error.message);
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.headerTitle}>
            {isEditMode ? "Editar Cultivar" : "Adicionar Cultivar"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Nome Científico</Text>
              <TextInput
                style={styles.input}
                value={nomeCientifico}
                onChangeText={setNomeCientifico}
                placeholder="Ex: Glycine max"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Nome Popular</Text>
              <TextInput
                style={styles.input}
                value={nomePopular}
                onChangeText={setNomePopular}
                placeholder="Ex: Soja"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Especificações da Planta</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tipo de Planta</Text>
              <CustomPicker
                selectedValue={tipoPlanta}
                onValueChange={setTipoPlanta}
                options={tipoPlantaOptions}
                placeholder="Selecione..."
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tipo de Solo Ideal</Text>
              <CustomPicker
                selectedValue={tipoSolo}
                onValueChange={setTipoSolo}
                options={tipoSoloOptions}
                placeholder="Selecione..."
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Ciclo e Plantio</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Início do Plantio</Text>
              <TextInput
                style={styles.input}
                value={dataPlantioInicio}
                onChangeText={(text) => setDataPlantioInicio(maskDate(text))}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                maxLength={10}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Fim do Plantio</Text>
              <TextInput
                style={styles.input}
                value={dataPlantioFim}
                onChangeText={(text) => setDataPlantioFim(maskDate(text))}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                maxLength={10}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Ciclo Total (dias)</Text>
              <TextInput
                style={styles.input}
                value={tempoCicloDias}
                onChangeText={setTempoCicloDias}
                keyboardType="numeric"
                placeholder="Ex: 150"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Janela de Plantio (dias)</Text>
              <TextInput
                style={styles.input}
                value={periodoDias}
                onChangeText={setPeriodoDias}
                keyboardType="numeric"
                placeholder="Ex: 120"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Necessidades e Adubação</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Água (mm)</Text>
              <TextInput
                style={styles.input}
                value={mmAgua}
                onChangeText={setMmAgua}
                keyboardType="numeric"
                placeholder="Ex: 800"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>pH Ideal do Solo</Text>
              <TextInput
                style={styles.input}
                value={phSolo}
                onChangeText={setPhSolo}
                keyboardType="numeric"
                placeholder="Ex: 6.5"
              />
            </View>
          </View>
          <Text style={styles.subSectionTitle}>Adubação (kg/ha)</Text>
          <View style={styles.row}>
            <View style={styles.aduboColumn}>
              <Text style={styles.inputLabel}>N</Text>
              <TextInput
                style={styles.input}
                value={aduboNitrogenio}
                onChangeText={setAduboNitrogenio}
                keyboardType="numeric"
                placeholder="kg/ha"
              />
            </View>
            <View style={styles.aduboColumn}>
              <Text style={styles.inputLabel}>P</Text>
              <TextInput
                style={styles.input}
                value={aduboFosforo}
                onChangeText={setAduboFosforo}
                keyboardType="numeric"
                placeholder="kg/ha"
              />
            </View>
            <View style={styles.aduboColumn}>
              <Text style={styles.inputLabel}>K</Text>
              <TextInput
                style={styles.input}
                value={aduboPotassio}
                onChangeText={setAduboPotassio}
                keyboardType="numeric"
                placeholder="kg/ha"
              />
            </View>
            {/* CAMPOS ADICIONADOS */}
            <View style={styles.aduboColumn}>
              <Text style={styles.inputLabel}>Ca</Text>
              <TextInput
                style={styles.input}
                value={aduboCalcio}
                onChangeText={setAduboCalcio}
                keyboardType="numeric"
                placeholder="kg/ha"
              />
            </View>
            <View style={styles.aduboColumn}>
              <Text style={styles.inputLabel}>Mg</Text>
              <TextInput
                style={styles.input}
                value={aduboMagnesio}
                onChangeText={setAduboMagnesio}
                keyboardType="numeric"
                placeholder="kg/ha"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Densidade (plantas/ha)</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Densidade de Plantio</Text>
              <TextInput
                style={styles.input}
                value={densidadePlantio}
                onChangeText={setDensidadePlantio}
                keyboardType="numeric"
                placeholder="Ex: 300000"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>População na Colheita</Text>
              <TextInput
                style={styles.input}
                value={densidadeColheita}
                onChangeText={setDensidadeColheita}
                keyboardType="numeric"
                placeholder="Ex: 280000"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            value={observacao}
            onChangeText={setObservacao}
            multiline
            placeholder="Resistência a doenças, ciclo da variedade, etc."
          />

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateOrUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.createButtonText}>
                {isEditMode ? "ATUALIZAR CULTIVAR" : "CADASTRAR CULTIVAR"}
              </Text>
            )}
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
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    paddingBottom: 5,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
  },
  inputLabel: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: colors.textPrimary,
  },
  createButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 40,
    height: 54,
    justifyContent: "center",
  },
  createButtonText: { color: colors.white, fontSize: 18, fontWeight: "bold" },
  row: { flexDirection: "row", marginHorizontal: -5 },
  column: { flex: 1, marginHorizontal: 5 },
  aduboColumn: { flex: 1, marginHorizontal: 3 },
});
