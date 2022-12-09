import { ILoginFormField } from "types/loginForm";


export  function loginValidation(i:string): ILoginFormField{
    const iTrimmed = i.trim()
    const moreThan2Characters = iTrimmed.length >= 2
    const isValid = iTrimmed && moreThan2Characters
    return {status:!!isValid,value:i,error: isValid ? null :"Логин должен состоять хотя бы из 2 символов"}
}

export  function passwordValidation(p:string):ILoginFormField{
    const pTrimmed = p.trim()
    let status = true;
    let error = null
    const shouldHaveCapitalLetter = hasCapitalLetter(pTrimmed);
    const shouldHaveNumber = hasNumber(pTrimmed)
    const moreThan5Characters = pTrimmed.length > 5


    if(!shouldHaveCapitalLetter || !shouldHaveNumber || !moreThan5Characters){
        status = false
        error = 'Пароль должен содержать хотя бы 1 заглавную букву, 1 цифру и быть длиннее 5 символов'
    }

    return {status,value:pTrimmed,error}

}


function hasCapitalLetter(s:string){
    for(let i = 0;i< s.length;i++){
        if(s[i] !== s.toLowerCase()){
            return true
        }
    }
    return false

}
function hasNumber(s:string){
    const numbers = [0,1,2,3,4,5,6,7,8,9]
    for(let i=0; i <s.length;i++){
        if(s.includes(String(numbers[i]))){
            return true; 
        }
    }
    return false
}