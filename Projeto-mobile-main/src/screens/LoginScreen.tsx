import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/app/(tabs)/index';
import { auth } from './services/connectionFirebase';

const image = require('../../assets/images/background.jpg');
type NavProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.navigate('perfilUsuario');
    } catch (error: any) {
      const mensagens: Record<string, string> = {
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      };
      Alert.alert('Erro no login', mensagens[error.code] ?? 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.headerBanner}>
            <Text style={styles.TextLogo}>SHOPLIST</Text>
          </View>
        </SafeAreaView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.formContainer}>
            <Text style={styles.tituloForm}>Entrar na conta</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.forgotPassText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('cadastro')}>
                <Text style={styles.signUpText}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.voltarBotao}
              onPress={() => navigation.navigate('homescreen')}
            >
              <Text style={styles.voltarTexto}>← Voltar ao início</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { flex: 1, width: '100%', height: '100%' },
  headerSafe: { width: '100%' },
  headerBanner: {
    width: '100%',
    backgroundColor: 'rgba(10, 74, 92, 0.95)',
    paddingTop: 40,
    paddingBottom: 25,
    borderBottomWidth: 4,
    borderBottomColor: '#1a7a91',
    elevation: 15,
  },
  TextLogo: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 8,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloForm: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  formContainer: {
    width: '85%',
    backgroundColor: 'rgba(10, 74, 92, 0.85)',
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#26a69a',
    marginBottom: 30,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    color: '#4db6ac',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(77, 182, 172, 0.3)',
  },
  forgotPass: { alignSelf: 'flex-end' },
  forgotPassText: { color: '#e0f2f1', fontSize: 13, opacity: 0.8 },
  actionGroup: { width: '100%', alignItems: 'center' },
  button: {
    backgroundColor: '#26a69a',
    paddingVertical: 18,
    width: '85%',
    borderRadius: 35,
    marginBottom: 25,
    elevation: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 74, 92, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  footerText: { color: '#e0f2f1', fontSize: 14 },
  signUpText: {
    color: '#4db6ac',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  voltarBotao: { marginTop: 4 },
  voltarTexto: { color: '#90cad3', fontSize: 13 },
});

export default LoginScreen;
