import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true); // set authentication status to true
        navigation.navigate("MainScreen");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setIsAuthenticated(true); // set authentication status to true
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  // check authentication status before rendering the screen

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 40, fontWeight: "300", textAlign: "center" }}>
          Sign In
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 5,
          paddingLeft: 10,
        }}
      >
        <Feather
          name="user"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={{ height: 40, width: 200 }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 5,
          paddingLeft: 10,
        }}
      >
        <Feather
          name="lock"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={{ height: 40, width: 200 }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity
        onPress={handleSignIn}
        style={{
          backgroundColor: "blue",
          marginTop: 10,
          borderWidth: 1,
          borderRadius: 10,
          padding: 5,
        }}
      >
        <Text style={{ color: "white", padding: 5 }}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Sign Up")}
        style={{ marginTop: 10, borderWidth: 1, borderRadius: 10, padding: 5 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather
            name="user-plus"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text>Sign Up</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Reset password")}
        style={{ marginTop: 10, borderWidth: 1, borderRadius: 10, padding: 5 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather
            name="lock"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text>Reset Password</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;
