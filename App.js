import { NavigationContainer } from "@react-navigation/native";
import {
  HeaderStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MainScreen from "./screens/MainScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Sign In"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sign Up"
          component={SignUpScreen}
          options={{
            headerTransparent: true,
            gestureEnabled: false,
            headerStyle: {
              height: 100,
            },

            headerTitleStyle: {
              fontSize: 45,
              bottom: 2,
              textAlign: "center",
              color: "white",
              fontWeight: "400",
              textShadowColor: "black",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            },

            headerBackTitleStyle: {
              fontSize: 26,
              textAlign: "center",
              color: "white",
              textShadowColor: "black",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            },
            headerTintColor: "red",
          }}
        />
        <Stack.Screen
          name="Reset password"
          component={ResetPasswordScreen}
          options={{
            headerStyle: {
              backgroundColor: "#712010",
            },

            headerTitleStyle: {
              color: "white",
              fontSize: 24,
            },

            headerBackTitleStyle: {
              color: "white",
              fontSize: 19,
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
