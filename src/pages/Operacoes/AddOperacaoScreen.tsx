// src/pages/Operacoes/AddOperacaoScreen.tsx
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

import { RootStackParamList, TipoEtapaOperacao } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { createOperacaoPlantio, updateOperacaoPlantio } from "../../services/api";
import { localOperacoes, pendingQueue } from "../../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "AddOperacaoScreen">;

const ETAPA_OPTIONS: { label: string; value: TipoEtapaOperacao }[] = [
  { label: "Preparo do Solo", value: "PREPARO_SOLO" },
  { label: "Semeadura", value: "SEMEADURA" },
  { label: "Aplicação de Defensivo", value: "APLICACAO_DEFENSIVO" },
  { label: "Aplicação de Fertilizante", value: "APLICACAO_FERTILIZANTE" },
  { label: "Irrigação", value: "IRRIGACAO" },
  { label: "Colheita", value: "COLHEITA" },
  { label: "Outros", value: "OUTROS" },
];

export default function AddOperacaoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { plantioId, operacao, areaMaxima } = route.params;
  const { isOnline } = useNetworkStatus();

  const isEditing = !!operacao;

  const [tipoEtapa, setTipoEtapa] = useState<TipoEtapaOperacao>(
    operacao?.tipoEtapa || "PREPARO_SOLO"
  );
  const [dataInicio, setDataInicio] = useState(
    operacao?.dataInicio ? operacao.dataInicio.split("T")[0] : ""
  );
  const [dataFim, setDataFim] = useState(
    operacao?.dataFim ? operacao.dataFim.split("T")[0] : ""
  );
  const [areaHa, setAreaHa] = useState(operacao?.areaHa?.toString() || "");
  const [custoTotal, setCustoTotal] = useState(
    operacao?.custoTotal?.toString() || ""
  );
  const [observacao, setObservacao] = useState(operacao?.observacao || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!dataInicio.trim() || !areaHa.trim()) {
      Alert.alert("Atenção", "Data de início e área são obrigatórios.");
      return;
    }

    const parsedArea = parseFloat(areaHa.replace(",", "."));
    if (isNaN(parsedArea) || parsedArea <= 0) {
      Alert.alert("Atenção", "Informe uma área válida.");
      return;
    }
    if (parsedArea > areaMaxima) {
      Alert.alert("Atenção", `A área não pode ser maior que a área plantada (${areaMaxima} ha).`);
      return;
    }

    const payload: any = {
      idPlantio: plantioId,
      tipoEtapa,
      dataInicio,
      areaHa: parsedArea,
    };

    if (dataFim.trim()) payload.dataFim = dataFim;
    if (custoTotal.trim()) {
      payload.custoTotal = parseFloat(custoTotal.replace(",", "."));
    }
    if (observacao.trim()) payload.observacao = observacao.trim();

    setIsLoading(true);
    try {
      if (isOnline) {
        if (isEditing && operacao) {
          const updated = await updateOperacaoPlantio(operacao.id, payload);
          await localOperacoes.upsert({ ...updated, ativo: true });
        } else {
          const created = await createOperacaoPlantio(payload);
          await localOperacoes.upsert(created);
        }
      } else {
        if (isEditing && operacao) {
          await localOperacoes.upsert({ ...operacao, ...payload });
          await pendingQueue.add({
            endpoint: `/operacao-plantio/${operacao.id}`,
            method: "PUT",
            body: payload,
            entityType: "operacao",
          });
        } else {
          const tempId = -(Date.now());
          await localOperacoes.upsert({
            id: tempId,
            ...payload,
            ativo: true,
          });
          await pendingQueue.add({
            endpoint: "/operacao-plantio",
            method: "POST",
            body: payload,
            entityType: "operacao",
            localId: String(tempId),
          });
        }
        Alert.alert("Salvo Offline", "Operação salva localmente. Será sincronizada quando a conexão voltar.");
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Não foi possível salvar a operação.");
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
        <Text style={styles.headerTitle}>
          {isEditing ? "Editar Operação" : "Nova Operação"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Tipo de Etapa *</Text>
        <CustomPicker
          selectedValue={tipoEtapa}
          onValueChange={(v) => setTipoEtapa(v as TipoEtapaOperacao)}
          options={ETAPA_OPTIONS}
        />

        <Text style={styles.label}>Data de Início * (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2025-03-15"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={dataInicio}
          onChangeText={setDataInicio}
        />

        <Text style={styles.label}>Data de Fim (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Opcional"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={dataFim}
          onChangeText={setDataFim}
        />

        <Text style={styles.label}>Área (ha) * — Máximo: {areaMaxima} ha</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 10.0"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={areaHa}
          onChangeText={setAreaHa}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Custo Total (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 1500.00"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={custoTotal}
          onChangeText={setCustoTotal}
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
