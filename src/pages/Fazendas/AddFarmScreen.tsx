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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList, Farm } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { createFarm, updateFarm, deleteFarm } from "../../services/api";

type AddFarmScreenRouteProp = RouteProp<RootStackParamList, "AddFarmScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList, "AddFarmScreen">;

export default function AddFarmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddFarmScreenRouteProp>();
  const farmToEdit = route.params?.farm;
  const isEditMode = !!farmToEdit;

  // --- Estados para o formulário ---
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [areaTotal, setAreaTotal] = useState("");
  const [soloPredominante, setSoloPredominante] = useState("");
  const [cultivoPredominante, setCultivoPredominante] = useState("");

  useEffect(() => {
    // Popula os campos APENAS se estiver em modo de edição
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
        cnpj,
        areaTotal: areaTotal
          ? parseFloat(areaTotal.replace(",", "."))
          : undefined,
        soloPredominante,
        cultivoPredominante,
        ativo: true,
      };

      if (isEditMode && farmToEdit) {
        await updateFarm(Number(farmToEdit.id), farmData, token);
        Alert.alert("Sucesso!", "Fazenda atualizada com sucesso.");
      } else {
        await createFarm(farmData, token);
        Alert.alert("Sucesso!", "Fazenda cadastrada com sucesso.");
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Erro ao Salvar",
        error.message || "Não foi possível conectar ao servidor."
      );
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !farmToEdit) return;
    console.log("Tentando deletar a fazenda com ID:", farmToEdit.id); // Adicione esta linha
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja deletar a fazenda "${farmToEdit.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("@TerraManager:token");
              if (!token) {
                Alert.alert("Erro de Autenticação", "Sessão expirada.");
                return;
              }
              await deleteFarm(Number(farmToEdit.id), token);
              Alert.alert("Sucesso!", "Fazenda deletada com sucesso.");
              navigation.goBack();
            } catch (error: any) {
              Alert.alert(
                "Erro ao Deletar",
                error.message || "Não foi possível realizar a operação."
              );
            }
          },
        },
      ]
    );
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
            placeholder="Ex: Fazenda Santa Maria"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Município *</Text>
          <TextInput
            style={styles.input}
            value={municipio}
            onChangeText={setMunicipio}
            placeholder="Ex: Unaí"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>UF *</Text>
          <TextInput
            style={styles.input}
            value={uf}
            onChangeText={setUf}
            maxLength={2}
            autoCapitalize="characters"
            placeholder="Ex: MG"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Latitude *</Text>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
            placeholder="Ex: -16.358"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Longitude *</Text>
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
            placeholder="Ex: -46.911"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Área Total (ha)</Text>
          <TextInput
            style={styles.input}
            value={areaTotal}
            onChangeText={setAreaTotal}
            keyboardType="numeric"
            placeholder="Ex: 250.5"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>CNPJ</Text>
          <TextInput
            style={styles.input}
            value={cnpj}
            onChangeText={setCnpj}
            keyboardType="numeric"
            placeholder="00.000.000/0001-00"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Solo Predominante</Text>
          <TextInput
            style={styles.input}
            value={soloPredominante}
            onChangeText={setSoloPredominante}
            placeholder="Ex: Latossolo Vermelho"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Cultivo Predominante</Text>
          <TextInput
            style={styles.input}
            value={cultivoPredominante}
            onChangeText={setCultivoPredominante}
            placeholder="Ex: Soja"
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCreateOrUpdate}
          >
            <Text style={styles.actionButtonText}>
              {isEditMode ? "SALVAR ALTERAÇÕES" : "CADASTRAR"}
            </Text>
          </TouchableOpacity>

          {isEditMode && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.actionButtonText}>DELETAR FAZENDA</Text>
            </TouchableOpacity>
          )}
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
    paddingBottom: 40,
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
  actionButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: colors.danger,
    marginTop: 15,
  },
});
