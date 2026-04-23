import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { updateEmail, updatePassword } from 'firebase/auth';
import { onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
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

export default function PerfilUsuarioScreen() {
  const navigation = useNavigation<NavProp>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);

  const usuario = auth.currentUser;

  useEffect(() => {
    if (!usuario) {
      Alert.alert('Sessão expirada', 'Faça login novamente.', [
        { text: 'OK', onPress: () => navigation.navigate('login') },
      ]);
      return;
    }

    const usuarioRef = ref(database, `usuarios/${usuario.uid}`);
    const unsubscribe = onValue(usuarioRef, (snapshot) => {
      const dados = snapshot.val();
      if (dados) {
        setNome(dados.nome ?? '');
        setEmail(dados.email ?? usuario.email ?? '');
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'O nome não pode ficar em branco.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'O e-mail não pode ficar em branco.');
      return;
    }
    if (novaSenha && novaSenha.length < 6) {
      Alert.alert('Senha fraca', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!usuario) return;

    setSalvando(true);
    try {
      await update(ref(database, `usuarios/${usuario.uid}`), {
        nome: nome.trim(),
        email: email.trim(),
        atualizadoEm: new Date().toISOString(),
      });

      if (email.trim() !== usuario.email) {
        await updateEmail(usuario, email.trim());
      }

      if (novaSenha) {
        await updatePassword(usuario, novaSenha);
        setNovaSenha('');
      }

      setEditando(false);
      Alert.alert('Sucesso!', 'Seus dados foram atualizados.');
    } catch (error: any) {
      const mensagens: Record<string, string> = {
        'auth/requires-recent-login':
          'Por segurança, faça login novamente antes de alterar e-mail ou senha.',
        'auth/email-already-in-use': 'Este e-mail já está em uso.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/weak-password': 'Senha muito fraca.',
      };
      Alert.alert('Erro ao salvar', mensagens[error.code] ?? 'Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    setNovaSenha('');
    if (usuario) {
      const usuarioRef = ref(database, `usuarios/${usuario.uid}`);
      onValue(
        usuarioRef,
        (snapshot) => {
          const dados = snapshot.val();
          if (dados) {
            setNome(dados.nome ?? '');
            setEmail(dados.email ?? '');
          }
        },
        { onlyOnce: true }
      );
    }
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#26a69a" />
        <Text style={styles.loadingTexto}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a4a5c" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('homescreen')} style={styles.backButton}>
          <Text style={styles.backText}>← Início</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SHOPLIST</Text>
        <View style={{ width: 70 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetra}>
                {nome ? nome.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <Text style={styles.nomeExibido}>{nome || 'Usuário'}</Text>
            <Text style={styles.emailExibido}>{email}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>Meus dados</Text>
              {!editando && (
                <TouchableOpacity onPress={() => setEditando(true)} style={styles.editarBotao}>
                  <Text style={styles.editarTexto}>✏️ Editar</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={[styles.input, !editando && styles.inputDesabilitado]}
              value={nome}
              onChangeText={setNome}
              editable={editando}
              autoCapitalize="words"
              placeholder="Seu nome"
              placeholderTextColor="#90a4ae"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, !editando && styles.inputDesabilitado]}
              value={email}
              onChangeText={setEmail}
              editable={editando}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seu@email.com"
              placeholderTextColor="#90a4ae"
            />

            {editando && (
              <>
                <Text style={styles.label}>Nova senha (opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  secureTextEntry
                  placeholder="Deixe em branco para não alterar"
                  placeholderTextColor="#90a4ae"
                />
              </>
            )}

            {editando && (
              <View style={styles.botoesEdicao}>
                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={handleCancelar}
                  disabled={salvando}
                >
                  <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
                  onPress={handleSalvar}
                  disabled={salvando}
                  activeOpacity={0.8}
                >
                  {salvando ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.botaoSalvarTexto}>SALVAR</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a4a5c' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a4a5c',
    gap: 12,
  },
  loadingTexto: { color: '#90cad3', fontSize: 15 },
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
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 6 },
  scroll: { padding: 24, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#26a69a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    marginBottom: 12,
  },
  avatarLetra: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  nomeExibido: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  emailExibido: { color: '#90cad3', fontSize: 14 },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitulo: { color: '#0a4a5c', fontSize: 18, fontWeight: 'bold' },
  editarBotao: {
    backgroundColor: '#e0f7f5',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#26a69a',
  },
  editarTexto: { color: '#0a4a5c', fontSize: 13, fontWeight: '600' },
  label: { color: '#0a4a5c', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 14 },
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
  inputDesabilitado: { backgroundColor: '#e8f4f8', color: '#546e7a', borderColor: '#cfd8dc' },
  botoesEdicao: { flexDirection: 'row', gap: 12, marginTop: 28 },
  botaoCancelar: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#26a69a',
  },
  botaoCancelarTexto: { color: '#26a69a', fontSize: 15, fontWeight: '600' },
  botaoSalvar: {
    flex: 1,
    backgroundColor: '#26a69a',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoSalvarTexto: { color: '#fff', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
});
