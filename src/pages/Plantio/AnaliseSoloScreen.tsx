// Em: src/pages/Plantio/AnaliseSoloScreen.tsx

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
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../components/Colors";

// Tipagem dos dados que o formulário manipula e retorna
type AnaliseSoloData = {
  /* ... adicione os campos da análise aqui ... */
};

interface Props {
  // Funções passadas pela tela "pai" (AddPlantioScreen)
  onClose: () => void;
  onSave: (data: AnaliseSoloData) => void;
  farmId: string; // ID da fazenda para associar a análise
}

const FormRow = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.row}>{children}</View>
);
const FormColumn = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.column}>{children}</View>
);

export default function AnaliseSoloScreen({ onClose, onSave, farmId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  // Estados para os campos da análise de solo, conforme a imagem do swagger
  const [ph, setPh] = useState("");
  const [areaTotal, setAreaTotal] = useState("");
  const [hAl, setHAl] = useState("");
  const [sb, setSb] = useState("");
  const [ctc, setCtc] = useState("");
  const [v, setV] = useState("");
  const [m, setM] = useState("");
  const [mo, setMo] = useState("");
  const [valorCultural, setValorCultural] = useState("");
  const [prnt, setPrnt] = useState("");
  const [n, setN] = useState("");
  const [p, setP] = useState("");
  const [k, setK] = useState("");

  const handleCreate = () => {
    if (!ph || !areaTotal) {
      Alert.alert("Campos Obrigatórios", "pH e Área Total são necessários.");
      return;
    }

    const analiseData = {
      ph: parseFloat(ph.replace(",", ".")) || 0,
      areaTotal: parseFloat(areaTotal.replace(",", ".")) || 0,
      hAl: parseFloat(hAl.replace(",", ".")) || 0,
      sb: parseFloat(sb.replace(",", ".")) || 0,
      ctc: parseFloat(ctc.replace(",", ".")) || 0,
      v: parseFloat(v.replace(",", ".")) || 0,
      m: parseFloat(m.replace(",", ".")) || 0,
      mo: parseFloat(mo.replace(",", ".")) || 0,
      valorCultural: parseFloat(valorCultural.replace(",", ".")) || 0,
      prnt: parseFloat(prnt.replace(",", ".")) || 0,
      n: parseFloat(n.replace(",", ".")) || 0,
      p: parseFloat(p.replace(",", ".")) || 0,
      k: parseFloat(k.replace(",", ".")) || 0,
      idFazenda: parseInt(farmId, 10),
    };

    // Em vez de chamar a API aqui, retornamos os dados para a tela de Plantio
    onSave(analiseData);
  };

  return (
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adicionar Análise de Solo</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close-circle" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Dados da Análise</Text>

        <FormRow>
          <FormColumn>
            <Text style={styles.inputLabel}>pH*</Text>
            <TextInput
              style={styles.input}
              value={ph}
              onChangeText={setPh}
              keyboardType="numeric"
            />
          </FormColumn>
          <FormColumn>
            <Text style={styles.inputLabel}>Área Total (ha)*</Text>
            <TextInput
              style={styles.input}
              value={areaTotal}
              onChangeText={setAreaTotal}
              keyboardType="numeric"
            />
          </FormColumn>
          <FormColumn>
            <Text style={styles.inputLabel}>H+Al (cmolc/dm³)</Text>
            <TextInput
              style={styles.input}
              value={hAl}
              onChangeText={setHAl}
              keyboardType="numeric"
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn>
            <Text style={styles.inputLabel}>SB (cmolc/dm³)</Text>
            <TextInput
              style={styles.input}
              value={sb}
              onChangeText={setSb}
              keyboardType="numeric"
            />
          </FormColumn>
          <FormColumn>
            <Text style={styles.inputLabel}>CTC (cmolc/dm³)</Text>
            <TextInput
              style={styles.input}
              value={ctc}
              onChangeText={setCtc}
              keyboardType="numeric"
            />
          </FormColumn>
          <FormColumn>
            <Text style={styles.inputLabel}>V (%)</Text>
            <TextInput
              style={styles.input}
              value={v}
              onChangeText={setV}
              keyboardType="numeric"
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn>
            <Text style={styles.inputLabel}>m (%)</Text>
            <TextInput
              style={styles.input}
              value={m}
              onChangeText={setM}
              keyboardType="numeric"
            />
          </FormColumn>
          <FormColumn>
            <Text style={styles.inputLabel}>MO (%)</Text>
            <TextInput
              style={styles.input}
              value={mo}
              onChangeText={setMo}
              keyboardType="numeric"
            />
          </FormColumn>
          <FormColumn>
            <Text style={styles.inputLabel}>Valor Cultural</Text>
            <TextInput
              style={styles.input}
              value={valorCultural}
              onChangeText={setValorCultural}
              keyboardType="numeric"
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn>
            <Text style={styles.inputLabel}>PRNT</Text>
            <TextInput
              style={styles.input}
              value={prnt}
              onChangeText={setPrnt}
              keyboardType="numeric"
            />
          </FormColumn>
          <FormColumn>
            <Text style={styles.inputLabel}>N</Text>
            <TextInput
              style={styles.input}
              value={n}
              onChangeText={setN}
              keyboardType="numeric"
            />
          </FormColumn>
          <FormColumn>
            <Text style={styles.inputLabel}>P</Text>
            <TextInput
              style={styles.input}
              value={p}
              onChangeText={setP}
              keyboardType="numeric"
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn>
            <Text style={styles.inputLabel}>K</Text>
            <TextInput
              style={styles.input}
              value={k}
              onChangeText={setK}
              keyboardType="numeric"
            />
          </FormColumn>
        </FormRow>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>CRIAR ANÁLISE</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#1E322D" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 30,
    paddingBottom: 15,
    backgroundColor: colors.primary,
  },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  formContent: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    paddingBottom: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
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
  row: { flexDirection: "row", marginHorizontal: -5 },
  column: { flex: 1, marginHorizontal: 5 },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
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
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
});
