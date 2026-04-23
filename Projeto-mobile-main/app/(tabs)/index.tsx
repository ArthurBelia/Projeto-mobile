import { createStackNavigator } from "@react-navigation/stack";
import homescreen from "../../src/screens/homescreens";
import CadastroScreen from "../../src/screens/CadastroScreen";
import LoginScreen from "../../src/screens/LoginScreen";
import PerfilUsuarioScreen from "../../src/screens/PerfilUser";

export type RootStackParamList = {
  homescreen: undefined;
  cadastro: undefined;
  login: undefined;
  perfilUsuario: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="homescreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="homescreen" component={homescreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="cadastro" component={CadastroScreen} />
      <Stack.Screen name="perfilUsuario" component={PerfilUsuarioScreen} />
    </Stack.Navigator>
  );
}
