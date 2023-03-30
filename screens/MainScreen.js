import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MainScreen = () => {
  const [steps, setSteps] = useState("");
  const [calories, setCalories] = useState("");

  const [isAccelerometerAvailable, setIsAccelerometerAvailable] =
    useState(false);
  const navigation = useNavigation();
  const weight = 70; // replace with user's weight

  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((isAvailable) => {
      setIsAccelerometerAvailable(isAvailable);
      if (isAvailable) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const acceleration = Math.sqrt(
            Math.pow(accelerometerData.x, 2) +
              Math.pow(accelerometerData.y, 2) +
              Math.pow(accelerometerData.z, 2)
          );
          if (acceleration > 2.1) {
            setSteps((steps) => steps + 1);
          }
        });
        Accelerometer.setUpdateInterval(100);
      }
    });
    return () => {
      subscription && subscription.remove();
    };
  }, []);

  useEffect(() => {
    const caloriesBurned = (steps * 0.05 * weight).toFixed(2); // formula to calculate calories burned
    setCalories(caloriesBurned);

    // save the data locally using AsyncStorage
    AsyncStorage.setItem("steps", steps.toString());
    AsyncStorage.setItem("calories", caloriesBurned.toString());

    // save the data to Firebase
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      set(ref(db, `users/${user.uid}/steps`), steps);
      try {
        set(ref(db, `users/${user.uid}/calories`), caloriesBurned);
      } catch (error) {
        console.log("Failed to update calories in Firebase:", error);
      }
    }
  }, [steps, weight]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();

      // Read the data from Firebase and update the state
      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setSteps(userData?.steps || 0);
        setCalories(userData?.calories || 0);

        // update the local storage
        AsyncStorage.setItem("steps", userData.steps.toString());
        AsyncStorage.setItem("calories", userData.calories.toString());
      });
    } else {
      // retrieve the data from local storage if user is not logged in
      AsyncStorage.getItem("steps").then((value) => {
        setSteps(value ? parseInt(value) : steps || 0);
      });
      AsyncStorage.getItem("calories").then((value) => {
        setCalories(value ? parseFloat(value) : calories || 0);
      });
    }
  }, [auth.currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Sign In"); // navigate back to SignInScreen after logout
    } catch (error) {
      console.log("Failed to log out:", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Steps: {steps}</Text>
      <Text style={{ fontSize: 20 }}>Calories Burned: {calories}</Text>
      {!isAccelerometerAvailable && (
        <Text style={{ fontSize: 16, marginTop: 20 }}>
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
});

export default MainScreen;
