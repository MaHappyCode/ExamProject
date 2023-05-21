// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCtqNkBEKxK_Ajlp2hPGFujMKUzFbxXYV8",
  authDomain: "fir-b1f12.firebaseapp.com",
  projectId: "fir-b1f12",
  storageBucket: "fir-b1f12.appspot.com",
  messagingSenderId: "1093580358710",
  appId: "1:1093580358710:web:3b9472430f9ad244730497",
  databaseURL: "https://fir-b1f12-default-rtdb.firebaseio.com/",


});

// Initialize Firebase
const auth = getAuth(firebaseApp);

const firestore = getFirestore(firebaseApp);
const database = getDatabase(firebaseApp);


let userToken = null;



export { auth, firestore, database, };
