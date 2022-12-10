import {createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential} from "firebase/auth"
import { ILoginForm } from "types/loginForm";
import { auth } from "./setup";




  export async function createUser(login:string,password:string):Promise<UserCredential>{

    const authRes = await createUserWithEmailAndPassword(auth, `${login}@something.ru`, password)
    return authRes
 
  }

  export async function loginUser(login:string,password:string):Promise<UserCredential>{
    const authRes = await signInWithEmailAndPassword(auth, `${login}@something.ru`, password) 
    return authRes
  }


  export async function uploadUserDataToDb(form:FormData,uid:string,idToken:string):Promise<void>{
    const resp = await fetch(`https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json?auth=${idToken}`,{
      method: 'PUT',
      body: JSON.stringify({
        name:form.get('name'),
        surname: form.get('surname')
      })
    })
    if(resp.status !== 200){
      throw new Error('Что то пошло не так. Попробуйте позже')
    }
  }

  export async function retrieveUserData(uid:string,idToken:string){
    const resp = await fetch(`https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json?auth=${idToken}`)
    const data = await resp.json()
    return data
  }