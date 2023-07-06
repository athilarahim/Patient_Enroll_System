import firebase from 'firebase/app';
import 'firebase/firestore';

// Add your Firebase configuration here
const firebaseConfig = {
  apiKey: "AIzaSyDo-4dzZlR7H2e9qZXFfXuP4LtsuToAt-s",
  authDomain: "dental-practice-management.firebaseapp.com",
  projectId: 'dental-practice-management',
  storageBucket: "dental-practice-management.appspot.com",
  messagingSenderId: "1048076810490",
  appId: "1:1048076810490:web:1a237d5f5a358dc78ab143",
  measurementId: "G-3K74L03CT5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a Firestore reference
const firestore = firebase.firestore();

export default firestore;
