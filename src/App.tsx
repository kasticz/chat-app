import React, { useState, useEffect } from "react";
import LoginForm from "./components/Forms/LoginForm";
import { isLoggedType } from "./types/HookTypes";
import Spinner from "./components/UI/Spinner";
import RegisterForm from "components/Forms/RegisterForm";
import { silentAuthWithRefreshToken } from "logic/authUser";
import "./index.sass";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

function App(): JSX.Element {
  const [isLogged, setIsLogged] = useState<isLoggedType>(isLoggedType.INITIAL);
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  // const history = usehi

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
          if (queryParams.get("redirect")) {
            navigate(
              `/${queryParams.get("redirect")?.replace("|", "&")}`
            );
            return;
          }

          setIsLogged(isLoggedType.TRUE);
          navigate("/main");
        }
      } catch (err) {
        localStorage.removeItem("refreshToken");
        setIsLogged(isLoggedType.FALSE);
      }
    }
    getUserAuth();
  });

  return (
    <main className="App">
      {isLogged === isLoggedType.INITIAL && <Spinner />}

      {isLogged === isLoggedType.FALSE && (
        <div className="formWrapper">
          <h1>React chat app</h1>
          <LoginForm />
        </div>
      )}
    </main>
  );
}

export default App;
