import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { auth } from "../firebase";

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
    <View>
      <TextInput
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Reset password" onPress={handleResetPassword} />
    </View>
  );
};

export default ResetPasswordScreen;
