import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const DashboardFooter = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate("CultivosScreen")}>
        <FontAwesome5 name="seedling" size={28} color="#131e10" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("DashboardScreen")}>
        <FontAwesome5 name="home" size={28} color="#131e10" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("FazendasScreen")}>
        <FontAwesome5 name="tractor" size={28} color="#131e10" />
      </TouchableOpacity>
      <FontAwesome5 name="users" size={28} color="#131e10" />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 32,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
