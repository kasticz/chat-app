import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
export function removeSpacesFromString(s:string):string{
    return s.split('').filter(item => item !== ' ').join('')
}

export function getDateAsString(date:string | Date):string{
    dayjs.extend(customParseFormat)
    const dateConverted = dayjs(date)
    const dateAsString = dayjs(dateConverted,'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')
    return dateAsString

}