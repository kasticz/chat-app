import {createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential} from "firebase/auth"
import { auth } from "./setup";




  export async function createUser(login:string,password:string):Promise<UserCredential>{

    const authRes = await createUserWithEmailAndPassword(auth, `${login}@something.ru`, password)
    return authRes
 
  }

  export async function loginUser(login:string,password:string):Promise<UserCredential>{
    const authRes = await signInWithEmailAndPassword(auth, login, password)
    return authRes
  }
