
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC2GJ4GYDlKiZIc27GLSOwGK5DQr7qmiV4",
  authDomain: "video-60454.firebaseapp.com",
  projectId: "video-60454",
  storageBucket: "video-60454.appspot.com",
  messagingSenderId: "105602972015",
  appId: "1:105602972015:web:3f59f0291079ee3c4a909a",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
