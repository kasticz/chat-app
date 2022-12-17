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
import { retrieveAvatar } from "./storage";
import { IDataForMainComponent } from "types/components/IDataForMainComponent";
import { IBotReply } from "types/IBotReply";

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
): Promise<{ name: string; surname: string; login: string; password: string,botId?:boolean }> {
  const resp = await fetch(
    `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json?auth=${idToken}`
  );
  if (resp.status !== 200) {
    throw new Error("Что то пошло не так. Попробуйте позже.");
  }
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
  const usersArr = [...Object.values(users)].filter(
    (item) => item.uid !== userUid
  );
  return usersArr;
}
export async function retrieveUserName(
  userUid: string | undefined
): Promise<string> {
  const user: { name: string; surname: string; uid: string,botId?:boolean } = await (
    await fetch(
      `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/usersPublic/${userUid}.json`
    )
  ).json();
  const userName = `${user.name}${user.botId ? '': ' '}${user.surname}`;
  return userName;
}

export async function retrieveChatHistory(
  secondUserUid: string | null,
  onlyLastMsg: boolean
): Promise<IChatMessage[] | null> {
  const currUserUid = String(auth.currentUser?.uid);
  const uidsSorted = [currUserUid, secondUserUid].sort();
  const chatHistoryData: { [key: string]: {msg:IChatMessage} } | null = await (
    await fetch(
      `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/conversations/${uidsSorted[0]}|${uidsSorted[1]}.json`
    )
  ).json();
  if (!chatHistoryData) return null;
  const chatHistory = Object.values(chatHistoryData);
  return onlyLastMsg ? [chatHistory[chatHistory.length - 1].msg] : chatHistory.map(item => item.msg);
}

export async function fetchAllDataForMainComponent(): Promise<IDataForMainComponent> {
  const uid = auth.currentUser?.uid;
  const idToken = await auth.currentUser?.getIdToken();
  const userData = await retrieveUserData(uid, idToken);
  const avatar = await retrieveAvatar(uid);
  let users = await retrieveUsers(uid);

  users = users.map((item) => {
    item.currentUserName = `${userData.name}${userData.botId ? '' : ' '}${userData.surname}`;
    return item;
  });

  const res: IDataForMainComponent = {
    currUserFullName: `${userData.name}${userData.botId ? '' :' '}${userData.surname}`,
    avatar,
    users,
  };

  return res;
}

export async function uploadMsgToDb(msg: IChatMessage) {
  const sortedUids = [msg.from, msg.to].sort();

  const uploadResp = await fetch(
    `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/conversations/${sortedUids[0]}|${sortedUids[1]}.json`,{
      method: "POST",
      body: JSON.stringify({
        msg,
      }),
      headers:{
        'Content-type':'application/json'
      }
    }
  );
  if(uploadResp.status !== 200) throw new Error()
}




export async function getBotReply(botId:string,conversationId:string | null,msg:IChatMessage):Promise<IBotReply>{
  const resp = await fetch('https://www.botlibre.com/rest/json/chat',{
    method:'POST',
    body: JSON.stringify({
      application: '2881031034935656442' ,
      instance: botId,
      message: msg.content,
      conversation: conversationId ? conversationId : ''
    }),
    headers:{
      'Content-type': 'application/json'
    }
  })
  if(resp.status !== 200){
    throw new Error()
  }
  const res: {conversation:string,message:string} = await resp.json()
  const typedRes: IBotReply = {
    conversation:res.conversation,
    from: msg.to,
    to:msg.from,
    content: res.message,
    date: new Date()
  }

  const sortedUids = [msg.from, msg.to].sort();
  const uploadResp = await fetch(
    `https://chat-b4f6c-default-rtdb.europe-west1.firebasedatabase.app/conversations/${sortedUids[0]}|${sortedUids[1]}.json`,{
      method: "POST",
      body: JSON.stringify({
        msg:typedRes,
      }),
      headers:{
        'Content-type':'application/json'
      }
    }
  );
  if(uploadResp.status !== 200){
    throw new Error()
  }
  return typedRes
}