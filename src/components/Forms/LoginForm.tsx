import styles from './LoginForms.module.sass'
import TextInput from "components/UI/TextInput";
import { Fragment } from 'react';

export default function LoginForm() {
  return (
    <Fragment>
    <form className={styles.loginForm}>
      <TextInput label="Логин" input={{ id: "login", type: 'text' }} />
      <TextInput label="Пароль" input={{ id: "password",type:'password' }} />
      <button className={styles.loginButton}>Войти</button>      
    </form>
    <p className={styles.registerMsg}>У вас ещё нет аккаунта? <a href="./register">Зарегистрироваться</a></p>
    </Fragment>
  );
}
