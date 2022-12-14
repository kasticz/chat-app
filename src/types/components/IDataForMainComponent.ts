import { IPublicUser } from "types/IPublicUser";

export interface IDataForMainComponent{
    currUserFullName: string | undefined,
    avatar: string | null,
    users: IPublicUser[]

}