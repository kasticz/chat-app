import { ILoginForm, ILoginFormField } from "types/loginForm"

export interface IInput{
    label : string,
    input:{
        id: string,
        type:string
    },
    validation: (input:string)=> ILoginFormField
    setForm: React.Dispatch<React.SetStateAction<ILoginForm>>
}