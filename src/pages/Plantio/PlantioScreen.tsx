import React, { useState, useCallback, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, SafeAreaView, Platform, ActivityIndicator, Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList, Farm, Plantio } from "../../screens/Types";
import { colors } from "../../components/Colors";
import { CustomPicker } from "../../components/CustomPicker";
import { fetchFarms, fetchPlantiosByFazenda } from "../../services/api";

type PlantioScreenNavigationProp = StackNavigationProp<RootStackParamList, "PlantioScreen">;

export default function PlantioScreen() {
  const navigation = useNavigation<PlantioScreenNavigationProp>();
  
  // Estados da tela
  const [fazendas, setFazendas] = useState<Farm[]>([]);
  const [selectedFazenda, setSelectedFazenda] = useState<string>('');
  const [plantios, setPlantios] = useState<Plantio[]>([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const [isLoadingPlantios, setIsLoadingPlantios] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Carrega a lista de fazendas para o seletor
  const loadFarms = async () => {
    try {
      setIsLoadingFarms(true);
      const token = await AsyncStorage.getItem('@TerraManager:token');
      if (!token) throw new Error('Token não encontrado.');
      const response = await fetchFarms(token);
      setFazendas(response.data || []);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoadingFarms(false);
    }
  };

  // Carrega os plantios quando uma fazenda é selecionada
  useEffect(() => {
    const loadPlantios = async () => {
      if (!selectedFazenda) {
        setPlantios([]);
        return;
      }
      try {
        setIsLoadingPlantios(true);
        const token = await AsyncStorage.getItem('@TerraManager:token');
        if (!token) throw new Error('Token não encontrado.');
        const response = await fetchPlantiosByFazenda(selectedFazenda, token);
        setPlantios(response.data || []);
      } catch (error: any) {
        Alert.alert('Erro', error.message);
        setPlantios([]);
      } finally {
        setIsLoadingPlantios(false);
      }
    };

    loadPlantios();
  }, [selectedFazenda]);

  // Recarrega as fazendas quando a tela recebe foco
  useFocusEffect(useCallback(() => { loadFarms(); }, []));

  const handleOpenModal = () => setIsModalVisible(true);

  const renderItem = ({ item }: { item: Plantio }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cellText, { flex: 2 }]}>{item.cultivar.nomePopular}</Text>
      <Text style={[styles.cellText, { flex: 2 }]}>{new Date(item.dataPlantio).toLocaleDateString('pt-BR')}</Text>
      <Text style={[styles.cellText, { flex: 1.5 }]}>{item.areaPlantada} ha</Text>
      <View style={styles.actionsCell}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="eye-outline" size={22} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Plantio</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Novo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <CustomPicker
          selectedValue={selectedFazenda}
          onValueChange={(value) => setSelectedFazenda(value)}
          options={fazendas.map(f => ({ label: f.nome, value: f.id }))}
          placeholder="Selecione uma fazenda para ver os plantios..."
        />

        {isLoadingPlantios ? (
          <ActivityIndicator size="large" color={colors.white} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={plantios}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
              plantios.length > 0 ? (
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerText, { flex: 2 }]}>Cultivar</Text>
                  <Text style={[styles.headerText, { flex: 2 }]}>Data Plantio</Text>
                  <Text style={[styles.headerText, { flex: 1.5 }]}>Área</Text>
                  <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Ações</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="leaf-outline" size={60} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyText}>
                  {selectedFazenda ? 'Nenhum plantio encontrado.' : 'Selecione uma fazenda.'}
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingTop: 10, flexGrow: 1 }}
          />
        )}
      </View>
      
      {/* O modal de "Novo Plantio" continua aqui, mas agora ele é aberto por um estado local */}
      {/* ... (código do seu modal de novo plantio) ... */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E322D' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? 40 : 15,
  },
  headerTitle: { color: colors.white, fontSize: 22, fontWeight: 'bold' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: { color: colors.white, marginLeft: 5, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  headerText: { color: colors.white, fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  cellText: { color: colors.white, fontSize: 14 },
  actionsCell: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 15 },
  actionButton: { padding: 5 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: 'white', textAlign: 'center', marginTop: 15, fontSize: 18, fontWeight: 'bold' },
});
