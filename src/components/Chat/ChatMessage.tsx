import { IChatMessage } from "types/IChatMessage";
import styles from "./ChatWindow.module.sass";
export default function ChatMessage({
  item,
  uid,
}: {
  item: IChatMessage;
  uid: string | null;
}) {
  const isMsgShouldBeOnLeft = item.from === uid;
  return (
    <li
      className={styles.chatMessage}
      style={{
        justifyContent: `${isMsgShouldBeOnLeft ? "flex-start" : "flex-end"}`,
      }}
    >
      <p
        style={{
          borderBottomLeftRadius: `${isMsgShouldBeOnLeft ? "0px" : "12px"}`,
          borderBottomRightRadius: `${isMsgShouldBeOnLeft ? "12px" : "0px"}`,
          color:`${isMsgShouldBeOnLeft ? "black" : "white"}`,
          backgroundColor: `${isMsgShouldBeOnLeft ? "white" : "#221f1f"}`,
          boxShadow: `${isMsgShouldBeOnLeft ? '3px 3px 3px #a8a3a3' : 'none'}`
        }}
      >
        {item.content}
      </p>
    </li>
  );
}
