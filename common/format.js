export const formatDate = (date) => {
  if (!date) {
    return;
  }
  const months = {'01': "января", '02': "февраля", '03': "марта", '04': "апреля", '05': "мая", '06': "июня",
    '07': "июля", '08': "августа", '09': "сентября", '10': "октября", '11': "ноября", '12': "декабря"};
  date = date.split(' ')[0].split('-');
  let month = months[date[1]];
    return (`${date[2]} ${month}`)
}

export const formatText = (text) => {
  let newText = text.replace(/(<p>)/gm, "")
  // console.log(newText.split('<'))
  newText = newText.split('<')[0] + '...'
  return(newText)
}