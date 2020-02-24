import { events } from '@/analytics'

const SET_DATA = 'app.article.set'
const SET_READ = 'app.article.set_read'

export const setData = (article) => ({
  type: SET_DATA,
  payload: article,
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
