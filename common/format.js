
export const formatDate = (date) => {
  if (!date) {
    return false
  }
  const months = {'01': "января", '02': "февраля", '03': "марта", '04': "апреля", '05': "мая", '06': "июня",
    '07': "июля", '08': "августа", '09': "сентября", '10': "октября", '11': "ноября", '12': "декабря"}
  let splitted = date.split(' ')
  date = splitted[0].split('-')
  let month = months[date[1]]
  let time = splitted[1].split(':')
  return ({
    date: `${date[2]}\u00A0${month}`,
    time: `${time[0]}:${time[1]}`,
  })
}

export const formatText = (text, noDots) => {
  return text.replace(/<[^>]*>/g, '') + (!noDots ? '...' : '')
}

export const formatEventDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  let month = now.getMonth() + 1
  month = month < 10 ? month = `0${month}` : month
  const date = now.getDate()
  return (`${year}-${month}-${date}%2000:00:00`)
}

export const NumEnding = (number, aEndings) => {
  /* eslint-disable prefer-destructuring */
  let sEnding
  number = number % 100
  if (number >= 11 && number <= 19) {
    sEnding = aEndings[2]
  } else {
    const i = number % 10
    switch (i) {
      case (1):
        sEnding = aEndings[0]
        break
      case (2):
      case (3):
      case (4):
        sEnding = aEndings[1]
        break
      default:
        sEnding = aEndings[2]
    }
  }
  return sEnding
}
