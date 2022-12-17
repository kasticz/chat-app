export interface IChatMessage{
    from: string | null,
    to: string | null,
    content: string,
    date: Date | string
}