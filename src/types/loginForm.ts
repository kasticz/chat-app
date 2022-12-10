export interface ILoginFormField{
    status: boolean,
    value: string ,
    error: null | string
}
export interface ILoginForm{
    login: ILoginFormField,
    password: ILoginFormField
    name?: ILoginFormField
    surname?: ILoginFormField,
    attached?: ILoginFormField
}

export const initialLoginForm = {
    login : {status:true,value:'',error: null},
    password : {status:true,value:'',error: null},
}
export const initialRegisterForm = {
    login : {status:false,value:'',error: null},
    password : {status:false,value:'',error: null},
    name: {status:false,value:'',error: null},
    surname: {status:false,value:'',error: null},
    attached: {status:true,value:'',error: null}
}
