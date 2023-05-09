import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const backgroundImage = require("../assets/main.jpg");
const logo = require("../assets/logo.png");

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        navigation.navigate("MainScreen");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setIsAuthenticated(true);
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Step-Burner</Text>
          <Text style={styles.subtitle}>Sign In</Text>
        </View>
        <View style={styles.inputContainer}>
          <Feather name="user" size={24} color="#ffffff" style={styles.icon}>
            <Text>|</Text>
          </Feather>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            placeholderTextColor={"#d7d7d7"}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={24} color="#ffffff" style={styles.icon}>
            <Text>|</Text>
          </Feather>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Password"
            placeholderTextColor={"#d7d7d7"}
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Sign Up")}
          style={styles.secondaryButtonContainer}
        >
          <View style={styles.secondaryButton}>
            <Feather
              name="user-plus"
              size={24}
              color="#fffdfd"
              style={styles.secondaryButtonIcon}
            />
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignIn} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Reset password")}
          style={styles.secondaryButtonContainer}
        >
          <View style={styles.secondaryButton}>
            <Feather
              name="lock"
              size={24}
              color="#ffffff"
              style={styles.secondaryButtonIcon}
            />
            <Text style={styles.secondaryButtonText}>Reset Password</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 130,
    height: 100,
    left: 130,
    top: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    bottom: 80,
  },
  title: {
    fontSize: 60,
    top: 40,
    textAlign: "center",
    color: "white",
    fontWeight: "400",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 25,
    top: 95,
    textAlign: "center",
    color: "white",
    fontWeight: "400",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderWidth: 1.9,
    borderColor: "#ffffff",
    borderRadius: 6,
    paddingLeft: 10,
    backgroundColor: "#131111a5",
   width:279,
  },
  input: {
    height: 40,
    width: 200,
    color: "white",
    right: 20,
    fontSize: 17,
  },

  icon: {
    right: 20,
  },

  buttonContainer: {
    backgroundColor: "#e29209",
    borderColor: "white",
    top: 15,
    borderWidth: 1.4,
    borderRadius: 7,
    height: 55,
    minWidth: "65%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17.5,
    fontWeight: "300",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  secondaryButtonContainer: {
    justifyContent: "center",
    alignContent: "center",

    top: 150,
  },

  secondaryButton: {
    left: "3%",
  },
  secondaryButtonIcon: {
    right: 30,
    top: 21,
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 19,
  },
});
export default SignInScreen;
