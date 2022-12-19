import { IChatMessage } from "./IChatMessage";

export interface IPublicUser{
    name:string,
    surname:string,
    uid:string,
    currentUserName: string | undefined
    lastMsg: IChatMessage,
    botId?:string
}