const dateFormat = (date) => {
  const replaced = date.replace(' ', 'T')
  const dateObj = new Date(replaced)
  const time = `${dateObj.getHours()}:${dateObj.getMinutes()}`
  const today = new Date()

  const isToday = areSameDate(dateObj, today)
  if (isToday) return `Сегодня в ${time}`

  const isDayAgo = areSameDate(today, dateObj, true)
  if (isDayAgo) return `Вчера в ${time}`

  const dateStr = dateToString(dateObj)
  return `${dateStr} в ${time}`
}

function areSameDate(d1, d2, isDayAgo) {
  return (
    d1.getFullYear() === d2.getFullYear()
        && d1.getMonth() === d2.getMonth()
        && d1.getDate() === (isDayAgo ? d2.getDate() + 1 : d2.getDate())
  )
}

function dateToString(d) {
  let month = d.getMonth()
  let day = d.getDate().toString()
  let year = d.getFullYear()

  year = year.toString().substr(-2)

  month = (month + 1).toString()

  if (month.length === 1) {
    month = `0${month}`
  }

  if (day.length === 1) {
    day = `0${day}`
  }

  return `${year}.${month}.${day}`
}

export default dateFormat
