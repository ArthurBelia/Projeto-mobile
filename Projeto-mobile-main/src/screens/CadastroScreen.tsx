import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/app/(tabs)/index';
import { auth, database } from './services/connectionFirebase';

type NavProp = StackNavigationProp<RootStackParamList>;

export default function CadastroScreen() {
  const navigation = useNavigation<NavProp>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      const uid = credencial.user.uid;

      await set(ref(database, `usuarios/${uid}`), {
        nome: nome.trim(),
        email: email.trim(),
        criadoEm: new Date().toISOString(),
      });

      Alert.alert('Conta criada!', 'Seu cadastro foi realizado com sucesso.', [
        { text: 'OK', onPress: () => navigation.navigate('perfilUsuario') },
      ]);
    } catch (error: any) {
      const mensagens: Record<string, string> = {
        'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/weak-password': 'Senha muito fraca.',
      };
      Alert.alert('Erro no cadastro', mensagens[error.code] ?? 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a4a5c" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SHOPLIST</Text>
        <View style={{ width: 70 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.subtitulo}>Preencha os dados abaixo para se cadastrar</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#90a4ae"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#90a4ae"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#90a4ae"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor="#90a4ae"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.botao, loading && styles.botaoDesabilitado]}
              onPress={handleCadastro}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botaoTexto}>CADASTRAR</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.loginLinha}>
            <Text style={styles.loginTexto}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
              <Text style={styles.loginLink}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a4a5c' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(10, 74, 92, 0.95)',
    borderBottomWidth: 3,
    borderBottomColor: '#1a7a91',
  },
  backButton: { width: 70 },
  backText: { color: '#4db6ac', fontSize: 15, fontWeight: '600' },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 6,
  },
  scroll: { padding: 24, paddingBottom: 40 },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 6 },
  subtitulo: { color: '#90cad3', fontSize: 14, marginBottom: 28 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  label: {
    color: '#0a4a5c',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#f0f7f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#0d2b35',
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  botao: {
    backgroundColor: '#26a69a',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    elevation: 4,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  loginLinha: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginTexto: { color: '#90cad3', fontSize: 14 },
  loginLink: {
    color: '#4db6ac',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
