import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Styles from "../../components/Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";
import { ScrollView } from "react-native-gesture-handler";

type NavigationProp = StackNavigationProp<RootStackParamList, "Register">;

// <<<<<<< COLOQUE A URL BASE DO SEU BACKEND AQUI >>>>>>>
const API_BASE_URL = "http://192.168.3.3:3000"; // USE O SEU IP E PORTA

export default function Register() {
  const navigation = useNavigation<NavigationProp>();

  // Estados para cada campo do formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // 1. Validação simples no frontend
    if (!nome || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    // 2. Envia os dados para o backend
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
         body: JSON.stringify({
        nome: nome,           // Corrigido de 'name' para 'nome'
        email: email,
        cpf: cpf,
        telefone: telefone,   // Corrigido de 'phone' para 'telefone'
        password: password,
        role: "USER"          // Adicionado o campo 'role' fixo
      }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Sucesso!",
          "Sua conta foi criada. Faça o login para continuar."
        );
        navigation.navigate("SignIn");
      } else {
        Alert.alert(
          "Erro no Cadastro",
          data.message || "Não foi possível criar a conta."
        );
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível se conectar ao servidor."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={Styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={600}
          style={Styles.Header}
        >
          <Text style={Styles.textLogin}>Registre-se</Text>
        </Animatable.View>

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <Animatable.View animation="fadeInUp" style={Styles.Header3}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={Styles.email}>Digite seu nome completo: </Text>
              <TextInput
                placeholder="Digite seu nome..."
                style={Styles.input}
                value={nome}
                onChangeText={setNome}
              />
              <Text style={Styles.email}>CPF</Text>
              <TextInput
                placeholder="Ex: 123.456.789-10"
                style={Styles.input}
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
              />
              <Text style={Styles.email}>Telefone</Text>
              <TextInput
                placeholder="Ex: (00) 9 1234-5678 "
                style={Styles.input}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />
              <Text style={Styles.email}>Email</Text>
              <TextInput
                placeholder="Digite um email..."
                style={Styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={Styles.email}>Senha</Text>
              <TextInput
                placeholder="Sua senha"
                secureTextEntry={true}
                style={Styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <Text style={Styles.email}>Confirmar Senha</Text>
              <TextInput
                placeholder="Confirme sua senha"
                secureTextEntry={true}
                style={Styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </ScrollView>
          </Animatable.View>
        </View>
        <View style={Styles.footerRegister}>
          <TouchableOpacity
            style={Styles.buttonRegister}
            onPress={handleRegister}
          >
            <Text style={Styles.textButton}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
