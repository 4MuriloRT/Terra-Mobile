import React, { useState, useEffect } from "react"; // ✅ CORREÇÃO APLICADA AQUI
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList, Farm } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { createFarm } from "../../services/api";

type AddFarmScreenRouteProp = RouteProp<RootStackParamList, "AddFarmScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList, "AddFarmScreen">;

export default function AddFarmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddFarmScreenRouteProp>();
  const farmToEdit = route.params?.farm;
  const isEditMode = !!farmToEdit;

  // Estados para o formulário
  const [nome, setNome] = useState(farmToEdit?.nome || "");
  const [latitude, setLatitude] = useState(
    farmToEdit?.latitude.toString() || ""
  );
  const [longitude, setLongitude] = useState(
    farmToEdit?.longitude.toString() || ""
  );
  const [municipio, setMunicipio] = useState(farmToEdit?.municipio || "");
  const [uf, setUf] = useState(farmToEdit?.uf || "");
  const [cnpj, setCnpj] = useState(farmToEdit?.cnpj || "");
  const [areaTotal, setAreaTotal] = useState(
    farmToEdit?.areaTotal?.toString() || ""
  );
  const [soloPredominante, setSoloPredominante] = useState(
    farmToEdit?.soloPredominante || ""
  );
  const [cultivoPredominante, setCultivoPredominante] = useState(
    farmToEdit?.cultivoPredominante || ""
  );

  useEffect(() => {
    // Se estiver no modo de edição, popula os campos
    if (isEditMode && farmToEdit) {
      setNome(farmToEdit.nome);
      setLatitude(farmToEdit.latitude.toString());
      setLongitude(farmToEdit.longitude.toString());
      setMunicipio(farmToEdit.municipio);
      setUf(farmToEdit.uf);
      setCnpj(farmToEdit.cnpj || "");
      setAreaTotal(farmToEdit.areaTotal?.toString() || "");
      setSoloPredominante(farmToEdit.soloPredominante || "");
      setCultivoPredominante(farmToEdit.cultivoPredominante || "");
    }
  }, [isEditMode, farmToEdit]);

  const handleCreateOrUpdate = async () => {
    if (!nome || !latitude || !longitude || !municipio || !uf) {
      Alert.alert(
        "Campos Obrigatórios",
        "Por favor, preencha todos os campos com *."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("@TerraManager:token");
      if (!token) {
        Alert.alert(
          "Erro de Autenticação",
          "Sessão expirada. Faça login novamente."
        );
        return;
      }

      const farmData = {
        nome,
        latitude: parseFloat(latitude.replace(",", ".")),
        longitude: parseFloat(longitude.replace(",", ".")),
        municipio,
        uf,
        ...(cnpj && { cnpj }),
        ...(areaTotal && {
          areaTotal: parseFloat(areaTotal.replace(",", ".")),
        }),
        ...(soloPredominante && { soloPredominante }),
        ...(cultivoPredominante && { cultivoPredominante }),
      };

      if (isEditMode) {
        // Lógica para ATUALIZAR uma fazenda (será implementada no futuro)
        Alert.alert("Info", "Funcionalidade de editar em desenvolvimento.");
      } else {
        // Lógica para CRIAR uma nova fazenda
        await createFarm(farmData, token);
        Alert.alert("Sucesso!", "Fazenda cadastrada com sucesso.");
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert("Erro ao Salvar", error.message);
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
            {isEditMode ? "Detalhes da Fazenda" : "Adicionar Fazenda"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.inputLabel}>Nome da Fazenda *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Fazenda Água Limpa"
          />

          <Text style={styles.inputLabel}>Município *</Text>
          <TextInput
            style={styles.input}
            value={municipio}
            onChangeText={setMunicipio}
          />

          <Text style={styles.inputLabel}>UF *</Text>
          <TextInput
            style={styles.input}
            value={uf}
            onChangeText={setUf}
            maxLength={2}
          />

          <Text style={styles.inputLabel}>Latitude *</Text>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Longitude *</Text>
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateOrUpdate}
          >
            <Text style={styles.createButtonText}>
              {isEditMode ? "SALVAR ALTERAÇÕES" : "CADASTRAR"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === "ios" ? 50 : 40,
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
  formContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
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
    fontSize: 16,
    color: colors.textPrimary,
  },
  createButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
