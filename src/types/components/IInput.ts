import { ILoginForm, ILoginFormField } from "types/loginForm"

export interface IInput{
    label : string,
    input:{
        id: string,
        type:string
        name:string
    },
    validation: (input: string)=> ILoginFormField
    setForm: React.Dispatch<React.SetStateAction<ILoginForm>>
}

export interface IAttachedInput{
    label : string,
    input:{
        id: string,
        type:string,
        name:string
    },
    validation: (e: React.FormEvent<HTMLInputElement>)=> ILoginFormField
    setForm: React.Dispatch<React.SetStateAction<ILoginForm>>

}