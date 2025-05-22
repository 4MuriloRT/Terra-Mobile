import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

export const DashboardHeader = () => {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="leaf" size={24} color="black" />

      
      <View style={styles.rightContainer}>
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <MaterialCommunityIcons name="bell" size={18} color="black" />
            <Text style={styles.name}> Joaquin Silva </Text>
          </View>
          <Text style={styles.role}>proprietário</Text>
        </View>
        <FontAwesome5
          name="user-circle"
          size={40}
          color=""
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: "#CED5C0",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#5B7C48",
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
    color: "#1F2937",
  },
  role: {
    fontSize: 14,
    color: "#374151",
  },
  avatar: {
    marginLeft: 8,
  },
});
