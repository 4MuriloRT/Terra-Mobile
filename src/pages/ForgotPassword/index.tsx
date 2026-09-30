// src/pages/ForgotPassword/index.tsx
//
// Fluxo real do backend:
//  Etapa 1: POST /auth/forgot-password { email }
//           → backend gera token e envia por e-mail como link
//           → usuário abre o email, copia o TOKEN da URL (?token=xxx)
//  Etapa 2: POST /auth/verify-reset-password-token { token }
//           → valida se o token ainda é válido (expira em 30 min)
//  Etapa 3: POST /auth/reset-password { token, newPassword, confirmPassword }
//           → redefine a senha

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";
import {
  authForgotPassword,
  authVerifyResetToken,
  authResetPassword,
} from "../../services/api";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type Step = 1 | 2 | 3;

// ─── Extrai mensagem legível de qualquer objeto de erro ───────────────────────
function parseError(err: any): string {
  // Axios: err.response.data pode ser string, objeto ou array
  const data = err?.response?.data;
  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.message)) return data.message.join("\n");
  if (typeof err?.message === "string") return err.message;
  return "Ocorreu um erro inesperado. Tente novamente.";
}

const STEPS = [
  { id: 1, label: "Email",     icon: "mail-outline" as const },
  { id: 2, label: "Token",     icon: "key-outline" as const },
  { id: 3, label: "Nova Senha", icon: "lock-closed-outline" as const },
];

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp>();

  const [step, setStep]         = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Campos
  const [email, setEmail]               = useState("");
  const [token, setToken]               = useState("");
  const [newPassword, setNewPassword]   = useState("");
  const [confirmPass, setConfirmPass]   = useState("");
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  // Erros inline
  const [emailError, setEmailError]     = useState("");
  const [tokenError, setTokenError]     = useState("");
  const [passError, setPassError]       = useState("");
  const [confirmError, setConfirmError] = useState("");

  // ── Etapa 1 ────────────────────────────────────────────────────────────────
  const handleSendCode = async () => {
    setEmailError("");
    if (!email.trim()) { setEmailError("Informe seu email."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Email inválido."); return; }

    setIsLoading(true);
    try {
      await authForgotPassword(email.trim());
      Alert.alert(
        "Email enviado! 📧",
        `Verifique sua caixa de entrada em ${email}.\n\nAbra o email recebido, copie o TOKEN que aparece no link (a parte após "?token=") e cole na próxima etapa.`,
        [{ text: "Entendido", onPress: () => setStep(2) }]
      );
    } catch (err: any) {
      const msg = parseError(err);
      // Mapeamento de mensagens inglesas → português
      if (msg.toLowerCase().includes("user not found") || msg.toLowerCase().includes("not found")) {
        setEmailError("Nenhuma conta encontrada com esse email.");
      } else if (msg.toLowerCase().includes("email")) {
        setEmailError(msg);
      } else {
        Alert.alert("Erro ao enviar email", msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Etapa 2 ────────────────────────────────────────────────────────────────
  const handleVerifyToken = async () => {
    setTokenError("");
    if (!token.trim()) { setTokenError("Cole o token recebido por email."); return; }

    setIsLoading(true);
    try {
      await authVerifyResetToken(token.trim());
      setStep(3);
    } catch (err: any) {
      const msg = parseError(err);
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("expired")) {
        setTokenError("Token inválido ou expirado. Solicite um novo código.");
      } else {
        setTokenError(msg || "Token inválido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Etapa 3 ────────────────────────────────────────────────────────────────
  const handleResetPassword = async () => {
    setPassError("");
    setConfirmError("");

    if (!newPassword) { setPassError("Informe a nova senha."); return; }
    if (newPassword.length < 6) { setPassError("A senha deve ter pelo menos 6 caracteres."); return; }
    if (!confirmPass) { setConfirmError("Confirme a nova senha."); return; }
    if (newPassword !== confirmPass) { setConfirmError("As senhas não coincidem."); return; }

    setIsLoading(true);
    try {
      await authResetPassword(token.trim(), newPassword, confirmPass);
      Alert.alert(
        "Senha redefinida! ✅",
        "Sua senha foi alterada com sucesso. Faça o login com a nova senha.",
        [{ text: "Fazer Login", onPress: () => navigation.navigate("SignIn") }]
      );
    } catch (err: any) {
      const msg = parseError(err);
      if (msg.toLowerCase().includes("match")) {
        setConfirmError("As senhas não coincidem.");
      } else if (msg.toLowerCase().includes("token")) {
        setTokenError("Token inválido. Volte e solicite um novo código.");
        setStep(2);
      } else {
        Alert.alert("Erro ao redefinir senha", msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Força da senha ─────────────────────────────────────────────────────────
  const getPasswordStrength = (p: string) => {
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getPasswordStrength(newPassword);
  const strengthLabel = ["", "Muito fraca", "Fraca", "Razoável", "Boa", "Forte"][strength];
  const strengthColor = ["", "#dc2626", "#f97316", "#eab308", "#22c55e", "#16a34a"][strength];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor="#1a2e1a" barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoCircle}>
            <Ionicons name="key-outline" size={32} color="#4b7940" />
          </View>
          <Text style={styles.headerTitle}>Recuperar Senha</Text>
          <Text style={styles.headerSub}>Redefina sua senha em 3 passos</Text>
        </Animatable.View>

        {/* Barra de progresso */}
        <View style={styles.stepsRow}>
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.id}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, step > s.id && styles.stepDone, step === s.id && styles.stepActive]}>
                  {step > s.id
                    ? <Ionicons name="checkmark" size={16} color="#fff" />
                    : <Ionicons name={s.icon} size={16} color={step === s.id ? "#fff" : "rgba(255,255,255,0.35)"} />
                  }
                </View>
                <Text style={[styles.stepLabel, step === s.id && styles.stepLabelActive]}>{s.label}</Text>
              </View>
              {idx < STEPS.length - 1 && (
                <View style={[styles.stepLine, step > s.id && styles.stepLineDone]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Card — re-anima ao trocar etapa */}
        <Animatable.View key={step} animation="fadeInUp" delay={100} duration={400} style={styles.card}>

          {/* ─── ETAPA 1: Email ─────────────────────────────────────────── */}
          {step === 1 && (
            <>
              <Text style={styles.cardTitle}>Digite seu email</Text>
              <Text style={styles.cardSub}>
                Enviaremos um email com um link de recuperação. Você precisará copiar o TOKEN do link recebido.
              </Text>
              <FieldInput
                label="Email cadastrado"
                icon="mail-outline"
                placeholder="seu@email.com"
                value={email}
                onChangeText={(v) => { setEmail(v); setEmailError(""); }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
              />
              <ActionButton label="Enviar Email" icon="send-outline" onPress={handleSendCode} isLoading={isLoading} />
            </>
          )}

          {/* ─── ETAPA 2: Token ─────────────────────────────────────────── */}
          {step === 2 && (
            <>
              <Text style={styles.cardTitle}>Cole o token do email</Text>
              <View style={styles.instructionBox}>
                <Ionicons name="information-circle-outline" size={18} color="#4b7940" />
                <Text style={styles.instructionText}>
                  Abra o email recebido em <Text style={styles.bold}>{email}</Text> e copie o token que aparece no link após{" "}
                  <Text style={styles.bold}>"?token="</Text>.
                </Text>
              </View>
              <FieldInput
                label="Token de verificação"
                icon="key-outline"
                placeholder="Cole o token aqui"
                value={token}
                onChangeText={(v) => { setToken(v); setTokenError(""); }}
                autoCapitalize="none"
                autoCorrect={false}
                error={tokenError}
              />
              <ActionButton label="Verificar Token" icon="shield-checkmark-outline" onPress={handleVerifyToken} isLoading={isLoading} />
              <TouchableOpacity style={styles.resendBtn} onPress={() => { setStep(1); setToken(""); setTokenError(""); }}>
                <Ionicons name="refresh-outline" size={14} color="#4b7940" />
                <Text style={styles.resendText}>Não recebeu? Reenviar email</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ─── ETAPA 3: Nova senha ─────────────────────────────────────── */}
          {step === 3 && (
            <>
              <Text style={styles.cardTitle}>Defina sua nova senha</Text>
              <Text style={styles.cardSub}>Escolha uma senha forte com pelo menos 6 caracteres.</Text>

              {/* Nova senha */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nova senha</Text>
                <View style={[styles.inputWrapper, passError ? styles.inputError : null]}>
                  <Ionicons name="lock-closed-outline" size={18} color="#4b7940" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showNew}
                    value={newPassword}
                    onChangeText={(v) => { setNewPassword(v); setPassError(""); }}
                  />
                  <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                    <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={18} color="#888" />
                  </TouchableOpacity>
                </View>
                {passError ? <Text style={styles.errorText}><Ionicons name="alert-circle-outline" size={12} /> {passError}</Text> : null}
                {/* Barra de força */}
                {newPassword.length > 0 && (
                  <View style={styles.strengthRow}>
                    {[1,2,3,4,5].map(i => (
                      <View key={i} style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColor : "#e5e7eb" }]} />
                    ))}
                    <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                  </View>
                )}
              </View>

              {/* Confirmar senha */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirmar nova senha</Text>
                <View style={[styles.inputWrapper, confirmError ? styles.inputError : null]}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#4b7940" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Repita a senha"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showConfirm}
                    value={confirmPass}
                    onChangeText={(v) => { setConfirmPass(v); setConfirmError(""); }}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={18} color="#888" />
                  </TouchableOpacity>
                </View>
                {confirmError ? <Text style={styles.errorText}><Ionicons name="alert-circle-outline" size={12} /> {confirmError}</Text> : null}
                {/* Ícone de match */}
                {confirmPass.length > 0 && !confirmError && (
                  <Text style={styles.matchText}>
                    <Ionicons name={newPassword === confirmPass ? "checkmark-circle" : "close-circle"} size={14} color={newPassword === confirmPass ? "#22c55e" : "#ef4444"} />
                    {" "}{newPassword === confirmPass ? "Senhas coincidem" : "Senhas não coincidem"}
                  </Text>
                )}
              </View>

              <ActionButton label="Redefinir Senha" icon="lock-open-outline" onPress={handleResetPassword} isLoading={isLoading} />
            </>
          )}

          {/* Link para login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Lembrou a senha?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.loginLink}> Fazer login</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Componente: campo com erro inline ────────────────────────────────────────
function FieldInput({
  label, icon, placeholder, value, onChangeText,
  keyboardType, autoCapitalize, autoCorrect, error,
}: {
  label: string; icon: any; placeholder: string;
  value: string; onChangeText: (v: string) => void;
  keyboardType?: any; autoCapitalize?: any; autoCorrect?: boolean; error?: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <Ionicons name={icon} size={18} color="#4b7940" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || "none"}
          autoCorrect={autoCorrect ?? false}
        />
      </View>
      {error ? (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle-outline" size={12} /> {error}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Componente: botão de ação ────────────────────────────────────────────────
function ActionButton({ label, icon, onPress, isLoading }: {
  label: string; icon: any; onPress: () => void; isLoading: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, isLoading && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.85}
    >
      {isLoading
        ? <ActivityIndicator color="#fff" size="small" />
        : <><Ionicons name={icon} size={20} color="#fff" /><Text style={styles.actionBtnText}>{label}</Text></>
      }
    </TouchableOpacity>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#1a2e1a" },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },

  header: { alignItems: "center", marginBottom: 24, paddingTop: 10 },
  backBtn: { position: "absolute", left: 0, top: 10, padding: 8 },
  logoCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: "rgba(75,121,64,0.2)",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "rgba(75,121,64,0.4)", marginBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 },

  stepsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 22, paddingHorizontal: 10 },
  stepItem: { alignItems: "center", gap: 5 },
  stepCircle: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  stepActive: { borderColor: "#4b7940", backgroundColor: "#4b7940" },
  stepDone:   { borderColor: "#22c55e", backgroundColor: "#22c55e" },
  stepLabel:  { fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  stepLabelActive: { color: "#fff" },
  stepLine: { flex: 1, height: 2, backgroundColor: "rgba(255,255,255,0.15)", marginHorizontal: 6, marginBottom: 20 },
  stepLineDone: { backgroundColor: "#22c55e" },

  card: {
    backgroundColor: "#fff", borderRadius: 24, padding: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 12,
  },
  cardTitle: { fontSize: 21, fontWeight: "700", color: "#1a2e1a", marginBottom: 6 },
  cardSub:   { fontSize: 14, color: "#777", marginBottom: 20, lineHeight: 20 },

  instructionBox: {
    flexDirection: "row", gap: 8, alignItems: "flex-start",
    backgroundColor: "#f0f7ef", borderRadius: 10,
    padding: 12, marginBottom: 18,
    borderLeftWidth: 3, borderLeftColor: "#4b7940",
  },
  instructionText: { flex: 1, fontSize: 13, color: "#444", lineHeight: 19 },
  bold: { fontWeight: "700", color: "#263c20" },

  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "600", color: "#555", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f5f7f5", borderRadius: 12,
    borderWidth: 1.5, borderColor: "#e0e8e0",
    paddingHorizontal: 12, height: 50,
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#fff5f5" },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: "#222" },
  eyeBtn: { padding: 4 },
  errorText: { fontSize: 12, color: "#ef4444", marginTop: 5, fontWeight: "500" },

  strengthRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: "600", minWidth: 70, textAlign: "right" },
  matchText: { fontSize: 12, marginTop: 5, fontWeight: "500", color: "#555" },

  actionBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#263c20", borderRadius: 14, paddingVertical: 15,
    marginTop: 6,
    shadowColor: "#263c20", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  actionBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  resendBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 },
  resendText: { color: "#4b7940", fontSize: 13, fontWeight: "600" },

  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  loginText: { color: "#777", fontSize: 14 },
  loginLink: { color: "#4b7940", fontWeight: "700", fontSize: 14 },
});
