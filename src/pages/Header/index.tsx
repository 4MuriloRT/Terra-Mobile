import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

export const DashboardHeader = () => {
  const { user } = useAuth();

  
  const getDisplayName = () => {
    if (user && user.nome) {
      
      if (user.nome.includes('@')) {
        return user.nome.split('@')[0];
      }
      
      return user.nome;
    }
    
    return 'Bem-vindo';
  };

  return (
    <View style={styles.container}>
      <FontAwesome5 name="leaf" size={24} color="white" />

      <View style={styles.rightContainer}>
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <MaterialCommunityIcons name="bell" size={18} color="white" />
          
            <Text style={styles.name}> {getDisplayName()} </Text>
          </View>
          <Text style={styles.role}>{user ? user.role.toLowerCase() : 'usuário'}</Text>
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
    fontSize: 16,
    color: "#fff",
  },
  role: {
    fontSize: 14,
    color: "#fff",
  },
  avatar: {
    marginLeft: 8,
  },
});
