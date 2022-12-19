import TextInput from "components/UI/TextInput";
import { createUser, uploadUserDataToDb } from "firebaseDB/db";
import { useState,useRef } from "react";
import { ILoginForm, initialRegisterForm} from "types/loginForm";
import { AttachedValidation, loginValidation, nameAndSurnameValidation, passwordValidation } from "logic/validations";
import AttachedInput from "components/UI/AttachedInput"
import styles from "./LoginForms.module.sass";
import { uploadUserAvatarToStorage } from "firebaseDB/storage";
import { useNavigate } from "react-router";


export default function LoginForm() {
  const [authError, setAuthError] = useState<null | string>(null);
  const [registerFormStatus, setregisterFormStatus] = useState<ILoginForm>(initialRegisterForm);
  const formRef = useRef<null | HTMLFormElement>(null)
  const navigate = useNavigate()

  const formNotValid =
    Object.keys(registerFormStatus).filter(
      (item) =>{
        const field = registerFormStatus[item as keyof typeof registerFormStatus]
        return field && !field.status
      } 
    ).length !== 0;

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
        if(formRef.current){
            const userData = await createUser(registerFormStatus.login.value,registerFormStatus.password.value)
            const form = new FormData(formRef.current)

            await uploadUserDataToDb(form,userData.user.uid,await userData.user.getIdToken())  

            if(form.get('attached')){                
                await uploadUserAvatarToStorage(form.get('attached'),userData.user.uid)
            }     
            localStorage.setItem('refreshToken',userData.user.refreshToken)
            navigate('/main')
        }
      
    } catch (err) {
      if (err instanceof Error) {
        setAuthError(err.message);
      }
    }
  }

  return (
    <main className="formWrapper">
        <h1>React chat app</h1>
      <form ref={formRef} onSubmit={submitHandler} className={styles.loginForm}>
        {authError && <p className={styles.authError}>{authError}</p>}
        <TextInput
          setForm={setregisterFormStatus}
          validation={nameAndSurnameValidation.bind(null,true)}
          label="Имя"
          input={{ id: "name", type: "text",name:'name' }}
        />
        <TextInput
          setForm={setregisterFormStatus}
          validation={nameAndSurnameValidation.bind(null,true)}
          label="Фамилия"
          input={{ id: "surname", type: "text",name:'surname' }}
        />
        <TextInput
          setForm={setregisterFormStatus}
          validation={loginValidation.bind(null,true)}
          label="Логин"
          input={{ id: "login", type: "text",name:'login' }}
        />
        <TextInput
          setForm={setregisterFormStatus}
          validation={passwordValidation.bind(null,true)}
          label="Пароль"
          input={{ id: "password", type: "password",name:'password' }}
        />
       <AttachedInput           setForm={setregisterFormStatus}
          validation={AttachedValidation}
          label="Аватар"
          input={{ id: "attached", type: "file",name:'attached' }} />
        <button style={{width:'220px'}}  className={formNotValid ? `${styles.loginButton} ${styles.disabledButton}` : styles.loginButton}>Зарегистрироваться</button>
      </form>
      <p className={styles.registerMsg}>
        Уже есть аккаунт? <a href="/">Войти</a>
      </p>
      </main>
  );
}
