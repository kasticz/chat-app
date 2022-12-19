import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { auth } from "firebaseDB/setup";
import {
  getBotReply,
  retrieveChatHistory,
  retrieveUserName,
  uploadMsgToDb,
} from "firebaseDB/db";
import { useNavigate, useLocation } from "react-router-dom";
import { IChatMessage } from "types/IChatMessage";
import noAvatar from "@assets/placeholder.png";
import arrowLogout from "@assets/arrowLogout.svg";
import styles from "./ChatWindow.module.sass";
import { retrieveAvatar } from "firebaseDB/storage";
import Spinner from "components/UI/Spinner";
import sendMSGIcon from "@assets/sendMSG.png";
import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [chatHistoryState, setChatHistoryState] = useState<
    IChatMessage[] | null
  >(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const chatWindowRef = useRef<HTMLUListElement>(null);
  const dummyDivToScrollRef = useRef<HTMLDivElement>(null);
  const [botConversationId, setBonConversationId] = useState<string | null>(
    null
  );

  const [queryParams] = useSearchParams();
  const location = useLocation();

  const botId = queryParams.get('botId')
  const user2 = String(queryParams.get('user2'))


  useEffect(() => {
    async function getChatHistory() {
      const chatHistory = await retrieveChatHistory(
        user2,
        false
      );
      if (chatHistory?.length === chatHistoryState?.length) return;
      if (!chatHistory) {
        setChatHistoryState(null);
        return;
      }
      setChatHistoryState(chatHistory);
    }
    async function getAvatar() {
      const avatar = await retrieveAvatar(user2);
      setAvatar(avatar ? avatar : noAvatar);
    }
    async function getUserName() {
      setUserName(await retrieveUserName(user2));
    }
    if (!auth.currentUser) {
      navigate(
        `/?redirect=chatting?${location.search.slice(1).replaceAll("&", "|")}`
      );
    } else {
      try {
        getUserName();
        getChatHistory();
        if(!botId){
        setInterval(()=>{
          getChatHistory();
        },2000)
        }
        getAvatar();
      } catch (err) {
        navigate("/");
      }
    }
  }, [navigate, botId,user2, location.search]);



  const chatHistoryList = useMemo(() => {
    return chatHistoryState
      ? chatHistoryState.map((item) => {
          return (
            <ChatMessage
              uid={user2}
              item={item}
              key={item.date instanceof Date ? item.date.toISOString() : item.date }
            />
          );
        })
      : [
          <ChatMessage
            uid={user2}
            item={{ from: null, to: null, date: new Date(), content: "" }}
            key={Math.random()}
          />,
        ];
  }, [chatHistoryState,user2]);

  async function sendMsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const msgText = inputRef.current?.value;
    inputRef.current?.focus()
    if (!msgText) return;
    try {
      const msg: IChatMessage = {
        from: String(auth.currentUser?.uid),
        to: user2,
        content: String(msgText),
        date: new Date(),
      };
      await uploadMsgToDb(msg);
      setChatHistoryState((prevState) => {
        if (!prevState) return [msg];
        return [...prevState, msg];
      });
      inputRef.current.value = '';
      setTimeout(() => {
        dummyDivToScrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
      if (botId) {
        const reply = await getBotReply(String(botId),botConversationId,msg);
        if (!botConversationId) setBonConversationId(reply.conversation);
        setChatHistoryState((prevState)=>{
          if (!prevState) return [reply];
          return [...prevState, reply];
        })
      }
      setTimeout(() => {
        dummyDivToScrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      setError("Что то пошло не так. Попробуйте позже");
    }
  }
  dummyDivToScrollRef.current?.scrollIntoView({ behavior: "smooth" });

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
      <ul ref={chatWindowRef} className={styles.chatWindow}>
        {error ? error : chatHistoryList} <div ref={dummyDivToScrollRef}></div>
      </ul>
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
