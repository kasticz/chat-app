import { auth } from "../../firebaseDB/setup";
import { useEffect, useState } from "react";
import { fetchAllDataForMainComponent} from "firebaseDB/db";
import { useNavigate } from "react-router";
import Spinner from "components/UI/Spinner";
import UserPreview from "./UserPreview";
import avatarPlaceholder from '@assets/placeholder.webp'
import styles from "./Main.module.sass";

export default function Main() {
  const [userName, setUserName] = useState<string>();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [usersList, setUsersList] = useState<null | JSX.Element[]>(null);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("refreshToken");
    navigate("/");
  }
  useEffect(() => {
    async function getUserData() {
      try {
        const data = await fetchAllDataForMainComponent()
        console.log(data.users)
        const usersPreviewList = data.users.map((item) => {
          return <UserPreview key={item.uid} item={item}/>;
        });
        setUsersList(usersPreviewList);
        setUserName(data.currUserFullName);
        setAvatar(data.avatar);
      } catch (err) {
        logout();
      }
    }
    if (!auth.currentUser) {
      navigate("/");
    } else {
      getUserData();
    }
  },[]);
  return userName ? (
    <div className={styles.chatWrapper}>
      <header className={styles.chatHeader}>
        <img src={avatar ? avatar : avatarPlaceholder} alt="UserAvatar" />
        <div className={styles.userName}>
          <p>{userName}</p>
          <span>Сейчас онлайн</span>
        </div>
        <button onClick={logout}>Выйти</button>
      </header>
      <main>
        <ul
          style={{
            height: `${usersList?.length ? usersList.length * 190 : 0}px`,
            overflowY: `${usersList && usersList?.length > 3 ? 'scroll' : 'auto' }`
          }}
          className={styles.usersList}
        >
          {usersList}
        </ul>
      </main>
    </div>
  ) : (
    <Spinner />
  );
}
