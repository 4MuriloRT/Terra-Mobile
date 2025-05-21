import React from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import * as Animatable from "react-native-animatable";
import Styles from "../../components/Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";
import { ScrollView } from "react-native-gesture-handler";

type NavigationProp = StackNavigationProp<RootStackParamList, "Register">;

export default function Register(){
    return(
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={Styles.container}>
                <Animatable.View animation="fadeInLeft" delay={600} style={Styles.Header}>
                    <Text style={Styles.textLogin}>Registre-se</Text>
                </Animatable.View>

                <View style={{flex: 1, justifyContent: "space-between"}}>
                    <Animatable.View animation="fadeInUp" style={Styles.Header3}>
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={Styles.email}>Digite seu nome completo: </Text>
                            <TextInput
                                placeholder="Digite seu nome..."
                                style={Styles.input}
                            ></TextInput>
                            <Text style={Styles.email}>CPF</Text>
                            <TextInput
                                placeholder="Ex: 123.456.789-10"
                                style={Styles.input}
                            ></TextInput>
                            <Text style={Styles.email}>Telefone</Text>
                            <TextInput
                                placeholder="Ex: (00) 9 1234-5678 "
                                style={Styles.input}
                            ></TextInput>
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
                            <Text style={Styles.email}>Confirmar Senha</Text>
                            <TextInput
                                placeholder="Confirme sua senha"
                                secureTextEntry={true}
                                style={Styles.input}
                            ></TextInput>
                        </ScrollView>
                    </Animatable.View>
                </View>
                <View style={Styles.footerRegister}>
                    <TouchableOpacity style={Styles.buttonRegister}>
                        <Text style={Styles.textButton}>Cadastrar</Text>
                    </TouchableOpacity>    
                </View>    
            </View>
        </KeyboardAvoidingView>
    );
}