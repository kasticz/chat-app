import { IPublicUser } from "types/IPublicUser";
import { useEffect, useState } from "react";
import { retrieveAvatar } from "firebaseDB/storage";
import noAvatar from "@assets/placeholder.webp";
import styles from "./UserPreview.module.sass";
import { Link } from "react-router-dom";
import { auth } from "firebaseDB/setup";
import { useNavigate } from "react-router-dom";
import { retrieveChatHistory } from "firebaseDB/db";
import { IChatMessage } from "types/IChatMessage";
import Spinner from "components/UI/Spinner";


export default function UserPreview({ item }: { item: IPublicUser }) {
  const navigate = useNavigate()
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [lastMsgContentState,setlastMsgContentState] = useState<string>('')

  useEffect(() => {
    async function getAvatar() {
      const avatar = await retrieveAvatar(item.uid);
      setUserAvatar(avatar);
    }
    if (!auth.currentUser) {
      navigate("/");
    } else {
      getAvatar();
    }
  },[item.uid]);

  useEffect(()=>{
    async function fetchNewLastMsg(){
      const fetchedLastMsg = await retrieveChatHistory(item.uid,true)
      if(!fetchedLastMsg){
        setlastMsgContentState('Вы ещё не беседовали с данным пользователем')
        return
      }
      let lastMsg: IChatMessage = fetchedLastMsg[0]
      if(lastMsg.content === lastMsgContentState) return
      const lastMsgFromThisUser =  lastMsg.from === item.uid
      const finalLastMsg = lastMsgFromThisUser ? `${userName}: ${lastMsg.content}` : `${item.currentUserName}: ${lastMsg.content}`

      setlastMsgContentState(finalLastMsg)

    }
    fetchNewLastMsg()
    // setInterval(()=>{
    //   fetchNewLastMsg()
    // },5000)
    
  },[])

  const userName = `${item.name} ${item.surname}`

 


  return lastMsgContentState ? (
    <li>
    <Link
      to={`/chatting?user1=${auth.currentUser?.uid}&user2=${item.uid}`}
      className={styles.userWrapper}
    >
      
        <img src={userAvatar ? userAvatar : noAvatar} alt="userAvatar" />
        <div className={styles.userMsg}>
        <span>{userName}</span>
        <p>{lastMsgContentState} </p>
        </div>
        
      
    </Link>
    </li>
  ) : <Spinner/>;
}
