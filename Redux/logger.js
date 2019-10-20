// eslint-disable-next-line no-unused-vars
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action.type, 'action')
  if (action.type.endsWith('fail')) console.log(action)
  return next(action)
}

export default logger
