import TextInput from "components/UI/TextInput";
import { Fragment } from "react";
import { createUser, loginUser } from "firebaseDB/db";
import { useState } from "react";
import styles from "./LoginForms.module.sass";
import { ILoginForm, initialLoginForm } from "types/loginForm";
import { loginValidation, passwordValidation } from "logic/validations";

export default function LoginForm() {
  const [authError, setAuthError] = useState<null | string>(null);
  const [loginFormStatus, setLoginFormStatus] = useState<ILoginForm>(initialLoginForm);

  const formNotValid =
    Object.keys(loginFormStatus).filter(
      (item) => !loginFormStatus[item as keyof typeof loginFormStatus].status
    ).length !== 0;

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(loginFormStatus)
    try {
      await createUser(loginFormStatus.login.value,loginFormStatus.password.value)
    } catch (err) {
      if (err instanceof Error) {
        setAuthError(err.message);
      }
    }
  }

  return (
    <Fragment>
      <form onSubmit={submitHandler} className={styles.loginForm}>
        {authError && <p className={styles.authError}>{authError}</p>}
        <TextInput
          setForm={setLoginFormStatus}
          validation={loginValidation}
          label="Логин"
          input={{ id: "login", type: "text" }}
        />
        <TextInput
          setForm={setLoginFormStatus}
          validation={passwordValidation}
          label="Пароль"
          input={{ id: "password", type: "password" }}
        />
        <button  className={formNotValid ? `${styles.loginButton} ${styles.disabledButton}` : styles.loginButton}>Войти</button>
      </form>
      <p className={styles.registerMsg}>
        У вас ещё нет аккаунта? <a href="./register">Зарегистрироваться</a>
      </p>
    </Fragment>
  );
}
