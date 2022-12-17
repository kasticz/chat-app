import { IChatMessage } from "types/IChatMessage";
import { getDateAsString } from "logic/utility";
import { useState } from "react";
import styles from "./ChatWindow.module.sass";
export default function ChatMessage({
  item,
  uid,
}: {
  item: IChatMessage;
  uid: string | null;
}) {
  const [date, setDate] = useState<string>("");
  const isMsgShouldBeOnLeft = item.from === uid;
  function showDate() {}
  return item.content ? (
    <li
      className={styles.chatMessage}
      style={{
        justifyContent: `${isMsgShouldBeOnLeft ? "flex-start" : "flex-end"}`,
      }}
    >
      <p
        onMouseEnter={() => {
          setDate(getDateAsString(item.date || new Date()));
        }}
        onMouseLeave={() => {
          setDate("");
        }}
        className={styles.msg}
        style={{
          borderBottomLeftRadius: `${isMsgShouldBeOnLeft ? "0px" : "12px"}`,
          borderBottomRightRadius: `${isMsgShouldBeOnLeft ? "12px" : "0px"}`,
          color: `${isMsgShouldBeOnLeft ? "black" : "white"}`,
          backgroundColor: `${isMsgShouldBeOnLeft ? "white" : "#221f1f"}`,
          boxShadow: `${isMsgShouldBeOnLeft ? "3px 3px 3px #a8a3a3" : "none"}`,
        }}
      >
        {item.content}
        <span
          style={{
            left: isMsgShouldBeOnLeft ? 0 : "auto",
            right: isMsgShouldBeOnLeft ? "auto" : 0,
          }}
          className={styles.msgDate}
        >
          {date}
        </span>
      </p>
    </li>
  ) : (
    <li style={{ fontSize: "20px", textAlign: "center" }}>
      Вы не обменивались сообщениями с этим пользователем
    </li>
  );
}
