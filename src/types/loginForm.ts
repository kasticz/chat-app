export interface ILoginFormField{
    status: boolean,
    value: string,
    error: null | string
}
export interface ILoginForm{
    login: ILoginFormField,
    password: ILoginFormField
}

export const initialLoginForm = {
    login : {status:false,value:'',error: null},
    password : {status:false,value:'',error: null}
}