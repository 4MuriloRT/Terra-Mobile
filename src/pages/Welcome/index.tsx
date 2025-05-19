import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../../components/Styles";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types"; // ajuste o caminho se estiver diferente

type NavigationProp = StackNavigationProp<RootStackParamList, "Welcome">;

export default function Welcome() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.back}>
      <Animatable.Image
        animation="fadeInDown"
        source={require("../../assets/logo.jpeg")}
        style={styles.image}
      />
      <Animatable.View delay={600} animation="fadeInUp" style={styles.back2}>
        <Text style={styles.title}>
          Bem-vindo ao Terra Manager: controle e organize sua fazenda de forma
          simples e eficiente.
        </Text>
        <Text style={styles.text}>Faça login para continuar</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.textButton}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
