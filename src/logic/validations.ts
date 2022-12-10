import { ILoginFormField } from "types/loginForm";

export function loginValidation(
  isForRegister: boolean,
  i: string
): ILoginFormField {
  const iTrimmed = i.trim();
  if (!isForRegister) return { status: true, value: iTrimmed, error: null };
  const moreThan1Characters = iTrimmed.length >= 2;
  const isValid = iTrimmed && moreThan1Characters;
  return {
    status: !!isValid,
    value: i,
    error: isValid ? null : "Логин должен состоять хотя бы из 2 символов",
  };
}

export function passwordValidation(
  isForRegister: boolean,
  p: string
): ILoginFormField {
  const pTrimmed = p.trim();
  if (!isForRegister) return { status: true, value: pTrimmed, error: null };
  let status = true;
  let error = null;
  const shouldHaveCapitalLetter = hasCapitalLetter(pTrimmed);
  const shouldHaveNumber = hasNumber(pTrimmed);
  const moreThan5Characters = pTrimmed.length > 5;

  if (!shouldHaveCapitalLetter || !shouldHaveNumber || !moreThan5Characters) {
    status = false;
    error =
      "Пароль должен содержать хотя бы 1 заглавную букву, 1 цифру и быть длиннее 5 символов";
  }

  return { status, value: pTrimmed, error };
}

function hasCapitalLetter(s: string) {
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== s[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}
function hasNumber(s: string) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < s.length; i++) {
    if (s.includes(String(numbers[i]))) {
      return true;
    }
  }
  return false;
}

export function nameAndSurnameValidation(
  isForRegister: boolean,
  i: string
): ILoginFormField {
  const trimmed = i.trim();
  const moreThan1Characters = trimmed.length > 1;
  return moreThan1Characters
    ? { status: true, value: trimmed, error: null }
    : {
        status: false,
        value: trimmed,
        error: "Имя и фамилия должны содержать хотя бы 2 символа",
      };
}

export function AttachedValidation(
  e: React.FormEvent<HTMLInputElement>
): ILoginFormField {
  const file = e.currentTarget.files ? e.currentTarget.files[0] : null;
  if (!file) {
    return { status: true, error: null, value: "Прикрепленный файл" };
  }
  const onlyImage = file.type.includes("image");
  const lessThan1MB = file.size < 1000000;
  const res: ILoginFormField = {
    status: onlyImage && lessThan1MB,
    error: null,
    value: "Прикрепленный файл",
  };

  if (!onlyImage) {
    res.error = "Допускаются только файлы-изображения";
  }
  if (!lessThan1MB) {
    res.error = "Допускаются только изображения, весящие меньше 1 МБ";
  }

  return res;
}
