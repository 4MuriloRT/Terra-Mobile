import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";
import { colors } from "../../components/Colors";

type FazendasScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FazendasScreen"
>;

// Dados fictícios para simular o que viria do backend
const DADOS_FICTICIOS = [
  {
    id: "1",
    nome: "Farm Dev",
    cnpj: "54.963.649/0001-00",
    area: "1250 ha",
    municipio: "Arinos",
    uf: "MG",
    ativo: true,
  },
  {
    id: "2",
    nome: "Fazenda Aurora",
    cnpj: "12.345.678/0001-99",
    area: "870 ha",
    municipio: "Buritis",
    uf: "MG",
    ativo: true,
  },
  {
    id: "3",
    nome: "Campo Belo",
    cnpj: "98.765.432/0001-11",
    area: "2100 ha",
    municipio: "Unaí",
    uf: "MG",
    ativo: false,
  },
  {
    id: "4",
    nome: "Recanto do Sol",
    cnpj: "15.975.324/0001-85",
    area: "540 ha",
    municipio: "Formoso",
    uf: "MG",
    ativo: true,
  },
];

export default function FazendasScreen() {
  const navigation = useNavigation<FazendasScreenNavigationProp>();
  // Usando useState para guardar os dados. No futuro, você alimentará este estado com a resposta da API.
  const [fazendas, setFazendas] = useState(DADOS_FICTICIOS);

  const renderItem = ({ item }: { item: (typeof DADOS_FICTICIOS)[0] }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, { flex: 2.5 }]}>{item.nome}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>{item.municipio}</Text>
      <View style={[{ flex: 1.2, alignItems: 'center'}]}>
        <View style={[styles.statusBadge, {backgroundColor: item.ativo ? colors.secondary : '#a14242'}]}>
            <Text style={styles.statusText}>{item.ativo ? "ATIVO" : "INATIVO"}</Text>
        </View>
      </View>
      <View style={[styles.actionsCell, { flex: 1.5 }]}>
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
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter-outline" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate("AddFarmScreen")}
          >
            <Ionicons name="add-outline" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Nova Fazenda</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 2.5 }]}>Nome</Text>
          <Text style={[styles.headerText, { flex: 1.5 }]}>Município</Text>
          <Text style={[styles.headerText, { flex: 1.2, textAlign: 'center' }]}>Status</Text>
          <Text style={[styles.headerText, { flex: 1.5, textAlign: 'center' }]}>Ações</Text>
        </View>

        
        <FlatList
          data={fazendas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E322D',
  },
  header: {
    backgroundColor: colors.primary, 
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary, 
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
    padding: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cell: {
    color: colors.white,
    fontSize: 14,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 15,
    gap: 5,
  },
  actionButton: {
    padding: 5,
  },
}); 
