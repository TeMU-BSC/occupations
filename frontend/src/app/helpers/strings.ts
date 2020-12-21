export const removeAccents = (text: string): string => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
export const simplify = (text: string): string => removeAccents(text).toLowerCase()
export const removeConsecutiveSpaces = (text: string): string => text.trim().replace(/[ ]+(?= )/g, '')
