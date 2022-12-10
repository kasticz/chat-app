import { useState} from "react";
import { IAttachedInput} from "types/components/IInput";
import styles from "./Input.module.sass";

export default function AttachedInput({
  label,
  input,
  validation,
  setForm,
}: IAttachedInput) {
  const [inputError, setInputError] = useState<null | string>(null);
  function changeStatus(e: React.FormEvent<HTMLInputElement>) {
    if (inputError) setInputError(null);
    const verdict = validation(e);
    if (verdict.error) {
      setInputError(verdict.error);
    }

    setForm((prevState) => {
      const newForm = { ...prevState };
      newForm[input.id as keyof typeof newForm] = verdict;
      return newForm;
    });
  }

  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={input.id}>
        {label}
      </label>
      {inputError ? <p className={styles.error}>{inputError}</p> : ""}
      <input onBlur={changeStatus} className={styles.input} {...input} />
    </div>
  );
}
