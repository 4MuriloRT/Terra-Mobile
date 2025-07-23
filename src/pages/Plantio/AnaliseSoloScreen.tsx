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
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../components/Colors";

// Tipagem para os dados da análise
type AnaliseSoloData = {
  id?: number;
  ph: number;
  areaTotal: number;
  hAi: number; // Corrigido de hAl para hAi
  sb: number;
  ctc: number;
  v: number;
  m: number;
  mo: number;
  valorCultural: number;
  prnt: number;
  n: number;
  p: number;
  k: number;
};

// Props da tela
interface Props {
  farmId: string;
  initialData?: AnaliseSoloData | null;
  onClose: () => void;
  onSave: (data: AnaliseSoloData) => void;
  onDelete: (id: number) => void;
}

const FormRow = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.row}>{children}</View>
);
const FormColumn = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.column}>{children}</View>
);

export default function AnaliseSoloScreen({
  farmId,
  initialData,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!initialData?.id;

  // Estados para os campos do formulário
  const [ph, setPh] = useState("");
  const [areaTotal, setAreaTotal] = useState("");
  const [hAi, setHAi] = useState(""); // Estado renomeado
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

  useEffect(() => {
    if (initialData) {
      setPh(String(initialData.ph ?? ""));
      setAreaTotal(String(initialData.areaTotal ?? ""));
      setHAi(String(initialData.hAi ?? "")); // Campo atualizado
      setSb(String(initialData.sb ?? ""));
      setCtc(String(initialData.ctc ?? ""));
      setV(String(initialData.v ?? ""));
      setM(String(initialData.m ?? ""));
      setMo(String(initialData.mo ?? ""));
      setValorCultural(String(initialData.valorCultural ?? ""));
      setPrnt(String(initialData.prnt ?? ""));
      setN(String(initialData.n ?? ""));
      setP(String(initialData.p ?? ""));
      setK(String(initialData.k ?? ""));
    }
  }, [initialData]);

  const handleSave = () => {
    if (!ph || !areaTotal) {
      Alert.alert("Campos Obrigatórios", "pH e Área Total são necessários.");
      return;
    }

    const analiseData = {
      id: initialData?.id,
      ph: parseFloat(ph.replace(",", ".")) || 0,
      areaTotal: parseFloat(areaTotal.replace(",", ".")) || 0,
      hAi: parseFloat(hAi.replace(",", ".")) || 0, // Campo atualizado
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
    };
    onSave(analiseData as AnaliseSoloData);
  };

  const handleDelete = () => {
    if (!initialData?.id) return;
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja realmente deletar esta Análise de Solo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => onDelete(initialData.id!),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isEditing ? "Editar" : "Adicionar"} Análise de Solo
        </Text>
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
              value={hAi}
              onChangeText={setHAi}
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
          <FormColumn>
            <View />
          </FormColumn>
          <FormColumn>
            <View />
          </FormColumn>
        </FormRow>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {isEditing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>DELETAR ANÁLISE</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? "SALVAR ALTERAÇÕES" : "CRIAR ANÁLISE"}
            </Text>
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
});
