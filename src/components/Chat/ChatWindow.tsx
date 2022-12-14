import { Navigate, useSearchParams } from "react-router-dom";
import { useState, useEffect,useRef } from "react";
import { auth } from "firebaseDB/setup";
import { retrieveChatHistory, retrieveUserName } from "firebaseDB/db";
import { useNavigate, useLocation } from "react-router-dom";
import { IChatMessage } from "types/IChatMessage";
import noAvatar from "@assets/placeholder.webp";
import arrowLogout from "@assets/arrowLogout.svg";
import styles from "./ChatWindow.module.sass";
import { retrieveAvatar } from "firebaseDB/storage";
import Spinner from "components/UI/Spinner";
import sendMSGIcon from "@assets/sendMSG.png";
import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [chatHistoryState, setChatHistoryState] = useState<
    IChatMessage[] | null
  >(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [chatHistoryListState, setChatHistoryListState] = useState<
    JSX.Element[] | null
  >(null);
  const [queryParams] = useSearchParams();
  const location = useLocation();
  useEffect(() => {
    async function getChatHistory() {
      const secondUserUid = queryParams.get("user2");

      const chatHistory = await retrieveChatHistory(secondUserUid, false);
      if (chatHistoryState && chatHistory?.length !== chatHistoryState.length) {
        return;
      }
      if (!chatHistory) {
        setChatHistoryState(null);
        setChatHistoryListState(null);
        return;
      }
      setChatHistoryState(chatHistory);
      const chatHistoryList = chatHistory.map((item) => {
        return (
          <ChatMessage uid={secondUserUid} item={item} key={Math.random()} />
        ); // change key to date
      });
      setChatHistoryListState(chatHistoryList);
    }
    async function getAvatar() {
      const avatar = await retrieveAvatar(String(queryParams.get("user2")));
      setAvatar(avatar ? avatar : noAvatar);
    }
    async function getUserName() {
      const userName = await retrieveUserName(String(queryParams.get("user2")));
      setUserName(userName);
    }
    if (!auth.currentUser) {
      navigate(
        `/?redirect=chatting?${location.search.slice(1).replace("&", "|")}`
      );
    } else {
      try {
        getUserName();
        getChatHistory();
        // setInterval(()=>{
        //     getChatHistory();
        // },2000)
        getAvatar();
      } catch (err) {
        // navigate("/");
      }
    }
  }, [navigate, queryParams, location.search]);

  function sendMsg(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    console.log(inputRef.current?.value)


  }

  return chatHistoryState && avatar && chatHistoryListState && userName ? (
    <main className={styles.chatWindowWrapper}>
      <header className={styles.userToChatPanel}>
        <a href="/main">
          <img className={styles.logoutArrow} src={arrowLogout} alt="" />
        </a>
        <img
          className={styles.userToChatAvatar}
          src={avatar}
          alt="UserAvatar"
        />
        <p>{userName}</p>
      </header>
      <ul className={styles.chatWindow}>{chatHistoryListState}</ul>
      <form onSubmit={sendMsg} className={styles.messageInputWrapper}>
        <textarea placeholder='Наберите сообщение' ref={inputRef}  />
        <button>
          <img src={sendMSGIcon} alt="sendMessage" />
        </button>
      </form>
    </main>
  ) : (
    <Spinner />
  );
}
