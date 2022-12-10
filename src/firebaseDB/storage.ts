import {getStorage,ref,uploadBytes} from 'firebase/storage'
import { app } from './setup'

export async function uploadUserAvatarToStorage(avatar: FormDataEntryValue | null,userID:FormDataEntryValue | null) : Promise<void>{
    if(!avatar || !userID || !(avatar instanceof File)) throw new Error('Не удалось загрузить изображение. Попробуйте позже.')
    const storage = getStorage(app)   

    const newRef = ref(storage, `files/${userID}/${avatar.name}`);
    await uploadBytes(newRef, avatar);     
}