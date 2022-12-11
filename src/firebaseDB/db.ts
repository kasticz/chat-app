import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { removeSpacesFromString } from "../logic/utility";
import { ILoginForm } from "types/loginForm";
import { auth } from "./setup";
import { UserData } from "types/userData";
import { IPublicUser } from "types/IPublicUser";
import { IChatMessage } from "types/IChatMessage";

export async function createUser(
  login: string,
  password: string
): Promise<UserCredential> {
  const authRes = await createUserWithEmailAndPassword(
    auth,
    `${removeSpacesFromString(login)}@something.ru`,
    password
  );
  return authRes;
}

export async function loginUser(
  login: string,
  password: string
): Promise<UserCredential> {
  const authRes = await signInWithEmailAndPassword(
    auth,
    `${removeSpacesFromString(login)}@something.ru`,
    password
  );
  return authRes;
}

export async function uploadUserDataToDb(
  form: FormData,
  uid: string,
  idToken: string
): Promise<void> {
  const resp = await fetch(
    `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json?auth=${idToken}`,
    {
      method: "PUT",
      body: JSON.stringify({
        name: form.get("name"),
        surname: form.get("surname"),
        password: form.get("password"),
        login: `${removeSpacesFromString(
          String(form.get("login"))
        )}@something.ru`,
        uid: uid,
      }),
    }
  );
  if (resp.status !== 200) {
    throw new Error("Что то пошло не так. Попробуйте позже");
  }
  const resp2 = await fetch(
    `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/usersPublic/${uid}.json?auth=${idToken}`,
    {
      method: "PUT",
      body: JSON.stringify({
        name: form.get("name"),
        surname: form.get("surname"),
        uid: uid,
      }),
    }
  );
  if (resp2.status !== 200) {
    throw new Error("Что то пошло не так. Попробуйте позже");
  }
}

export async function retrieveUserData(
  uid: string | undefined,
  idToken: string | undefined
): Promise<{ name: string; surname: string; login: string; password: string }> {
  const resp = await fetch(
    `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json?auth=${idToken}`
  );
  const data = await resp.json();
  return data;
}

export async function retrieveUsers(
  userUid: string | undefined
): Promise<IPublicUser[]> {
  const users: { [key: string]: IPublicUser } = await (
    await fetch(
      "https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/usersPublic.json"
    )
  ).json();
  const usersArr = [...Object.values(users)].filter(item => item.uid !== userUid);
  return usersArr;
}

export async function retrieveChatHistory(
  currUserUid: string | undefined,
  secondUserUid: string | null
): Promise<IChatMessage[]> {
  const uidsSorted = [currUserUid, secondUserUid].sort();
  const chatHistory: { [key: number]: IChatMessage } = await (
    await fetch(
      `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/conversations/${uidsSorted[0]}|${uidsSorted[1]}.json`
    )
  ).json();
  return Object.values(chatHistory);
}
