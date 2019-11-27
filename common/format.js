/* eslint-disable quote-props */

export const formatDate = (date, splitBy = ' ') => {
  if (!date || date === 0 || !date.split) {
    return false
  }
  const months = {
    '01': 'января',
    '02': 'февраля',
    '03': 'марта',
    '04': 'апреля',
    '05': 'мая',
    '06': 'июня',
    '07': 'июля',
    '08': 'августа',
    '09': 'сентября',
    '10': 'октября',
    '11': 'ноября',
    '12': 'декабря',
  }
  const splitted = date.split(splitBy).length === 2 ? date.split(splitBy) : date.split(' ')
  const splitDate = splitted[0].split('-')
  const month = months[splitDate[1]]
  const time = splitted[1].split(':')
  return ({
    date: `${splitDate[2]}\u00A0${month}`,
    time: `${time[0]}:${time[1]}`,
  })
}

export const formatDateAsNumeric = (date) => {
  const dateObj = new Date(date)
  let day = `${dateObj.getUTCDate()}`
  day = day.length === 2 ? day : `0${day}`
  return `${day}.${dateObj.getUTCMonth() + 1}.${dateObj.getUTCFullYear()}`
}

export const formatText = (text, noDots) => text.replace(/<[^>]*>/g, '') + (!noDots ? '...' : '')

export const formatEventDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const monthRaw = now.getMonth() + 1
  const month = monthRaw < 10 ? `${monthRaw}` : monthRaw
  const date = now.getDate()
  return `${year}-${month}-${date}%2000:00:00`
}

export const NumeralDeclension = (number, endingsArray) => {
  const remainder = number % 100
  if (remainder >= 11 && remainder <= 19) {
    return endingsArray[2]
  }
  switch (remainder % 10) {
    case (1):
      return endingsArray[0]
    case (2):
    case (3):
    case (4):
      return endingsArray[1]
    default:
      return endingsArray[2]
  }
}
