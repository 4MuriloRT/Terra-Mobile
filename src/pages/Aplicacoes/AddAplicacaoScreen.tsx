// src/pages/Aplicacoes/AddAplicacaoScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CustomPicker } from "../../components/CustomPicker";

import { RootStackParamList, TipoAplicacao, UnidadeDose } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { createAplicacao } from "../../services/api";
import { localAplicacoes, pendingQueue } from "../../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "AddAplicacaoScreen">;

const TIPO_OPTIONS = [
  { label: "Defensivo", value: "DEFENSIVO" },
  { label: "Fertilizante", value: "FERTILIZANTE" },
];

const UNIDADE_OPTIONS: { label: string; value: UnidadeDose }[] = [
  { label: "Kg/ha", value: "KG_HA" },
  { label: "g/ha", value: "G_HA" },
  { label: "mL/ha", value: "ML_HA" },
  { label: "L/ha", value: "L_HA" },
  { label: "ton/ha", value: "TON_HA" },
];

export default function AddAplicacaoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { operacaoId, areaHa } = route.params;
  const { isOnline } = useNetworkStatus();

  const [tipo, setTipo] = useState<TipoAplicacao>("DEFENSIVO");
  const [nomeProduto, setNomeProduto] = useState("");
  const [dosePorHa, setDosePorHa] = useState("");
  const [unidadeDose, setUnidadeDose] = useState<UnidadeDose>("KG_HA");
  const [custoAplicacao, setCustoAplicacao] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!dosePorHa.trim() || !dataAplicacao.trim()) {
      Alert.alert("Atenção", "Dose por ha e data de aplicação são obrigatórios.");
      return;
    }

    const parsedDose = parseFloat(dosePorHa.replace(",", "."));
    if (isNaN(parsedDose) || parsedDose <= 0) {
      Alert.alert("Atenção", "Informe uma dose válida.");
      return;
    }

    const payload: any = {
      idOperacaoPlantio: operacaoId,
      tipo,
      dosePorHa: parsedDose,
      unidadeDose,
      dataAplicacao,
    };

    if (nomeProduto.trim()) payload.nomeProduto = nomeProduto.trim();
    if (custoAplicacao.trim()) {
      payload.custoAplicacao = parseFloat(custoAplicacao.replace(",", "."));
    }
    if (observacao.trim()) payload.observacao = observacao.trim();

    setIsLoading(true);
    try {
      if (isOnline) {
        const created = await createAplicacao(payload);
        await localAplicacoes.upsert(created);
      } else {
        const tempId = -(Date.now());
        await localAplicacoes.upsert({ id: tempId, ...payload, ativo: true });
        await pendingQueue.add({
          endpoint: "/aplicacao-plantio",
          method: "POST",
          body: payload,
          entityType: "aplicacao",
          localId: String(tempId),
        });
        Alert.alert(
          "Salvo Offline",
          "Aplicação salva localmente. Será sincronizada quando a conexão voltar."
        );
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Não foi possível salvar a aplicação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Aplicação</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.info}>Área da operação: {areaHa} ha</Text>

        <Text style={styles.label}>Tipo *</Text>
        <CustomPicker
          selectedValue={tipo}
          onValueChange={(v) => setTipo(v as TipoAplicacao)}
          options={TIPO_OPTIONS}
        />

        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Roundup, Ureia..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={nomeProduto}
          onChangeText={setNomeProduto}
        />

        <Text style={styles.label}>Dose por ha *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2.5"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={dosePorHa}
          onChangeText={setDosePorHa}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Unidade de Dose *</Text>
        <CustomPicker
          selectedValue={unidadeDose}
          onValueChange={(v) => setUnidadeDose(v as UnidadeDose)}
          options={UNIDADE_OPTIONS}
        />

        <Text style={styles.label}>Data de Aplicação * (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2025-04-01"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={dataAplicacao}
          onChangeText={setDataAplicacao}
        />

        <Text style={styles.label}>Custo da Aplicação (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 800.00"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={custoAplicacao}
          onChangeText={setCustoAplicacao}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Informações adicionais..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={observacao}
          onChangeText={setObservacao}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.saveBtn, isLoading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons
                name={isOnline ? "cloud-upload-outline" : "save-outline"}
                size={20}
                color="#fff"
              />
              <Text style={styles.saveBtnText}>
                {isOnline ? "Salvar" : "Salvar Offline"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E322D" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 40 : 15,
    paddingBottom: 12,
    backgroundColor: colors.primary,
  },
  backBtn: { padding: 4, marginRight: 12 },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  form: { padding: 20, paddingBottom: 40 },
  info: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    backgroundColor: "rgba(212,163,115,0.1)",
    padding: 10,
    borderRadius: 8,
  },
  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 32,
  },
  saveBtnText: { color: colors.white, fontSize: 17, fontWeight: "700" },
});
