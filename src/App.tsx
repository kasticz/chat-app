import React, { useState, useEffect } from "react";
import LoginForm from "./components/Forms/LoginForm";
import { isLoggedType } from "./types/HookTypes";
import Spinner from "./components/UI/Spinner";
import RegisterForm from "components/Forms/RegisterForm";
import { silentAuthWithRefreshToken } from "logic/authUser";
import "./index.sass";

function App(): JSX.Element {
  const [isLogged, setIsLogged] = useState<isLoggedType>(isLoggedType.INITIAL);

  useEffect(() => {
    async function getUserAuth() {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        setIsLogged(isLoggedType.FALSE);
        return;
      }
      try {
        const data = await silentAuthWithRefreshToken(refreshToken);
        if (data) {
          setIsLogged(isLoggedType.TRUE);
        }
      } catch (err) {
        localStorage.removeItem("refreshToken");
        setIsLogged(isLoggedType.FALSE);
      }
    }
    getUserAuth();
  });

  return (
    <div className="App">
      {isLogged === isLoggedType.INITIAL && <Spinner />}

      {isLogged === isLoggedType.FALSE && (
        <div className="formWrapper">
          <h1>React chat app</h1>
          <LoginForm/>
        </div>
      )}
    </div>
  );
}

export default App;
