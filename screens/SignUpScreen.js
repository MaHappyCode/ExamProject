import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");

  const showDatePicker = () => {
    setMode("date");
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setSelectedDate(currentDate);
    hideDatePicker();
  };

  const formatDate = (
    date,
    minYear = 1900,
    maxYear = new Date().getFullYear()
  ) => {
    const year = Math.min(Math.max(date.getFullYear(), minYear), maxYear);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  };

  const handleSignUp = () => {
    // Validate form fields
    if (
      !email ||
      !confirmEmail ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Implement sign up logic here
    if (email !== confirmEmail) {
      alert("Confirm Email must match Email ");
      return;
    }

    if (password !== confirmPassword) {
      alert("Confirm Password must match Password ");
      return;
    }

    // Sign up with Firebase

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode == "auth/email-already-in-use") {
          alert("Email already in use");
        } else if (errorCode == "auth/invalid-email") {
          alert("Invalid email");
        } else if (errorCode == "auth/weak-password") {
          alert("Password must be at least 6 character");
        }
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Surname"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Email"
        onChangeText={(text) => setConfirmEmail(text)}
        value={confirmEmail}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        placeholder={"Confirm Password"}
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry={true}
        autoCapitalize={"none"}
      />

      <TouchableOpacity
        style={styles.datePickerContainer}
        onPress={showDatePicker}
      >
        <Text style={styles.datePickerLabel}>Select Date of Birth:</Text>
        <Text style={styles.datelabel}>
          {formatDate(selectedDate, 1900, new Date().getFullYear())}
        </Text>
      </TouchableOpacity>

      <Button title="Sign Up" onPress={handleSignUp} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 50,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  datePickerLabel: {
    padding: 0,
    fontSize: 18,
  },
  datelabel: {
    fontSize: 18,
    marginHorizontal: 14,
  },
  datePickerContainer: {
    width: "80%",
    height: 50,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
});

export default SignUpScreen;
