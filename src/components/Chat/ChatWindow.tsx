import { Navigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { auth } from "firebaseDB/setup";
import {
  retrieveChatHistory,
  retrieveUserName,
  uploadMsgToDb,
} from "firebaseDB/db";
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [chatHistoryState, setChatHistoryState] = useState<IChatMessage[] | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const chatWindowRef = useRef<HTMLUListElement>(null)
  const dummyDivToScrollRef = useRef<HTMLDivElement>(null)

  const [queryParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    async function getChatHistory() {
      const chatHistory = await retrieveChatHistory(queryParams.get("user2"), false);
      if(chatHistory?.length === chatHistoryState?.length) return
      if (!chatHistory) {
        setChatHistoryState(null);
        return;
      }
      setChatHistoryState(chatHistory);
    }
    async function getAvatar() {
      const avatar = await retrieveAvatar(String(queryParams.get("user2")));
      setAvatar(avatar ? avatar : noAvatar);
    }
    async function getUserName() {
      setUserName(await retrieveUserName(String(queryParams.get("user2"))));
    }
    if (!auth.currentUser) {
      navigate(
        `/?redirect=chatting?${location.search.slice(1).replace("&", "|")}`
      );
    } else {
      try {
        getUserName();
        getChatHistory();
        setInterval(()=>{
            getChatHistory();
        },2000)
        getAvatar();
      } catch (err) {
        navigate("/");
      }
    }
  }, [navigate, queryParams, location.search]);

  const chatHistoryList = useMemo(() => {
    const secondUid = queryParams.get("user2");
    return chatHistoryState
      ? chatHistoryState.map((item) => {
          return (
            <ChatMessage
              uid={secondUid}
              item={item}
              key={item.date.toLocaleString()}
            />
          );
        })
      : [
          <ChatMessage
            uid={secondUid}
            item={{ from: null, to: null, date: new Date(), content: "" }}
            key={Math.random()}
          />,
        ];
  }, [chatHistoryState, queryParams]);

  async function sendMsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const msgText = inputRef.current?.value;
    if (!msgText) return;
    try {
      const msg: IChatMessage = {
        from: String(queryParams.get("user1")),
        to: String(queryParams.get("user2")),
        content: String(msgText),
        date: new Date(),
      };
      await uploadMsgToDb(msg);
      setChatHistoryState((prevState) => {
        if (!prevState) return [msg];
        return [...prevState, msg];
      });
      setTimeout(() => {
        dummyDivToScrollRef.current?.scrollIntoView({behavior:'smooth'})         
      }, 200);
           
    } catch (err) {
      setError("Что то пошло не так. Попробуйте позже");
    }
  }
  dummyDivToScrollRef.current?.scrollIntoView({behavior:'smooth'})
  

  return avatar && chatHistoryList && userName ? (
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
      <ul ref={chatWindowRef} className={styles.chatWindow}>{error ? error : chatHistoryList} <div ref={dummyDivToScrollRef}></div></ul>
      <form onSubmit={sendMsg} className={styles.messageInputWrapper}>
        <textarea placeholder="Наберите сообщение" ref={inputRef} />
        <button>
          <img src={sendMSGIcon} alt="sendMessage" />
        </button>
      </form>
    </main>
  ) : (
    <Spinner />
  );
}
