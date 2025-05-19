import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import Styles from "../../components/Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";

type NavigationProp = StackNavigationProp<RootStackParamList, "Register">;

export default function SignIn() {
  const navigation = useNavigation<NavigationProp>();
  
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

        <View style={Styles.lineRegister}>
          <View>
            <Text style={Styles.registerText}>
              Não possui uma conta?
            </Text>
          </View>
          <TouchableOpacity >
            <Text 
              style={Styles.buttonRegister}
              onPress={() => navigation.navigate("Register")}
            >
               Cadastra-se{" "}
            </Text>
          </TouchableOpacity>
        </View>
        
      </Animatable.View>
    </View>
  );
}
