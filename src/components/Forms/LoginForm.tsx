import TextInput from "components/UI/TextInput";
import { Fragment } from "react";
import { loginUser } from "firebaseDB/db";
import { useState, useRef } from "react";
import styles from "./LoginForms.module.sass";
import { ILoginForm, initialLoginForm } from "types/loginForm";
import { loginValidation, passwordValidation } from "logic/validations";
import { isLoggedType } from "types/HookTypes";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [authError, setAuthError] = useState<null | string>(null);
  const [loginFormStatus, setLoginFormStatus] =
    useState<ILoginForm>(initialLoginForm);
  const formRef = useRef<null | HTMLFormElement>(null);
  const navigate = useNavigate()

  const formNotValid =
    Object.keys(loginFormStatus).filter((item) => {
      const field = loginFormStatus[item as keyof typeof loginFormStatus];
      return field && !field.status;
    }).length !== 0;

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const authResp = await loginUser(
        loginFormStatus.login.value,
        loginFormStatus.password.value
      );
      localStorage.setItem("refreshToken", authResp.user.refreshToken);
      navigate('/main')
      
    } catch (err) {
      if (err instanceof Error) {
        setAuthError(err.message);
      }
    }
  }

  return (
    <Fragment>
      <form ref={formRef} onSubmit={submitHandler} className={styles.loginForm}>
        {authError && <p className={styles.authError}>{authError}</p>}
        <TextInput
          setForm={setLoginFormStatus}
          validation={loginValidation.bind(null, false)}
          label="Логин"
          input={{ id: "login", type: "text", name: "login" }}
        />
        <TextInput
          setForm={setLoginFormStatus}
          validation={passwordValidation.bind(null, false)}
          label="Пароль"
          input={{ id: "password", type: "password", name: "password" }}
        />
        <button
          className={
            formNotValid
              ? `${styles.loginButton} ${styles.disabledButton}`
              : styles.loginButton
          }
        >
          Войти
        </button>
      </form>
      <p className={styles.registerMsg}>
        У вас ещё нет аккаунта? <a href="./register">Зарегистрироваться</a>
      </p>
    </Fragment>
  );
}
