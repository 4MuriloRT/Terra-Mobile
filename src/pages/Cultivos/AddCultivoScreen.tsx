import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { createCultivar } from "../../services/api";
import { CustomPicker } from "../../components/CustomPicker";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCultivoScreen"
>;

// Função para formatar a data automaticamente no formato DD/MM/AAAA
const maskDate = (text: string) => {
  let digits = text.replace(/\D/g, "");
  digits = digits.slice(0, 8);
  if (digits.length > 4)
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

// Função para converter data DD/MM/AAAA para formato AAAA-MM-DD
const toAPIDate = (dateString: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return null;
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

export default function AddCultivoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para todos os campos do formulário
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
  const [tempoCicloDias, setTempoCicloDias] = useState("");
  const [densidadePlantio, setDensidadePlantio] = useState("");
  const [densidadeColheita, setDensidadeColheita] = useState("");
  const [observacao, setObservacao] = useState("");

  const handleCreate = async () => {
    // Validação mais completa baseada no DTO
    const requiredFields = [
      nomeCientifico,
      nomePopular,
      tipoPlanta,
      tipoSolo,
      phSolo,
      dataPlantioInicio,
      dataPlantioFim,
      periodoDias,
      mmAgua,
      aduboNitrogenio,
      aduboFosforo,
      aduboPotassio,
      tempoCicloDias,
      densidadePlantio,
      densidadeColheita,
    ];

    if (requiredFields.some((field) => !field)) {
      Alert.alert(
        "Erro",
        "Por favor, preencha todos os campos obrigatórios (*)."
      );
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");

      const cultivarData = {
        nomeCientifico,
        nomePopular,
        tipoPlanta,
        tipoSolo,
        phSolo: parseFloat(phSolo.replace(",", ".")) || 0,
        dataPlantioInicio: toAPIDate(dataPlantioInicio),
        dataPlantioFim: toAPIDate(dataPlantioFim),
        periodoDias: parseInt(periodoDias) || 0,
        mmAgua: parseInt(mmAgua) || 0,
        aduboNitrogenio: parseInt(aduboNitrogenio) || 0,
        aduboFosforo: parseInt(aduboFosforo) || 0,
        aduboPotassio: parseInt(aduboPotassio) || 0,
        tempoCicloDias: parseInt(tempoCicloDias) || 0,
        densidadePlantio: parseInt(densidadePlantio) || 0,
        densidadeColheita: parseInt(densidadeColheita) || 0,
        observacao,
      };

      await createCultivar(cultivarData, token);
      Alert.alert("Sucesso!", "Cultivar cadastrado com sucesso.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Erro ao Cadastrar", error.message);
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
          <Text style={styles.headerTitle}>Adicionar Cultivar</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <Text style={styles.inputLabel}>Nome Científico *</Text>
          <TextInput
            style={styles.input}
            value={nomeCientifico}
            onChangeText={setNomeCientifico}
            placeholder="Ex: Glycine max"
          />
          <Text style={styles.inputLabel}>Nome Popular *</Text>
          <TextInput
            style={styles.input}
            value={nomePopular}
            onChangeText={setNomePopular}
            placeholder="Ex: Soja"
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tipo de Planta *</Text>
              <CustomPicker
                selectedValue={tipoPlanta}
                onValueChange={(value) => setTipoPlanta(value)}
                options={[
                  { label: "Soja", value: "SOJA" },
                  { label: "Milho", value: "MILHO" },
                ]}
                placeholder="Selecione..."
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tipo de Solo *</Text>
              <CustomPicker
                selectedValue={tipoSolo}
                onValueChange={(value) => setTipoSolo(value)}
                options={[
                  { label: "Latossolo", value: "LATOSSOLO" },
                  { label: "Argissolo", value: "ARGISSOLO" },
                ]}
                placeholder="Selecione..."
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Ciclo e Plantio</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Início do Plantio *</Text>
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
              <Text style={styles.inputLabel}>Fim do Plantio *</Text>
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
              <Text style={styles.inputLabel}>Período Total (dias) *</Text>
              <TextInput
                style={styles.input}
                value={periodoDias}
                onChangeText={setPeriodoDias}
                keyboardType="numeric"
                placeholder="Ex: 120"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tempo de Ciclo (dias) *</Text>
              <TextInput
                style={styles.input}
                value={tempoCicloDias}
                onChangeText={setTempoCicloDias}
                keyboardType="numeric"
                placeholder="Ex: 150"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Necessidades e Adubação</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Água (mm) *</Text>
              <TextInput
                style={styles.input}
                value={mmAgua}
                onChangeText={setMmAgua}
                keyboardType="numeric"
                placeholder="Ex: 800"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>pH Ideal do Solo *</Text>
              <TextInput
                style={styles.input}
                value={phSolo}
                onChangeText={setPhSolo}
                keyboardType="numeric"
                placeholder="Ex: 6.5"
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Nitrogênio (N) *</Text>
              <TextInput
                style={styles.input}
                value={aduboNitrogenio}
                onChangeText={setAduboNitrogenio}
                keyboardType="numeric"
                placeholder="kg/ha"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Fósforo (P) *</Text>
              <TextInput
                style={styles.input}
                value={aduboFosforo}
                onChangeText={setAduboFosforo}
                keyboardType="numeric"
                placeholder="kg/ha"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Potássio (K) *</Text>
              <TextInput
                style={styles.input}
                value={aduboPotassio}
                onChangeText={setAduboPotassio}
                keyboardType="numeric"
                placeholder="kg/ha"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Densidade</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Plantio (plantas/ha) *</Text>
              <TextInput
                style={styles.input}
                value={densidadePlantio}
                onChangeText={setDensidadePlantio}
                keyboardType="numeric"
                placeholder="Ex: 300000"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Colheita (plantas/ha) *</Text>
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
            placeholder="Observações adicionais..."
          />

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.createButtonText}>CADASTRAR CULTIVAR</Text>
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
  createButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
    height: 54,
    justifyContent: "center",
  },
  createButtonText: { color: colors.white, fontSize: 18, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
});
