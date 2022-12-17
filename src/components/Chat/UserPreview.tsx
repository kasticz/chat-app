import { IPublicUser } from "types/IPublicUser";
import { useEffect, useState } from "react";
import { retrieveAvatar } from "firebaseDB/storage";
import noAvatar from "@assets/placeholder.webp";
import { Link } from "react-router-dom";
import { auth } from "firebaseDB/setup";
import { useNavigate } from "react-router-dom";
import { retrieveChatHistory } from "firebaseDB/db";
import { IChatMessage } from "types/IChatMessage";
import { getDateAsString } from "logic/utility";
import Spinner from "components/UI/Spinner";
import styles from "./UserPreview.module.sass";


export default function UserPreview({ item }: { item: IPublicUser }) {
  const navigate = useNavigate()
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [lastMsgContentState,setlastMsgContentState] = useState<{msg:string,date: string | Date}>({msg:'',date:new Date()})

  useEffect(() => {
    async function getAvatar() {
      const avatar = await retrieveAvatar(item.uid);
      setUserAvatar(avatar);
    }
    getAvatar();
  },[item.uid]);

  useEffect(()=>{
    async function fetchNewLastMsg(){
      const fetchedLastMsg = await retrieveChatHistory(item.uid,true)
      if(!fetchedLastMsg){
        setlastMsgContentState({msg:'Вы ещё не беседовали с данным пользователем',date: new Date()})
        return
      }
      let lastMsg: IChatMessage = fetchedLastMsg[0]
      if(lastMsg.content === lastMsgContentState.msg) return
      const lastMsgFromThisUser =  lastMsg.from === item.uid
      const finalLastMsg = lastMsgFromThisUser ? `${userName}: ${lastMsg.content}` : `${item.currentUserName}: ${lastMsg.content}`
      const lastMsgDate = lastMsg.date

      setlastMsgContentState({msg:finalLastMsg,date:lastMsgDate})

    }
    fetchNewLastMsg()
    if(!item.botId){
    // setInterval(()=>{
    //   fetchNewLastMsg()
    // },2000)
    }

    
  },[])

  const userName = `${item.name}${item.botId ? '' : ' '}${item.surname}`

 


  return lastMsgContentState.msg ? (
    <li>
    <Link
      to={`/chatting?user1=${auth.currentUser?.uid}&user2=${item.uid}&botId=${item.botId ? item.botId : ''}`}
      className={styles.userWrapper}
    >
      
        <img src={userAvatar ? userAvatar : noAvatar} alt="userAvatar" />
        <div className={styles.userMsg}>
        <span>{userName}</span>
        <p>{lastMsgContentState.msg}</p>
        <p className={styles.msgDate}>{getDateAsString(lastMsgContentState.date)}</p>
        </div>
        
      
    </Link>
    </li>
  ) : <Spinner/>;
}
