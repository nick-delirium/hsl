const SET_DATA = 'app.event.set'

export const setEvent = (event) => ({
  type: SET_DATA,
  payload: event,
})

const initialState = {}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA: {
      return { ...action.payload }
    }
    default:
      return state
  }
}