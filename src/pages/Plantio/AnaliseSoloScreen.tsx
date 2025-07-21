// Em: src/pages/Plantio/AnaliseSoloScreen.tsx

import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, ScrollView, 
    StyleSheet, Alert, Platform, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../../screens/Types';
import { colors } from '../../components/Colors';
// ✅ Importa as duas funções de API necessárias
import { createPlantio, createAnaliseSolo } from '../../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AnaliseSoloScreen'>;
type AnaliseSoloRouteProp = RouteProp<RootStackParamList, 'AnaliseSoloScreen'>;

export default function AnaliseSoloScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<AnaliseSoloRouteProp>();
    const { farmId, dadosPlantio } = route.params;

    const [isLoading, setIsLoading] = useState(false);

    // Estados para os campos da análise de solo
    const [ph, setPh] = useState('');
    const [p, setP] = useState(''); // Fósforo
    const [k, setK] = useState(''); // Potássio
    // ... adicione aqui os outros estados para os campos da imagem
    
    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('@TerraManager:token');
            if (!token) {
                throw new Error("Sessão expirada. Faça login novamente.");
            }

            // PASSO 1: Criar a Análise de Solo
            const dadosAnaliseSolo = {
                ph: parseFloat(ph.replace(',', '.')) || 0,
                p: parseInt(p) || 0,
                k: parseInt(k) || 0,
                // ... adicione os outros campos da análise aqui
            };
            const analiseCriada = await createAnaliseSolo(dadosAnaliseSolo, token);

            // PASSO 2: Criar o payload final do Plantio com o ID da análise
            const payloadFinal = {
                ...dadosPlantio, // Dados da tela anterior
                idFazenda: parseInt(farmId), // Garante que o ID da fazenda está no payload
                idAnaliseSolo: analiseCriada.id, // ✅ USA O ID RETORNADO PELA API
            };
            
            // PASSO 3: Criar o Plantio
            await createPlantio(payloadFinal, token);

            Alert.alert("Sucesso!", "Plantio cadastrado com sucesso!");
            
            navigation.popToTop(); 
            navigation.navigate('DashboardScreen');

        } catch (error: any) {
            Alert.alert("Erro ao Salvar", error.message || "Não foi possível concluir o cadastro.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Análise de Solo</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>Dados da Análise</Text>
                    
                    <Text style={styles.inputLabel}>pH</Text>
                    <TextInput style={styles.input} value={ph} onChangeText={setPh} keyboardType="numeric" placeholder="Ex: 6.2" />
                    
                    <Text style={styles.inputLabel}>Fósforo (P)</Text>
                    <TextInput style={styles.input} value={p} onChangeText={setP} keyboardType="numeric" placeholder="em mg/dm³" />

                    <Text style={styles.inputLabel}>Potássio (K)</Text>
                    <TextInput style={styles.input} value={k} onChangeText={setK} keyboardType="numeric" placeholder="em cmolc/dm³" />

                    {/* Adicione os outros campos aqui */}

                    <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.createButtonText}>FINALIZAR CADASTRO</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primary },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 15, backgroundColor: colors.primary, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)' },
    backButton: { padding: 5 },
    headerTitle: { color: colors.white, fontSize: 20, fontWeight: 'bold' },
    formContent: { paddingHorizontal: 20, paddingBottom: 40, backgroundColor: "#1E322D" },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.white, marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.secondary, paddingBottom: 5 },
    inputLabel: { fontSize: 16, color: colors.white, marginBottom: 8, marginTop: 15, },
    input: { backgroundColor: colors.white, borderRadius: 8, paddingHorizontal: 15, height: 50, fontSize: 16, color: colors.textPrimary },
    createButton: { backgroundColor: colors.secondary, borderRadius: 8, paddingVertical: 15, alignItems: 'center', marginTop: 30, height: 54, justifyContent: 'center' },
    createButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' }
});