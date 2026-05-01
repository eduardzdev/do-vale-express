import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: O usuário deve substituir estas chaves pelas reais fornecidas pelo Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMVk8aUMtNwZTbKxzstC2O99hmh55_A9g",
  authDomain: "mapa-express.firebaseapp.com",
  projectId: "mapa-express",
  storageBucket: "mapa-express.firebasestorage.app",
  messagingSenderId: "106604237209",
  appId: "1:106604237209:web:f2b513791fb233a2828308",
  measurementId: "G-1JFB6ECMNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
