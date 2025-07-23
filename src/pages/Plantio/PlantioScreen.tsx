// src/pages/Plantio/PlantioScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Alert, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Farm } from '../../screens/Types';
import { colors } from '../../components/Colors';
import { fetchFarms } from '../../services/api';
import { CustomPicker } from '../../components/CustomPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = StackNavigationProp<RootStackParamList, 'PlantioScreen'>;

// Defina seus tipos de cultura e as imagens correspondentes
const cultureTypes = [
  { id: 'SOJA', name: 'Soja', image: require('../../assets/soy.png') },
  { id: 'MILHO', name: 'Milho', image: require('../../assets/corn.png') },
  { id: 'FEIJAO', name: 'Feijão', image: require('../../assets/bean.png') },
  { id: 'ARROZ', name: 'Arroz', image: require('../../assets/rice.png') },
  { id: 'CAFE', name: 'Café', image: require('../../assets/coffee.png') },
  { id: 'ALGODAO', name: 'Algodão', image: require('../../assets/cotton.png') },
  { id: 'BANANA', name: 'Banana', image: require('../../assets/banana.png') },
  { id: 'LARANJA', name: 'Laranja', image: require('../../assets/orange.png') },
];

export default function PlantioScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState<{ id: string; name: string } | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [isLoadingFarms, setIsLoadingFarms] = useState(false);

  const handleCulturePress = (culture: { id: string; name: string }) => {
    setSelectedCulture(culture);
    loadFarms();
  };

  const loadFarms = async () => {
    setIsLoadingFarms(true);
    setModalVisible(true);
    try {
      const token = await AsyncStorage.getItem('@TerraManager:token');
      if (!token) throw new Error("Token não encontrado.");
      const response = await fetchFarms(token);
      setFarms(response.data || []);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar as fazendas.");
      setModalVisible(false);
    } finally {
      setIsLoadingFarms(false);
    }
  };

  const handleSelectFarm = () => {
    if (!selectedFarm) {
      Alert.alert("Atenção", "Por favor, selecione uma fazenda.");
      return;
    }
    setModalVisible(false);
    // Navega para a tela de listagem de plantios (Passo 3)
    navigation.navigate('ListPlantioScreen', {
      farmId: selectedFarm,
      cultureType: selectedCulture?.id || '',
    });
  };

  const renderCultureItem = ({ item }: { item: typeof cultureTypes[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCulturePress(item)}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Plantio</Text>
      </View>
      <FlatList
        data={cultureTypes}
        renderItem={renderCultureItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Fazenda para o Plantio de {selectedCulture?.name}</Text>
            {isLoadingFarms ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <CustomPicker
                selectedValue={selectedFarm}
                onValueChange={setSelectedFarm}
                options={farms.map(f => ({ label: f.nome, value: f.id }))}
                placeholder="Selecione uma fazenda..."
              />
            )}
            <TouchableOpacity style={styles.modalButton} onPress={handleSelectFarm} disabled={isLoadingFarms}>
              <Text style={styles.modalButtonText}>Avançar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E322D' },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.primary,
        paddingTop: Platform.OS === 'android' ? 40 : 15,
        alignItems: 'center',
    },
    headerTitle: { color: colors.white, fontSize: 22, fontWeight: 'bold' },
    grid: { padding: 10 },
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
    },
    cardImage: { width: 80, height: 80, marginBottom: 10 },
    cardText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 25,
        elevation: 5,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    modalButton: { backgroundColor: colors.secondary, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 20 },
    modalButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
    cancelButton: { backgroundColor: colors.danger, marginTop: 10 },
});