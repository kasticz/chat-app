import {getAuth} from 'firebase/auth'
import { initializeApp } from "firebase/app";
export const APIKEY = "AIzaSyBy6_w2UKt0T0JmxSZtJzuGCIA63MLkEMM"

const firebaseConfig = {
  apiKey:APIKEY ,
  authDomain: "chat-b4f6c.firebaseapp.com",
  projectId: "chat-b4f6c",
  storageBucket: "chat-b4f6c.appspot.com",
  messagingSenderId: "1068910446193",
  appId: "1:1068910446193:web:ca7a516dc389ad7b30bdd0"
};


export const app = initializeApp(firebaseConfig);

export const auth = getAuth()

