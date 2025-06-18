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
import { RootStackParamList } from "../../screens/Types";
import { colors } from "../../components/Colors";

type NavigationProp = StackNavigationProp<RootStackParamList, "AddFarmScreen">;

export default function AddFarmScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [areaTotal, setAreaTotal] = useState("");
  const [soloPredominante, setSoloPredominante] = useState("");
  const [cultivoPredominante, setCultivoPredominante] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("");

  const handleCreateFarm = () => {
    if (
      !nome ||
      !cnpj ||
      !latitude ||
      !longitude ||
      !areaTotal ||
      !soloPredominante ||
      !cultivoPredominante ||
      !municipio ||
      !uf
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    Alert.alert("Sucesso!", "Fazenda cadastrada com sucesso!");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView // Adicione KeyboardAvoidingView aqui
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' para iOS, 'height' para Android
    >
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicione os dados da fazenda</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled" // Adicione esta linha
        showsVerticalScrollIndicator={false} // Opcional: esconde o indicador de rolagem
      >
        <Text style={styles.inputLabel}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da Fazenda"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.inputLabel}>CNPJ</Text>
        <TextInput
          style={styles.input}
          placeholder="00.000.000/0000-00"
          placeholderTextColor="#999"
          value={cnpj}
          onChangeText={setCnpj}
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Latitude</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#999"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Longitude</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#999"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Área Total</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#999"
          value={areaTotal}
          onChangeText={setAreaTotal}
          keyboardType="numeric"
        />

        <View style={styles.column}>
          <Text style={styles.inputLabel}>Solo Predominante</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Argiloso"
            placeholderTextColor="#999"
            value={soloPredominante}
            onChangeText={setSoloPredominante}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>Cultivo Predominante</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Soja"
            placeholderTextColor="#999"
            value={cultivoPredominante}
            onChangeText={setCultivoPredominante}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>Município</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Arinos"
              placeholderTextColor="#999"
              value={municipio}
              onChangeText={setMunicipio}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.inputLabel}>UF</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: MG"
              placeholderTextColor="#999"
              value={uf}
              onChangeText={setUf}
              maxLength={2} 
              autoCapitalize="characters" 
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateFarm}
        >
          <Text style={styles.createButtonText}>CRIAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: { // Novo estilo para o KeyboardAvoidingView
    flex: 1,
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
});
