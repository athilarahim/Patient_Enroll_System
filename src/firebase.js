import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'

// Add your Firebase configuration here
const firebaseConfig = {
  apiKey: "AIzaSyAirNto64jbzZSKca6hTyfBhbRhJnUXT0w",
  authDomain: "dms-test-6ec95.firebaseapp.com",
  projectId: "dms-test-6ec95",
  storageBucket: "dms-test-6ec95.appspot.com",
  messagingSenderId: "296317726939",
  appId: "1:296317726939:web:0c1fcf1a4f1ba915dbdcfe",
  measurementId: "G-ZKRXKLSDSY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a Firestore reference
const firestore = firebase.firestore();

const firebaseExports = {firebase,firestore}

export default firebaseExports;

