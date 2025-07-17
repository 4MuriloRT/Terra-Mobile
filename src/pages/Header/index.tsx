import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

export const DashboardHeader = () => {
  const { user } = useAuth();

  const getDisplayName = () => {
    if (user && user.nome) {
      const nameParts = user.nome.split(" ");
      // Pega os dois primeiros nomes
      return `${nameParts[0]} ${nameParts[1] || ""}`.trim();
    }

    return "Bem-vindo";
  };

  return (
    <View style={styles.container}>
      <FontAwesome5 name="leaf" size={24} color="white" />

      <View style={styles.rightContainer}>
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <MaterialCommunityIcons name="bell" size={18} color="white" />
            <Text style={styles.name}>{getDisplayName()}</Text>
          </View>
        </View>
        <FontAwesome5
          name="user-circle"
          size={40}
          color="white"
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: "#263c20",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#ffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginRight: 10,
    alignItems: "flex-end",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    marginLeft: 8, // Adicionado espaçamento entre o sino e o nome
  },
  avatar: {
    marginLeft: 8,
  },
});
