import { createStackNavigator } from "@react-navigation/stack";
import homescreen from "../../src/screens/homescreens";

export type RootStackParamList = {
  homescreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="homescreen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="homescreen"
        component={homescreen}
      />
    </Stack.Navigator>
  );
}