// src/pages/Talhoes/AddTalhaoScreen.tsx
import React, { useState, useEffect } from "react";
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

import { RootStackParamList } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { createTalhao, updateTalhao } from "../../services/api";
import { localTalhoes, pendingQueue } from "../../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "AddTalhaoScreen">;

export default function AddTalhaoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { fazendaId, talhao } = route.params;
  const { isOnline } = useNetworkStatus();

  const isEditing = !!talhao;

  const [nome, setNome] = useState(talhao?.nome || "");
  const [areaHa, setAreaHa] = useState(talhao?.areaHa?.toString() || "");
  const [observacao, setObservacao] = useState(talhao?.observacao || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!nome.trim() || !areaHa.trim()) {
      Alert.alert("Atenção", "Nome e área (ha) são obrigatórios.");
      return;
    }

    const parsedArea = parseFloat(areaHa.replace(",", "."));
    if (isNaN(parsedArea) || parsedArea <= 0) {
      Alert.alert("Atenção", "Informe uma área válida em hectares.");
      return;
    }

    setIsLoading(true);

    const payload = {
      idFazenda: fazendaId,
      nome: nome.trim(),
      areaHa: parsedArea,
      observacao: observacao.trim() || undefined,
    };

    try {
      if (isOnline) {
        if (isEditing && talhao) {
          const updated = await updateTalhao(talhao.id, payload);
          await localTalhoes.upsert({ ...updated, ativo: true });
        } else {
          const created = await createTalhao(payload);
          await localTalhoes.upsert({ ...created, ativo: true });
        }
      } else {
        // Modo offline: salva localmente com ID temporário e enfileira a operação
        if (isEditing && talhao) {
          const localTalhao = { ...talhao, ...payload };
          await localTalhoes.upsert(localTalhao);
          await pendingQueue.add({
            endpoint: `/talhao/${talhao.id}`,
            method: "PUT",
            body: payload,
            entityType: "talhao",
          });
        } else {
          const tempId = -(Date.now());
          const localTalhao = { id: tempId, ...payload, ativo: true };
          await localTalhoes.upsert(localTalhao);
          await pendingQueue.add({
            endpoint: "/talhao",
            method: "POST",
            body: payload,
            entityType: "talhao",
            localId: String(tempId),
          });
        }
        Alert.alert(
          "Salvo Offline",
          "O talhão foi salvo localmente e será sincronizado quando a conexão voltar."
        );
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Não foi possível salvar o talhão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Editar Talhão" : "Novo Talhão"}
        </Text>
        {!isOnline && (
          <View style={styles.offlineBadge}>
            <Ionicons name="cloud-offline-outline" size={14} color="#FCD34D" />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nome do Talhão *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Talhão A, Fundo Norte..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Área (hectares) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 25.5"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={areaHa}
          onChangeText={setAreaHa}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Informações adicionais sobre o talhão..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={observacao}
          onChangeText={setObservacao}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.saveButton, isLoading && { opacity: 0.7 }]}
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
              <Text style={styles.saveButtonText}>
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
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? 40 : 15,
    backgroundColor: colors.primary,
  },
  backButton: { padding: 4, marginRight: 12 },
  headerTitle: { flex: 1, color: colors.white, fontSize: 20, fontWeight: "bold" },
  offlineBadge: { padding: 4 },
  form: { padding: 20, paddingBottom: 40 },
  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 16,
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
  textArea: { minHeight: 100, textAlignVertical: "top" },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 32,
  },
  saveButtonText: { color: colors.white, fontSize: 17, fontWeight: "700" },
});
