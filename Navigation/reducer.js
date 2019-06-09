const CHANGE_LOCATION = 'app.location.change'

export const changeLocation = (href) => ({
  type: CHANGE_LOCATION,
  payload: href,
})

const initialState = {
  path: '/'
}

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCATION:
      return {
        ...state,
        path: action.payload
      }
    default:
        return state
  }
}