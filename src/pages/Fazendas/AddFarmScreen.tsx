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
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Farm } from "../../screens/Types";
import { colors } from "../../components/Colors";

type NavigationProp = StackNavigationProp<RootStackParamList, "AddFarmScreen">;
type AddFarmScreenRouteProp = RouteProp<RootStackParamList, 'AddFarmScreen'>;

export default function AddFarmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddFarmScreenRouteProp>();

  const farmToEdit = route.params?.farm;
  const isEditMode = !!farmToEdit;

  const [isEditable, setIsEditable] = useState(!isEditMode);

  // Estados são strings para facilitar a digitação nos TextInputs
  const [nome, setNome] = useState(farmToEdit?.nome || "");
  const [cnpj, setCnpj] = useState(farmToEdit?.cnpj || "");
  const [latitude, setLatitude] = useState(farmToEdit?.latitude.toString() || "");
  const [longitude, setLongitude] = useState(farmToEdit?.longitude.toString() || "");
  const [areaTotal, setAreaTotal] = useState(farmToEdit?.areaTotal.toString() || "");
  const [soloPredominante, setSoloPredominante] = useState(farmToEdit?.soloPredominante || "");
  const [cultivoPredominante, setCultivoPredominante] = useState(farmToEdit?.cultivoPredominante || "");
  const [municipio, setMunicipio] = useState(farmToEdit?.municipio || "");
  const [uf, setUf] = useState(farmToEdit?.uf || "");
  // Estado para o booleano 'ativo'. O padrão para novas fazendas é 'true'.
  const [ativo, setAtivo] = useState(farmToEdit?.ativo ?? true);

  const getPayload = (): Omit<Farm, 'id'> => {
    return {
      nome,
      cnpj,
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
      areaTotal: parseFloat(areaTotal) || 0,
      soloPredominante,
      cultivoPredominante,
      municipio,
      uf,
      ativo,
    };
  };

  const handleCreateFarm = () => {
    const payload = getPayload();
    console.log("DADOS PARA CRIAR:", payload);
    Alert.alert("Sucesso!", "Fazenda cadastrada com sucesso!");
    navigation.goBack();
  };

  const handleSaveChanges = () => {
    const payload = getPayload();
    console.log("DADOS PARA SALVAR:", payload);
    Alert.alert("Sucesso!", "Alterações salvas.");
    setIsEditable(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a fazenda "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => {
            console.log("Fazenda excluída");
            navigation.goBack();
        }},
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Detalhes da Fazenda' : 'Adicionar Nova Fazenda'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} editable={isEditable} />

          <Text style={styles.inputLabel}>CNPJ</Text>
          <TextInput style={styles.input} value={cnpj} onChangeText={setCnpj} editable={isEditable} keyboardType="numeric" />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Latitude</Text>
              <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} editable={isEditable} keyboardType="numeric" />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Longitude</Text>
              <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} editable={isEditable} keyboardType="numeric" />
            </View>
          </View>
          
          <Text style={styles.inputLabel}>Área Total (ha)</Text>
          <TextInput style={styles.input} value={areaTotal} onChangeText={setAreaTotal} editable={isEditable} keyboardType="numeric" />

          <View style={styles.row}>
             <View style={styles.column}>
                <Text style={styles.inputLabel}>Solo Predominante</Text>
                <TextInput style={styles.input} value={soloPredominante} onChangeText={setSoloPredominante} editable={isEditable} />
              </View>
              <View style={styles.column}>
                <Text style={styles.inputLabel}>Cultivo Predominante</Text>
                <TextInput style={styles.input} value={cultivoPredominante} onChangeText={setCultivoPredominante} editable={isEditable} />
              </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Município</Text>
              <TextInput style={styles.input} value={municipio} onChangeText={setMunicipio} editable={isEditable} />
            </View>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>UF</Text>
              <TextInput style={styles.input} value={uf} onChangeText={setUf} maxLength={2} autoCapitalize="characters" editable={isEditable} />
            </View>
          </View>

          {/* NOVO CAMPO PARA 'ATIVO' */}
          <View style={styles.switchRow}>
            <Text style={styles.inputLabel}>Ativo</Text>
            <Switch
                trackColor={{ false: "#767577", true: colors.secondary }}
                thumbColor={ativo ? colors.white : "#f4f3f4"}
                onValueChange={setAtivo}
                value={ativo}
                disabled={!isEditable}
            />
          </View>
          
          {isEditMode ? (
            <View style={styles.editButtonsContainer}>
                <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#3498db'}]}>
                    <Text style={styles.actionButtonText}>PRODUTOS</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#e74c3c'}]} onPress={handleDelete}>
                    <Text style={styles.actionButtonText}>EXCLUIR</Text>
                </TouchableOpacity>
                {isEditable ? (
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.secondary}]} onPress={handleSaveChanges}>
                        <Text style={styles.actionButtonText}>SALVAR</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.accent}]} onPress={() => setIsEditable(true)}>
                        <Text style={styles.actionButtonText}>EDITAR</Text>
                    </TouchableOpacity>
                )}
            </View>
          ) : (
            <TouchableOpacity style={styles.createButton} onPress={handleCreateFarm}>
              <Text style={styles.createButtonText}>CRIAR</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: { // Novo estilo para o KeyboardAvoidingView
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary, 
    paddingBottom: 10,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 15,
    paddingTop: 50, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  formContent: {
    padding: 20,
    backgroundColor: "#1E322D", 
    flexGrow: 1, 
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
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary, 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10, 
  },
  column: {
    flex: 1,
  },
  createButton: {
    backgroundColor: "#4B7940", 
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  }
});
