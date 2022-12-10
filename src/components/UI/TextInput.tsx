import { useState,useRef } from "react";
import { IInput } from "types/components/IInput";
import passwordToggleImg from "@assets/passwordToggle.svg"
import passwordToggleImg2 from "@assets/passwordToggle2.svg"
import styles from "./Input.module.sass";

export default function TextInput({ label, input,validation,setForm }: IInput) {
  const [inputError,setInputError] = useState<null | string>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  function changeStatus(){
    if(inputRef.current !== null){
      if(inputError) setInputError(null)
      const verdict = validation(inputRef.current.value)      
      if(verdict.error){
        setInputError(verdict.error)
      }
      
      setForm((prevState)=>{
        const newForm = {...prevState}

        newForm[ input.id as keyof typeof newForm] = verdict

        return newForm;
      })
    }
    
  }
  const [currPasswordStatus, setCurrPassowrdStatus] = useState<
    "password" | "text"
  >("password");
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={input.id}>
        {label}
      </label>
      {inputError ? <p className={styles.error}>{inputError}</p> : ''}
      <input
      required
      onBlur={changeStatus}
      ref={inputRef}
        className={styles.input}
        {...input}
        type={input.type === "password" ? currPasswordStatus : input.type}
      />
      {input.type === "password" && (
        <img        
          onClick={(e) => {
            e.preventDefault()
            setCurrPassowrdStatus(currPasswordStatus === 'password' ? 'text' : 'password');
          }}
          className={styles.passswordToggle}
          alt='passwordToggle'
          src={currPasswordStatus === 'password' ? passwordToggleImg : passwordToggleImg2 }
        ></img>
      )}
    </div>
  );
}
