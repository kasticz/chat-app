import {useSearchParams} from 'react-router-dom'
import {useState,useEffect} from 'react'
import { auth } from 'firebaseDB/setup'
import { retrieveChatHistory } from 'firebaseDB/db'
import { IChatMessage } from 'types/IChatMessage'

export default function ChatWindow(){
    const [chatHistory,setChatHistory] = useState<IChatMessage[] | null>(null)
    const [queryParams] = useSearchParams()
    useEffect(()=>{
        async function getChatHistory(){
            const secondUserUid = queryParams.get('user2')
            const chatHistory = await retrieveChatHistory(auth.currentUser?.uid,secondUserUid)
            setChatHistory(chatHistory)
        }
        getChatHistory()
    },[])
    
    return <div>{chatHistory ? chatHistory[0].content : 123}</div>
}