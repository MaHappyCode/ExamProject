import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, } from "react-native";
import { Accelerometer } from "expo-sensors";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";


const shoesIcon = require("../assets/shoes.png");
const fireIcon = require("../assets/fire.png");

const MainScreen = () => {
  const [todo, setTodo] = useState("");
  const [text, setText] = useState("");
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isAccelerometerAvailable, setIsAccelerometerAvailable] =
    useState(false);
  const [initialValuesSet, setInitialValuesSet] = useState(false);
  const navigation = useNavigation();
  const user = auth.currentUser;
  const addTodo = () => {
    if (text) {
      setTodo([...todo, text])
      setText("");
    }
  };

  const deleteTodo = (index) => {
    const newTodo = [...todo];
    newTodo.splice(index, 1);
    setTodo(newTodo);
  };

  const weight = 75;
  const length = 182;

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
        const weight = userData?.weight || 75; // Default weight is 75
        const length = userData?.length || 182; // D
        setSteps(userData?.steps || 0);
        setCalories(((userData?.steps || 0) * 0.05 * weight) / length);
   
        setInitialValuesSet(true);
      });
    }
  }, []);

  useEffect(() => {
    const caloriesBurned = ((steps * 0.05 * weight) / length).toFixed(2);

    const user = auth.currentUser;
    if (user && initialValuesSet) {
      const db = getDatabase();
      set(ref(db, `users/${user.uid}/steps`), steps);
      set(ref(db, `users/${user.uid}/calories`), caloriesBurned);
    }
  }, [steps, weight, length, initialValuesSet]);


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
      <Text style={styles.caloriesCounter}> {calories !== null ? calories.toFixed(2) : '0.00'}</Text>

      {!isAccelerometerAvailable && (
        <Text style={styles.accelerationAvilable}>
          Accelerometer is not available on this device
        </Text>
      )}
        <View style={styles.box}>
        <Text style={styles.title}>Todo List</Text>
       
       <FlatList
       data={todo}
        renderItem={({ item, index }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item}</Text>
            <TouchableOpacity onPress={() => deleteTodo(index)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  
    <TextInput style={styles.inputTask}
        placeholder="Add a task..."
        value={text}
        onChangeText={(value) => setText(value)}
        />
       <TouchableOpacity style={styles.addTaskBTN} onPress={addTodo}>
        <Text style={styles.addBTN}>+</Text>
       </TouchableOpacity>

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
    bottom: 22,
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
    bottom: 20,
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
   bottom: 0,
   right:170,
   

  },
  fireIcon:{
    height:46,
    width:35,
    top:10,
    right:170,
  },
box:{
borderWidth:1,
height:"40%",
top:100,
width:350,
borderRadius:10,
backgroundColor:"white",

},

title:{
left:10,
bottom: 0,
fontSize:25,
fontWeight:"300",

},
inputTask:{
  minWidth:"70%",
  height: 40,
  top:58,
  right:24,
  borderRadius:10,
  backgroundColor:"white",
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 10,
  paddingHorizontal: 10,
},
addTaskBTN:{
borderWidth:1,
height: 40,
width: 40,
borderRadius:15,
alignContent:"center",
alignItems:"center",
top:8,
marginLeft:295,
backgroundColor:"#068cad",

},
addBTN:{
  color:"white",
 bottom:10,
 fontSize:43,
 fontWeight:"300",
},

todoItem:{
  top:20,
  paddingHorizontal:10,
  
},

todoText:{
 width:105,
  top:1

},

removeButtonText:{
marginLeft:270,
bottom:15,
borderWidth:1,
borderRadius:5,

},

});

export default MainScreen;
