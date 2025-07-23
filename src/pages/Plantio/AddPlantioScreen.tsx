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
  SafeAreaView,
  Modal, // Importação corrigida
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  RootStackParamList,
  Plantio as PlantioType,
} from "../../screens/Types";
import { colors } from "../../components/Colors";
import {
  createPlantio,
  updatePlantio,
  deletePlantio as deletePlantioApi,
  createAnaliseSolo, // Importação adicionada
} from "../../services/api";
import { CustomPicker } from "../../components/CustomPicker";
import AnaliseSoloScreen from "./AnaliseSoloScreen";

// Tipagem para as props do componente
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddPlantioScreen"
>;
type AddPlantioRouteProp = RouteProp<RootStackParamList, "AddPlantioScreen">;

// Opções para os seletores
const fertilizerAndDefensiveUnitOptions = [
  { label: "KG/HA", value: "KG_HA" },
  { label: "G/HA", value: "G_HA" },
  { label: "ML/HA", value: "ML_HA" },
  { label: "L/HA", value: "L_HA" },
  { label: "TON/HA", value: "TON_HA" },
];

const plantioStatusOptions = [
  { label: "Planejado", value: "PLANEJADO" },
  { label: "Executado", value: "EXECUTADO" },
  { label: "Em Monitoramento", value: "EM_MONITORAMENTO" },
  { label: "Concluído", value: "CONCLUIDO" },
];

// Funções utilitárias
const maskDate = (text: string) => {
  let digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 4)
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const toISODate = (dateString: string) => {
  if (!dateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return null;
  const [day, month, year] = dateString.split("/");
  return new Date(`${year}-${month}-${day}`).toISOString();
};

const formatDateForInput = (isoDate?: string): string => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return ""; // Checagem de data inválida
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

// Componentes de Layout
const FormRow = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.row}>{children}</View>
);

interface FormColumnProps {
  children: React.ReactNode;
  flex?: number;
}
const FormColumn: React.FC<FormColumnProps> = ({ children, flex = 1 }) => (
  <View style={[styles.column, { flex }]}>{children}</View>
);

export default function AddPlantioScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddPlantioRouteProp>();
  const { farmId, cultureType, cultivarId, plantio } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!plantio?.id;

  // --- Estados do Formulário ---
  const [dataPlantio, setDataPlantio] = useState("");
  const [dataEmergencia, setDataEmergencia] = useState("");
  const [dataPrevistaColheita, setDataPrevistaColheita] = useState("");
  const [dataMaturacao, setDataMaturacao] = useState("");
  const [areaPlantada, setAreaPlantada] = useState("");
  const [densidadePlanejada, setDensidadePlanejada] = useState("");
  const [densidadePlantioReal, setDensidadePlantioReal] = useState("");
  const [phSoloInicial, setPhSoloInicial] = useState("");
  const [umidadeSoloInicial, setUmidadeSoloInicial] = useState("");
  const [espacamentoEntreLinhas, setEspacamentoEntreLinhas] = useState("");
  const [loteSemente, setLoteSemente] = useState("");
  const [taxaGerminacao, setTaxaGerminacao] = useState("");
  const [tratamentoSemente, setTratamentoSemente] = useState("");
  const [profundidadeSemeadura, setProfundidadeSemeadura] = useState("");
  const [orientacaoTransplantio, setOrientacaoTransplantio] = useState("");
  const [mmAguaAplicado, setMmAguaAplicado] = useState("");
  const [irrigacaoVolume, setIrrigacaoVolume] = useState("");
  const [irrigacaoDuracao, setIrrigacaoDuracao] = useState("");
  const [aduboNitrogenioDose, setAduboNitrogenioDose] = useState("");
  const [aduboNitrogenioUnidade, setAduboNitrogenioUnidade] = useState("KG_HA");
  const [aduboPotassioDose, setAduboPotassioDose] = useState("");
  const [aduboPotassioUnidade, setAduboPotassioUnidade] = useState("KG_HA");
  const [aduboFosforoDose, setAduboFosforoDose] = useState("");
  const [aduboFosforoUnidade, setAduboFosforoUnidade] = useState("KG_HA");
  const [defensivoUtilizado, setDefensivoUtilizado] = useState("");
  const [doseDefensivo, setDoseDefensivo] = useState("");
  const [unidadeDefensivo, setUnidadeDefensivo] = useState("L_HA");
  const [custoSemente, setCustoSemente] = useState("");
  const [custoFertilizante, setCustoFertilizante] = useState("");
  const [custoDefensivo, setCustoDefensivo] = useState("");
  const [custoCombustivel, setCustoCombustivel] = useState("");
  const [custoOutros, setCustoOutros] = useState("");
  const [statusPlantio, setStatusPlantio] = useState("PLANEJADO");
  const [observacao, setObservacao] = useState("");
  const [isAnaliseModalVisible, setAnaliseModalVisible] = useState(false);
  const [dadosAnaliseSolo, setDadosAnaliseSolo] = useState<any>(null);

  useEffect(() => {
    if (isEditing && plantio) {
      setDataPlantio(formatDateForInput(plantio.dataPlantio));
      setDataEmergencia(formatDateForInput(plantio.dataEmergencia));
      setDataPrevistaColheita(formatDateForInput(plantio.dataPrevistaColheita));
      setDataMaturacao(formatDateForInput(plantio.dataMaturacao));
      setAreaPlantada(String(plantio.areaPlantada || ""));
      setDensidadePlanejada(String(plantio.densidadePlanejada || ""));
      setDensidadePlantioReal(String(plantio.densidadePlantioReal || ""));
      setPhSoloInicial(String(plantio.phSoloInicial || ""));
      setUmidadeSoloInicial(String(plantio.umidadeSoloInicial || ""));
      setEspacamentoEntreLinhas(String(plantio.espacamentoEntreLinhas || ""));
      setLoteSemente(plantio.loteSemente || "");
      setTaxaGerminacao(String(plantio.taxaGerminacao || ""));
      setTratamentoSemente(plantio.tratamentoSemente || "");
      setProfundidadeSemeadura(String(plantio.profundidadeSemeadura || ""));
      setOrientacaoTransplantio(plantio.orientacaoTransplantio || "");
      setMmAguaAplicado(String(plantio.mmAguaAplicado || ""));
      setIrrigacaoVolume(String(plantio.irrigacaoVolume || ""));
      setIrrigacaoDuracao(String(plantio.irrigacaoDuracao || ""));
      setAduboNitrogenioDose(String(plantio.aduboNitrogenioDose || ""));
      setAduboNitrogenioUnidade(plantio.aduboNitrogenioUnidade || "KG_HA");
      setAduboPotassioDose(String(plantio.aduboPotassioDose || ""));
      setAduboPotassioUnidade(plantio.aduboPotassioUnidade || "KG_HA");
      setAduboFosforoDose(String(plantio.aduboFosforoDose || ""));
      setAduboFosforoUnidade(plantio.aduboFosforoUnidade || "KG_HA");
      setDefensivoUtilizado(plantio.defensivoUtilizado || "");
      setDoseDefensivo(String(plantio.doseDefensivo || ""));
      setUnidadeDefensivo(plantio.unidadeDefensivo || "L_HA");
      setCustoSemente(String(plantio.custoSemente || ""));
      setCustoFertilizante(String(plantio.custoFertilizante || ""));
      setCustoDefensivo(String(plantio.custoDefensivo || ""));
      setCustoCombustivel(String(plantio.custoCombustivel || ""));
      setCustoOutros(String(plantio.custoOutros || ""));
      setStatusPlantio(plantio.statusPlantio || "PLANEJADO");
      setObservacao(plantio.observacao || "");
      if (plantio.idAnaliseSolo) {
        setDadosAnaliseSolo({ id: plantio.idAnaliseSolo });
      }
    }
  }, [plantio, isEditing]);

  const handleSavePlantio = async () => {
    if (!dataPlantio || !areaPlantada || !densidadePlanejada) {
      Alert.alert("Erro", "Preencha os campos obrigatórios (*).");
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) throw new Error("Sessão expirada.");

      let idAnaliseSoloFinal = dadosAnaliseSolo?.id || null;

      if (dadosAnaliseSolo && !dadosAnaliseSolo.id) {
        const analiseCriada = await createAnaliseSolo(dadosAnaliseSolo, token);
        idAnaliseSoloFinal = analiseCriada.id;
      }

      const payload = {
        idFazenda: parseInt(farmId, 10),
        idCultivar: parseInt(
          isEditing ? String(plantio.idCultivar) : cultivarId!,
          10
        ),
        idAnaliseSolo: idAnaliseSoloFinal,
        dataPlantio: toISODate(dataPlantio),
        dataEmergencia: toISODate(dataEmergencia),
        dataPrevistaColheita: toISODate(dataPrevistaColheita),
        dataMaturacao: toISODate(dataMaturacao),
        areaPlantada: parseFloat(areaPlantada.replace(",", ".")) || null,
        densidadePlanejada: parseInt(densidadePlanejada, 10) || null,
        densidadePlantioReal: parseInt(densidadePlantioReal, 10) || null,
        phSoloInicial: parseFloat(phSoloInicial.replace(",", ".")) || null,
        umidadeSoloInicial:
          parseFloat(umidadeSoloInicial.replace(",", ".")) || null,
        espacamentoEntreLinhas:
          parseFloat(espacamentoEntreLinhas.replace(",", ".")) || null,
        loteSemente,
        taxaGerminacao: parseFloat(taxaGerminacao.replace(",", ".")) || null,
        tratamentoSemente,
        profundidadeSemeadura:
          parseFloat(profundidadeSemeadura.replace(",", ".")) || null,
        orientacaoTransplantio,
        mmAguaAplicado: parseFloat(mmAguaAplicado.replace(",", ".")) || null,
        irrigacaoVolume: parseFloat(irrigacaoVolume.replace(",", ".")) || null,
        irrigacaoDuracao: parseInt(irrigacaoDuracao, 10) || null,
        aduboNitrogenioDose:
          parseFloat(aduboNitrogenioDose.replace(",", ".")) || null,
        aduboNitrogenioUnidade,
        aduboPotassioDose:
          parseFloat(aduboPotassioDose.replace(",", ".")) || null,
        aduboPotassioUnidade,
        aduboFosforoDose:
          parseFloat(aduboFosforoDose.replace(",", ".")) || null,
        aduboFosforoUnidade,
        defensivoUtilizado,
        doseDefensivo: parseFloat(doseDefensivo.replace(",", ".")) || null,
        unidadeDefensivo,
        custoSemente: parseFloat(custoSemente.replace(",", ".")) || null,
        custoFertilizante:
          parseFloat(custoFertilizante.replace(",", ".")) || null,
        custoDefensivo: parseFloat(custoDefensivo.replace(",", ".")) || null,
        custoCombustivel:
          parseFloat(custoCombustivel.replace(",", ".")) || null,
        custoOutros: parseFloat(custoOutros.replace(",", ".")) || null,
        statusPlantio,
        observacao,
      };

      if (isEditing) {
        await updatePlantio(plantio.id, payload, token);
        Alert.alert("Sucesso!", "Plantio atualizado!");
      } else {
        await createPlantio(payload, token);
        Alert.alert("Sucesso!", "Novo plantio cadastrado!");
      }
      navigation.navigate("ListPlantioScreen", { farmId, cultureType });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message?.[0] ||
        error.message ||
        "Não foi possível conectar ao servidor.";
      console.error(
        "Erro ao salvar plantio:",
        error.response?.data || error.message
      );
      Alert.alert("Erro ao Salvar", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAnaliseData = (data: any) => {
    setDadosAnaliseSolo(data);
    setAnaliseModalVisible(false);
    Alert.alert(
      "Análise Preenchida",
      "Os dados foram salvos. Salve o plantio para confirmar a associação."
    );
  };

  const handleDeletePlantio = () => {
    if (!plantio?.id) return;
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja deletar este plantio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              const token = await AsyncStorage.getItem("@TerraManager:token");
              if (!token) throw new Error("Sessão expirada.");
              await deletePlantioApi(plantio.id, token);
              Alert.alert("Sucesso!", "Plantio deletado.");
              navigation.navigate("ListPlantioScreen", { farmId, cultureType });
            } catch (error: any) {
              const errorMessage =
                error.response?.data?.message?.[0] ||
                error.message ||
                "Não foi possível deletar.";
              Alert.alert("Erro ao Deletar", errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Editar Plantio" : "Adicionar Plantio"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Análise de Solo (Opcional)</Text>
          <TouchableOpacity
            style={styles.analiseButton}
            onPress={() => setAnaliseModalVisible(true)}
          >
            <Ionicons name="flask-outline" size={22} color={colors.white} />
            <Text style={styles.analiseButtonText}>
              {dadosAnaliseSolo
                ? "Visualizar / Editar Análise"
                : "Adicionar Análise de Solo"}
            </Text>
          </TouchableOpacity>
          {dadosAnaliseSolo && (
            <Text style={styles.analiseStatusText}>
              {dadosAnaliseSolo.id
                ? `Análise ID ${dadosAnaliseSolo.id} associada.`
                : "Análise preenchida e pronta para salvar."}
            </Text>
          )}

          <Text style={styles.sectionTitle}>Dados Base do Plantio</Text>
          <FormRow>
            <FormColumn>
              <Text style={styles.inputLabel}>Data de Plantio *</Text>
              <TextInput
                style={styles.input}
                value={dataPlantio}
                onChangeText={(t) => setDataPlantio(maskDate(t))}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
              />
            </FormColumn>
            <FormColumn>
              <Text style={styles.inputLabel}>Data de Emergência</Text>
              <TextInput
                style={styles.input}
                value={dataEmergencia}
                onChangeText={(t) => setDataEmergencia(maskDate(t))}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
              />
            </FormColumn>
          </FormRow>
          <Text style={styles.sectionTitle}>Adubação e Defensivos</Text>
          <Text style={styles.inputLabel}>Dose de Nitrogênio (N)</Text>
          <FormRow>
            <FormColumn flex={2}>
              <TextInput
                style={styles.input}
                value={aduboNitrogenioDose}
                onChangeText={setAduboNitrogenioDose}
                keyboardType="numeric"
                placeholder="Valor"
              />
            </FormColumn>
            <FormColumn flex={1.5}>
              <CustomPicker
                selectedValue={aduboNitrogenioUnidade}
                onValueChange={setAduboNitrogenioUnidade}
                options={fertilizerAndDefensiveUnitOptions}
              />
            </FormColumn>
          </FormRow>
          <Text style={styles.inputLabel}>Dose de Potássio (K)</Text>
          <FormRow>
            <FormColumn flex={2}>
              <TextInput
                style={styles.input}
                value={aduboPotassioDose}
                onChangeText={setAduboPotassioDose}
                keyboardType="numeric"
                placeholder="Valor"
              />
            </FormColumn>
            <FormColumn flex={1.5}>
              <CustomPicker
                selectedValue={aduboPotassioUnidade}
                onValueChange={setAduboPotassioUnidade}
                options={fertilizerAndDefensiveUnitOptions}
              />
            </FormColumn>
          </FormRow>
          <Text style={styles.inputLabel}>Dose de Fósforo (P)</Text>
          <FormRow>
            <FormColumn flex={2}>
              <TextInput
                style={styles.input}
                value={aduboFosforoDose}
                onChangeText={setAduboFosforoDose}
                keyboardType="numeric"
                placeholder="Valor"
              />
            </FormColumn>
            <FormColumn flex={1.5}>
              <CustomPicker
                selectedValue={aduboFosforoUnidade}
                onValueChange={setAduboFosforoUnidade}
                options={fertilizerAndDefensiveUnitOptions}
              />
            </FormColumn>
          </FormRow>
          <Text style={styles.inputLabel}>Defensivo Utilizado</Text>
          <TextInput
            style={styles.input}
            value={defensivoUtilizado}
            onChangeText={setDefensivoUtilizado}
            placeholder="Nome do produto"
          />
          <Text style={styles.inputLabel}>Dose do Defensivo</Text>
          <FormRow>
            <FormColumn flex={2}>
              <TextInput
                style={styles.input}
                value={doseDefensivo}
                onChangeText={setDoseDefensivo}
                keyboardType="numeric"
                placeholder="Valor"
              />
            </FormColumn>
            <FormColumn flex={1.5}>
              <CustomPicker
                selectedValue={unidadeDefensivo}
                onValueChange={setUnidadeDefensivo}
                options={fertilizerAndDefensiveUnitOptions}
              />
            </FormColumn>
          </FormRow>
          <Text style={styles.sectionTitle}>Custos</Text>
          <FormRow>
            <FormColumn>
              <Text style={styles.inputLabel}>Custo da Semente</Text>
              <TextInput
                style={styles.input}
                value={custoSemente}
                onChangeText={setCustoSemente}
                keyboardType="numeric"
              />
            </FormColumn>
            <FormColumn>
              <Text style={styles.inputLabel}>Custo do Fertilizante</Text>
              <TextInput
                style={styles.input}
                value={custoFertilizante}
                onChangeText={setCustoFertilizante}
                keyboardType="numeric"
              />
            </FormColumn>
          </FormRow>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.inputLabel}>Status do Plantio</Text>
          <CustomPicker
            selectedValue={statusPlantio}
            onValueChange={setStatusPlantio}
            options={plantioStatusOptions}
          />
          <Text style={styles.inputLabel}>Observações Adicionais</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            value={observacao}
            onChangeText={setObservacao}
            multiline
            placeholder="Digite aqui..."
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          {isEditing && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeletePlantio}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>DELETAR</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSavePlantio}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {isEditing ? "SALVAR ALTERAÇÕES" : "CRIAR PLANTIO"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={isAnaliseModalVisible}
        animationType="slide"
        onRequestClose={() => setAnaliseModalVisible(false)}
      >
        <AnaliseSoloScreen
          farmId={farmId}
          onClose={() => setAnaliseModalVisible(false)}
          onSave={handleSaveAnaliseData}
        />
      </Modal>
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
    paddingTop: Platform.OS === "ios" ? 10 : 15,
    paddingBottom: 15,
    backgroundColor: colors.primary,
  },
  backButton: { padding: 5 },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  formContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
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
  row: {
    flexDirection: "row",
    marginHorizontal: -5,
    alignItems: "flex-end",
  },
  column: { flex: 1, marginHorizontal: 5 },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#1E322D",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  saveButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 54,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    marginBottom: 10,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  analiseButton: {
    backgroundColor: "#007BFF", // Um azul para diferenciar
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  analiseButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  analiseStatusText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});
