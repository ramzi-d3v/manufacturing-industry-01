
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvzxXW-c-KOZR2dnnGnTCqEIIORgAHGYk",
  authDomain: "manufacturing-industry-01.firebaseapp.com",
  projectId: "manufacturing-industry-01",
  storageBucket: "manufacturing-industry-01.firebasestorage.app",
  messagingSenderId: "994519760806",
  appId: "1:994519760806:web:a54adf6b02e3c5043c5967",
  measurementId: "G-1J53Y1YPNR"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
