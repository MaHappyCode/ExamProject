import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, } from "react-native";
import { Accelerometer } from "expo-sensors";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const shoesIcon = require("../assets/shoes.png");
const fireIcon = require("../assets/fire.png");

const MainScreen = () => {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isAccelerometerAvailable, setIsAccelerometerAvailable] =
    useState(false);
  const [initialValuesSet, setInitialValuesSet] = useState(false);
  const navigation = useNavigation();
  const weight = 70; // replace with user's weight
  const length = 190;
  const user = auth.currentUser;

  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((isAvailable) => {
      setIsAccelerometerAvailable(isAvailable);
      if (isAvailable && initialValuesSet) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const acceleration = Math.sqrt(
            Math.pow(accelerometerData.x, 2) +
            Math.pow(accelerometerData.y, 2) +
            Math.pow(accelerometerData.z, 2)
          );
          if (acceleration > 1.5) {
            setSteps((steps) => steps + 1);
          }
        });
        Accelerometer.setUpdateInterval(100);
      }
    });
    return () => {
      subscription && subscription.remove();
    };
  }, [initialValuesSet]);

  useEffect(() => {
    const db = getDatabase();
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();

        setSteps(userData?.steps || 0);
        setCalories(userData?.calories || 0);
        setInitialValuesSet(true);
      });
    }
  }, []);

  useEffect(() => {
    const caloriesBurned = ((steps * 0.05 * weight) / length).toFixed(2); // formula to calculate calories burned

    // save the data to Firebase
    const user = auth.currentUser;
    if (user && initialValuesSet) {
      const db = getDatabase();
      set(ref(db, `users/${user.uid}/steps`), steps);
      set(ref(db, `users/${user.uid}/calories`), caloriesBurned);
    }
  }, [steps, weight, initialValuesSet]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Sign In"); // navigate back to SignInScreen after logout
    } catch (error) {
      console.log("Failed to log out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={shoesIcon} style={styles.stepsIcon}/>
      <Text style={styles.stepsTxt}> {steps}</Text>
      <Image source={fireIcon} style={styles.fireIcon}/>
      <Text style={styles.caloriesCounter}> {calories}</Text>

      {!isAccelerometerAvailable && (
        <Text style={styles.accelerationAvilable}>
          Accelerometer is not available on this device
        </Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,

  },
  logoutText: {

    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  stepsTxt: {
    height: 25,
    width: "25%",
    right: 87,
    bottom: 262,
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "auto",
    borderWidth: 1,
    borderRadius: 9.




  },
  caloriesCounter: {
    height: 25,
    width: "25%",
    right: 87,
    bottom: 250,
    fontWeight: "400",
    fontSize: 17,
    textAlign: "auto",
    lineHeight: 25,
    borderWidth: 1,
    borderRadius: 9,
  },

  accelerationAvilable: {

  },
  stepsIcon:{
   height: 46,
   width:46,
   bottom: 235,
   right:170,
   

  },
  fireIcon:{
    height:46,
    width:35,
    bottom:216,
    right:170,
    
  
  

  },

});

export default MainScreen;
