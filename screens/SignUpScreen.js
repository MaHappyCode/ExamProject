import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ImageBackground,
  Header,
  KeyboardAvoidingView,
  InputAccessoryView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
const db = getFirestore();

const backgroundImage = require("../assets/main.jpg");

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setSelectedGender] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");

  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setPickerVisible(false);
  };

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
    setBirthdate(formatDate(currentDate));
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

  const handleSignUp = async () => {
    // Validate form fields
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !gender ||
      !weight ||
      !length
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Implement sign up logic here
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
    try {
      const docRef = await addDoc(collection(db, "users"), {
        firstName,
        lastName,
        birthdate,
        password,
        email,
        gender,
        weight,
        length,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <SafeAreaView style={styles.SAV}>
      <ImageBackground source={backgroundImage} style={styles.imageBackground}>
        <View style={styles.header} />
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={"#d7d7dcd6"}
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Surname"
            placeholderTextColor={"#d7d7dcd6"}
            onChangeText={(text) => setLastName(text)}
            value={lastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#d7d7dcd6"}
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize={"none"}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#d7d7dcd6"}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            autoCapitalize={"none"}
          />
          <TextInput
            style={styles.input}
            placeholder={"Confirm Password"}
            placeholderTextColor={"#d7d7dcd6"}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry={true}
            autoCapitalize={"none"}
          />
          <TextInput
            style={styles.input}
            placeholder={"Legnth"}
            placeholderTextColor={"#d7d7dcd6"}
            onChangeText={(text) => setLength(text)}
            value={length}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder={"Weight"}
            placeholderTextColor={"#d7d7dcd6"}
            onChangeText={(text) => setWeight(text)}
            value={weight}
            returnKeyType="next"
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={showDatePicker}
          >
            <Text style={styles.datePickerLabel}>Select Date of Birth:</Text>
            <Text style={styles.datelabel}>{birthdate || "Select date"}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            style={styles.dateP}
            isVisible={isDatePickerVisible}
            mode="date"
            date={selectedDate}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            textColor="black"
          />

          <TouchableOpacity
            style={styles.selectConatiner}
            onPress={togglePicker}
          >
            <View>
              <Text style={{ color: "#d7d7dcd6" }}>Select gender:</Text>
              <Text style={styles.selectG}>{gender}</Text>
            </View>
          </TouchableOpacity>
          {pickerVisible && (
            <Picker
              style={styles.genderPicker}
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) =>
                handleGenderSelect(itemValue)
              }
            >
              <Picker.Item label="Male" value="Male" color="#ffa913" />

              <Picker.Item label="Female" value="Female" color="#ffa913" />
            </Picker>
          )}

          <TouchableOpacity style={styles.signUpbtn} onPress={handleSignUp}>
            <Text style={styles.signUpTxt}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SAV: {
    flex: 1,
    backgroundColor: "#9a650ab9",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  header: {
    backgroundColor: "#9a650ab9",
    borderBottomWidth: 3,
    borderColor: "#ffffffd1",
    minWidth: "100%",
    height: 70,

    top: 0,
  },
  container: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 1,

    backgroundColor: "#2221215b",
  },

  input: {
    width: "80%",
    height: 50,
    margin: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    backgroundColor: "#1f1e1ea9",
    borderWidth: 1,
    borderColor: "#ffffff",
    color: "#ffffff",
  },

  datePickerLabel: {
    padding: 0,
    fontSize: 18,
    color: "#d7d7dcd6",
  },
  datelabel: {
    fontSize: 18,
    color: "white",
  },
  datePickerContainer: {
    justifyContent: "center",
    minWidth: "80%",
    height: 50,
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    marginVertical: 1,
    borderColor: "#f5f4f1",
    backgroundColor: "#1f1e1ea9",
  },

  selectConatiner: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
    minWidth: "80%",
    marginVertical: 1,
    borderColor: "#f5f4f1",
  },
  selectG: {
    width: 100,
    fontSize: 20,
    fontWeight: "300",
    textAlign: "center",
    color: "white",
  },
  genderPicker: {
    minWidth: "80%",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
  },

  signUpbtn: {
    backgroundColor: "#e29209",
    borderColor: "#ffffff",
    borderWidth: 1.4,
    borderRadius: 7,
    height: 55,
    width: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpTxt: {
    color: "white",
    fontSize: 25,
  },
  accessory: {
    width: 20,
    height: 29,
    backgroundColor: "white",
    color: "black",
  },
});

export default SignUpScreen;
