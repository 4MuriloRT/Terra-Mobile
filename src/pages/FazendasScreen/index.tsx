import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../components/Colors"; // Ajuste o caminho conforme necessário

export default function FazendasScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter-outline" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="add-outline" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Nova Fazenda</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>Detalhes das fazendas virão aqui...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    opacity: 0.7,
  },
  headerButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary, // Cor do botão de filtro
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: {
    color: colors.white,
    marginLeft: 5,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: '#1E322D',
    padding: 15
  },
});
