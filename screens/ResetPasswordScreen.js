import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { auth } from "../firebase";

const backgroundImage = require("../assets/reset.jpg");
const ResetPasswordScreen = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset sent please check your email!");
      })
      .catch((error) => {
        alert("No user found with that email");
      });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.titles}>Type your email to reset the password</Text>

        <TextInput
          style={styles.input}
          placeholder=" Email address"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity onPress={handleResetPassword} style={styles.btn}>
          <Text style={styles.btnText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  titles: {
    fontSize: 40,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    fontWeight: "300",
    bottom: 190,
  },

  input: {
    borderWidth: 1.5,
    borderColor: "grey",
    backgroundColor: "white",
    height: 45,
    width: 290,
    borderRadius: 5,
    fontSize: 20,
    bottom: 150,
  },
  btn: {
    justifyContent: "center",
    bottom: 70,
    width: 200,
    borderRadius: 5,
    height: 50,
    backgroundColor: "#401209",
    borderWidth: 1.5,
    borderColor: "white",
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
});

export default ResetPasswordScreen;
