import { signInWithCredential, signInWithEmailAndPassword } from "firebase/auth"
import { retrieveUserData } from "firebaseDB/db"
import { APIKEY, auth } from "firebaseDB/setup"


export async  function silentAuthWithRefreshToken(rt:string | null): Promise<{name:string,surname:string}>{
    const resp = await fetch(`https://securetoken.googleapis.com/v1/token?key=${APIKEY}`,{
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token:rt 
        })
      })
      if(resp.status !== 200){
        throw new Error('Что то пошло не так. Попробуйте позже.')
      }
      const authData: {user_id:string,id_token:string} = await resp.json()
      const uid = authData.user_id
      const idToken = authData.id_token

      const userData = await retrieveUserData(uid,idToken)
      await signInWithEmailAndPassword(auth,userData.login,userData.password)
      return {name:userData.name,surname:userData.surname}
}