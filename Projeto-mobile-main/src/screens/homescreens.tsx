import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Alert, Dimensions, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from "../../app/(tabs)/index";

const { width } = Dimensions.get("window");
const image = require('../../assets/images/background.jpg');

type NavProp = StackNavigationProp<RootStackParamList>;

const App = () => {
  const navigation = useNavigation<NavProp>();

  const handlePress = () => {
    Alert.alert('Botão pressionado!', 'A jornada começou.');
  };

  const handleSignUp = () => {
    Alert.alert('Cadastro', 'Redirecionando para a tela de cadastro...');
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

        <View style={{ flex: 1 }} />

        <View style={styles.actionGroup}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>INICIAR</Text>
          </TouchableOpacity>

          <View style={styles.footerBackground}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpText}>Cadastre-se aqui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { flex: 1, width: '100%', height: '100%', alignItems: 'center' },
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
  actionGroup: { width: '100%', alignItems: 'center', paddingBottom: 60 },
  button: {
    backgroundColor: '#26a69a', 
    paddingVertical: 18,
    width: '85%',
    borderRadius: 35,
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#ffffff', 
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  footerBackground: {
    backgroundColor: 'rgba(10, 74, 92, 0.8)', 
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#26a69a', 
  },
  footer: { flexDirection: 'row', alignItems: 'center' },
  footerText: { color: '#e0f2f1', fontSize: 14 },
  signUpText: {
    color: '#4db6ac', 
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default App;