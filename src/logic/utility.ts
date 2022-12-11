
export function removeSpacesFromString(s:string):string{
    return s.split('').filter(item => item !== ' ').join('')
}