import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Accelerometer } from "expo-sensors";

const MainScreen = () => {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isAccelerometerAvailable, setIsAccelerometerAvailable] =
    useState(false);

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
  }, [steps, weight]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Steps: {steps}</Text>
      <Text style={{ fontSize: 20 }}>Calories Burned: {calories}</Text>
      {!isAccelerometerAvailable && (
        <Text style={{ fontSize: 16, marginTop: 20 }}>
          Accelerometer is not available on this device
        </Text>
      )}
    </View>
  );
};

export default MainScreen;
