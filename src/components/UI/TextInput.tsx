import { useState } from "react";
import { IInput } from "types/components/IInput";
import passwordToggleImg from "@assets/passwordToggle.svg"
import styles from "./Input.module.sass";

export default function TextInput({ label, input }: IInput) {
  const [currPasswordStatus, setCurrPassowrdStatus] = useState<
    "password" | "text"
  >("password");
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={input.id}>
        {label}
      </label>
      <input
        className={styles.input}
        {...input}
        type={input.type === "password" ? currPasswordStatus : input.type}
      />
      {input.type === "password" && (
        <img        
          onClick={() => {
            setCurrPassowrdStatus(currPasswordStatus === 'password' ? 'text' : 'password');
          }}
          className={styles.passswordToggle}
          alt='passwordToggle'
          src={passwordToggleImg}
        ></img>
      )}
    </div>
  );
}
