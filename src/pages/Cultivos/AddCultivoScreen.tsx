import React, { useState, useEffect } from "react";
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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CustomPicker } from "../../components/CustomPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList } from "../../screens/Types";
import { colors } from "../../components/Colors";
// Importamos a função de update da API
import { updateCultivar } from "../../services/api";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCultivoScreen"
>;
// Usamos RouteProp para obter o tipo dos parâmetros da rota
type AddCultivoScreenRouteProp = RouteProp<RootStackParamList, 'AddCultivoScreen'>;


// ENUMs que correspondem ao backend
const tiposDePlantaDisponiveis = [
  { label: "Selecione o tipo de planta...", value: "" },
  { label: "Soja", value: "SOJA" },
  { label: "Milho", value: "MILHO" },
  { label: "Feijão", value: "FEIJAO" },
];

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

// Função para formatar a data enquanto o usuário digita
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

// Função para converter data de DD/MM/AAAA para AAAA-MM-DD
const formatDateToISO = (dateString: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return null;
  }
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

// Função para converter data de ISO (do backend) para DD/MM/AAAA
const formatDateFromISO = (isoString: string | null | undefined): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};


export default function AddCultivoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddCultivoScreenRouteProp>();
  
  // Verifica se estamos em modo de edição e pega os dados do cultivo
  const cultivarToEdit = route.params?.cultivar;
  const isEditMode = !!cultivarToEdit;

  // Estados para todos os campos do DTO
  const [nomeCientifico, setNomeCientifico] = useState("");
  const [nomePopular, setNomePopular] = useState("");
  const [tipoPlanta, setTipoPlanta] = useState("");
  const [tipoSolo, setTipoSolo] = useState("");
  const [phSolo, setPhSolo] = useState("");
  const [plantioInicio, setPlantioInicio] = useState("");
  const [plantioFim, setPlantioFim] = useState("");
  const [periodoDias, setPeriodoDias] = useState("");
  const [mmAgua, setMmAgua] = useState("");
  const [nitrogenio, setNitrogenio] = useState("");
  const [fosforo, setFosforo] = useState("");
  const [potassio, setPotassio] = useState("");
  const [calcio, setCalcio] = useState("");
  const [magnesio, setMagnesio] = useState("");
  const [cicloDias, setCicloDias] = useState("");
  const [densidadePlantio, setDensidadePlantio] = useState("");
  const [densidadeColheita, setDensidadeColheita] = useState("");
  const [observacao, setObservacao] = useState("");
  const [idPraga, setIdPraga] = useState("");
  const [idFornecedor, setIdFornecedor] = useState("");

  // **useEffect para preencher o formulário em modo de edição**
  useEffect(() => {
    if (isEditMode && cultivarToEdit) {
      setNomeCientifico(cultivarToEdit.nomeCientifico);
      setNomePopular(cultivarToEdit.nomePopular);
      setTipoPlanta(cultivarToEdit.tipoPlanta);
      setTipoSolo(cultivarToEdit.tipoSolo);
      setPhSolo(String(cultivarToEdit.phSolo));
      setPlantioInicio(formatDateFromISO(cultivarToEdit.dataPlantioInicio));
      setPlantioFim(formatDateFromISO(cultivarToEdit.dataPlantioFim));
      setPeriodoDias(String(cultivarToEdit.periodoDias));
      setMmAgua(String(cultivarToEdit.mmAgua));
      setNitrogenio(String(cultivarToEdit.aduboNitrogenio));
      setFosforo(String(cultivarToEdit.aduboFosforo));
      setPotassio(String(cultivarToEdit.aduboPotassio));
      setCalcio(String(cultivarToEdit.aduboCalcio ?? ''));
      setMagnesio(String(cultivarToEdit.aduboMagnesio ?? ''));
      setCicloDias(String(cultivarToEdit.tempoCicloDias));
      setDensidadePlantio(String(cultivarToEdit.densidadePlantio));
      setDensidadeColheita(String(cultivarToEdit.densidadeColheita));
      setObservacao(cultivarToEdit.observacao ?? '');
      setIdPraga(String(cultivarToEdit.idPraga ?? ''));
      setIdFornecedor(String(cultivarToEdit.idFornecedor ?? ''));
    }
  }, [isEditMode, cultivarToEdit]);


  const handleFormSubmit = async () => {
    if (!nomeCientifico || !nomePopular || !tipoPlanta || !tipoSolo || !densidadePlantio || !densidadeColheita) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dataInicioISO = formatDateToISO(plantioInicio);
    const dataFimISO = formatDateToISO(plantioFim);

    if (!dataInicioISO || !dataFimISO) {
        Alert.alert("Erro", "Por favor, insira as datas de plantio no formato DD/MM/AAAA.");
        return;
    }

    const cultivoData: any = {
      nomeCientifico,
      nomePopular,
      tipoPlanta,
      tipoSolo,
      phSolo: parseFloat(phSolo) || 0,
      dataPlantioInicio: dataInicioISO,
      dataPlantioFim: dataFimISO,
      periodoDias: parseInt(periodoDias, 10) || 0,
      mmAgua: parseInt(mmAgua, 10) || 0,
      aduboNitrogenio: parseInt(nitrogenio, 10) || 0,
      aduboFosforo: parseInt(fosforo, 10) || 0,
      aduboPotassio: parseInt(potassio, 10) || 0,
      tempoCicloDias: parseInt(cicloDias, 10) || 0,
      densidadePlantio: parseInt(densidadePlantio, 10) || 0,
      densidadeColheita: parseInt(densidadeColheita, 10) || 0,
    };

    if (calcio) cultivoData.aduboCalcio = parseInt(calcio, 10);
    if (magnesio) cultivoData.aduboMagnesio = parseInt(magnesio, 10);
    if (observacao) cultivoData.observacao = observacao;
    if (idPraga) cultivoData.idPraga = parseInt(idPraga, 10);
    if (idFornecedor) cultivoData.idFornecedor = parseInt(idFornecedor, 10);

    try {
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) {
        Alert.alert("Erro de Autenticação", "Faça login novamente.");
        return;
      }
      
      const API_BASE_URL = "http://192.168.3.40:3000";
      
      if (isEditMode && cultivarToEdit) {
        // Modo Edição: chama a função de update
        await updateCultivar(cultivarToEdit.id, cultivoData);
        Alert.alert("Sucesso!", "O cultivo foi atualizado.");
      } else {
        // Modo Criação: chama a função de create
        const response = await fetch(`${API_BASE_URL}/cultivar`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(cultivoData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Não foi possível cadastrar o cultivo.";
            const displayMessage = Array.isArray(errorMessage) ? errorMessage.join('\n') : errorMessage;
            throw new Error(displayMessage);
        }
        Alert.alert("Sucesso!", "O cultivo foi cadastrado.");
      }
      
      navigation.goBack();

    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro ao Salvar", error.message || "Não foi possível conectar ao servidor.");
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
          {/* Título dinâmico */}
          <Text style={styles.headerTitle}>{isEditMode ? 'Editar Cultivar' : 'Adicionar Cultivar'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.inputLabel}>Nome Científico</Text>
          <TextInput style={styles.input} value={nomeCientifico} onChangeText={setNomeCientifico} />

          <Text style={styles.inputLabel}>Nome Popular</Text>
          <TextInput style={styles.input} value={nomePopular} onChangeText={setNomePopular} />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tipo de Planta</Text>
              <CustomPicker selectedValue={tipoPlanta} onValueChange={setTipoPlanta} options={tiposDePlantaDisponiveis} />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Tipo de Solo</Text>
              <CustomPicker selectedValue={tipoSolo} onValueChange={setTipoSolo} options={tiposDeSoloDisponiveis} />
            </View>
          </View>

          <Text style={styles.inputLabel}>pH do Solo</Text>
          <TextInput style={styles.input} value={phSolo} onChangeText={setPhSolo} keyboardType="numeric" placeholder="Ex: 6.5" />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Início do Plantio</Text>
              <TextInput style={styles.input} value={plantioInicio} onChangeText={(text) => setPlantioInicio(maskDate(text))} keyboardType="numeric" placeholder="DD/MM/AAAA" maxLength={10} />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Fim do Plantio</Text>
              <TextInput style={styles.input} value={plantioFim} onChangeText={(text) => setPlantioFim(maskDate(text))} keyboardType="numeric" placeholder="DD/MM/AAAA" maxLength={10} />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Período (dias)</Text>
              <TextInput style={styles.input} value={periodoDias} onChangeText={setPeriodoDias} keyboardType="numeric" placeholder="0" />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Água (mm)</Text>
              <TextInput style={styles.input} value={mmAgua} onChangeText={setMmAgua} keyboardType="numeric" placeholder="0" />
            </View>
          </View>

          <Text style={styles.inputLabel}>Adubação (kg/ha)</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.subInputLabel}>Nitrogênio (N)</Text>
              <TextInput style={styles.input} value={nitrogenio} onChangeText={setNitrogenio} keyboardType="numeric" placeholder="0" />
            </View>
            <View style={styles.column}>
              <Text style={styles.subInputLabel}>Fósforo (P)</Text>
              <TextInput style={styles.input} value={fosforo} onChangeText={setFosforo} keyboardType="numeric" placeholder="0" />
            </View>
            <View style={styles.column}>
              <Text style={styles.subInputLabel}>Potássio (K)</Text>
              <TextInput style={styles.input} value={potassio} onChangeText={setPotassio} keyboardType="numeric" placeholder="0" />
            </View>
          </View>
          <View style={[styles.row, {marginTop: 10}]}>
            <View style={styles.column}>
              <Text style={styles.subInputLabel}>Cálcio (Ca)</Text>
              <TextInput style={styles.input} value={calcio} onChangeText={setCalcio} keyboardType="numeric" placeholder="0 (Opcional)" />
            </View>
            <View style={styles.column}>
              <Text style={styles.subInputLabel}>Magnésio (Mg)</Text>
              <TextInput style={styles.input} value={magnesio} onChangeText={setMagnesio} keyboardType="numeric" placeholder="0 (Opcional)" />
            </View>
          </View>

          <Text style={styles.inputLabel}>Ciclo Total (dias)</Text>
          <TextInput style={styles.input} value={cicloDias} onChangeText={setCicloDias} keyboardType="numeric" placeholder="0" />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Densidade Plantio</Text>
              <TextInput style={styles.input} value={densidadePlantio} onChangeText={setDensidadePlantio} keyboardType="numeric" placeholder="plantas/ha" />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Densidade Colheita</Text>
              <TextInput style={styles.input} value={densidadeColheita} onChangeText={setDensidadeColheita} keyboardType="numeric" placeholder="plantas/ha" />
            </View>
          </View>

          <Text style={styles.inputLabel}>Observação</Text>
          <TextInput style={[styles.input, { height: 100, textAlignVertical: "top" }]} value={observacao} onChangeText={setObservacao} multiline={true} />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>ID da Praga (Opcional)</Text>
              <TextInput style={styles.input} value={idPraga} onChangeText={setIdPraga} keyboardType="numeric" placeholder="Ex: 1" />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>ID do Fornecedor (Opcional)</Text>
              <TextInput style={styles.input} value={idFornecedor} onChangeText={setIdFornecedor} keyboardType="numeric" placeholder="Ex: 1" />
            </View>
          </View>
          
          <TouchableOpacity style={styles.createButton} onPress={handleFormSubmit}>
            <Text style={styles.createButtonText}>{isEditMode ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR'}</Text>
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
  subInputLabel: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 5,
    textAlign: 'center'
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
