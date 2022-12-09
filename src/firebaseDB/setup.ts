import {getAuth} from 'firebase/auth'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBy6_w2UKt0T0JmxSZtJzuGCIA63MLkEMM",
  authDomain: "chat-b4f6c.firebaseapp.com",
  projectId: "chat-b4f6c",
  storageBucket: "chat-b4f6c.appspot.com",
  messagingSenderId: "1068910446193",
  appId: "1:1068910446193:web:ca7a516dc389ad7b30bdd0"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()