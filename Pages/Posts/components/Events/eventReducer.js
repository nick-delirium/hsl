import { events } from '@/analytics'

const SET_DATA = 'app.event.set'
const SET_READ = 'app.event.set_read'

export const setEvent = (event) => ({
  type: SET_DATA,
  payload: event,
})

export const setRead = (id, type) => {
  events.postReaded({ id, type })
  return {
    type: SET_READ,
  }
}

const initialState = {
  isRead: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_READ: {
      return { ...state, isRead: true }
    }
    case SET_DATA: {
      return { ...state, ...action.payload }
    }
    default:
      return state
  }
}
