import { IPublicUser } from "types/IPublicUser";
import { useEffect, useState } from "react";
import { retrieveAvatar } from "firebaseDB/storage";
import noAvatar from "@assets/placeholder.webp";
import styles from "./UserPreview.module.sass";
import { Link } from "react-router-dom";
import { auth } from "firebaseDB/setup";

export default function UserPreview({ item }: { item: IPublicUser }) {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    async function getAvatar() {
      const avatar = await retrieveAvatar(item.uid);
      setUserAvatar(avatar);
    }
    getAvatar();
  },[]);
  return (
    <li>
    <Link
      to={`/chatting?user1=${auth.currentUser?.uid}&user2=${item.uid}`}
      className={styles.userWrapper}
    >
      
        <img src={userAvatar ? userAvatar : noAvatar} alt="userAvatar" />
        <div className={styles.userMsg}>
        <span>{`${item.name} ${item.surname}`}</span>
        <p>Вы ещё не беседовали с данным пользователем</p>
        </div>
        
      
    </Link>
    </li>
  );
}
