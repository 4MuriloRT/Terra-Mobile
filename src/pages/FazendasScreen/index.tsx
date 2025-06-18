import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../components/Colors'; // Ajuste o caminho conforme necessário

export default function FazendasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Fazendas</Text>
      {/* Adicione conteúdo para a sua tela de Fazendas aqui */}
      <Text style={styles.text}>Detalhes das fazendas virão aqui...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
