import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import Styles from "../../components/Styles";

export default function SignIn() {
  return (
    <View style={Styles.container}>
      <Animatable.View animation="fadeInLeft" delay={600} style={Styles.Header}>
        <Text style={Styles.textLogin}>Bem-Vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={Styles.Header2}>
        <Text style={Styles.email}>Email</Text>
        <TextInput
          placeholder="Digite um email..."
          style={Styles.input}
        ></TextInput>
        <Text style={Styles.email}>Senha</Text>
        <TextInput
          placeholder="Sua senha"
          secureTextEntry={true}
          style={Styles.input}
        ></TextInput>
        <TouchableOpacity style={Styles.buttonLogin}>
          <Text style={Styles.textButton}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={Styles.buttonRegister}>
          <Text style={Styles.registerText}>
            Não possui uma conta? Cadastra-se{" "}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
