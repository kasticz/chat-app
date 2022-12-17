import { IChatMessage } from "./IChatMessage";

export interface IBotReply extends IChatMessage{
    conversation:string
}