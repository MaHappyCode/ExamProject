// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseApp = initializeApp ({
  apiKey: "AIzaSyCtqNkBEKxK_Ajlp2hPGFujMKUzFbxXYV8",
  authDomain: "fir-b1f12.firebaseapp.com",
  projectId: "fir-b1f12",
  storageBucket: "fir-b1f12.appspot.com",
  messagingSenderId: "1093580358710",
  appId: "1:1093580358710:web:3b9472430f9ad244730497"
});

// Initialize Firebase
const auth = getAuth(firebaseApp);


//Detect auth state
onAuthStateChanged(auth, user => {
  if (user === null) {
    console.log('No user!');
  } else {
    console.log('logged in!');
  }
});

export { auth };