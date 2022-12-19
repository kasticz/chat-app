import { auth } from "../../firebaseDB/setup";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { fetchAllDataForMainComponent } from "firebaseDB/db";
import { useNavigate } from "react-router";
import Spinner from "components/UI/Spinner";
import UserPreview from "./UserPreview";
import avatarPlaceholder from "@assets/placeholder.png";
import { IPublicUser } from "types/IPublicUser";
import searchImg from "@assets/search.svg";
import styles from "./Main.module.sass";

export default function Main() {
  const [userName, setUserName] = useState<string>();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [users, setUsers] = useState<null | IPublicUser[]>(null);
  const [allUsers,setAllUsers] = useState<null | IPublicUser[]>(null)
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const logout = useCallback(
    ()=> {
      localStorage.removeItem("refreshToken");
      navigate("/");
    },
    [navigate]
  );
  useEffect(() => {
    async function getUserData() {
      try {
        const data = await fetchAllDataForMainComponent();
        setUsers(data.users);
        setAllUsers(data.users)
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
  }, [logout, navigate]);

  const search = useCallback(()=>{
    const searchInput = searchRef.current?.value.trim().split('').filter(item => !!item).join('') || ''     
      setUsers(() =>{
        if(!searchInput) return allUsers 
        return allUsers ? allUsers.filter(item => `${item.name}${item.surname}`.includes(searchInput)) : allUsers
      })
    
  },[allUsers])

  const usersPreviewList = useMemo(() => {
    return users
      ? users.map((item) => {
          return <UserPreview key={item.uid} item={item} />;
        })
      : null;
  }, [users]);

  return userName && usersPreviewList ? (
    <div className={styles.chatWrapper}>
      <header className={styles.chatHeader}>
        <img src={avatar ? avatar : avatarPlaceholder} alt="UserAvatar" />
        <div className={styles.userName}>
          <p>{userName}</p>
          <span>Сейчас онлайн</span>
        </div>
        <button onClick={logout}>Выйти</button>
      </header>
      <div className={styles.searchWrapper}>
        <input ref={searchRef} type="text" />
        <button onClick={search}>
          <img src={searchImg} alt="search" />
        </button>
      </div>

      <main
        style={{
          overflowY: `${users && users?.length > 3 ? "scroll" : "auto"}`,
        }}
      >
        <ul
          style={{
            height: `${users?.length ? users.length * 160 : 0}px`,
          }}
          className={styles.users}
        >
          {usersPreviewList}
        </ul>
      </main>
    </div>
  ) : (
    <Spinner />
  );
}
