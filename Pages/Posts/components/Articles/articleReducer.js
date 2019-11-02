const SET_DATA = 'app.article.set'

export const setData = (article) => ({
  type: SET_DATA,
  payload: article,
  inAppLink: '',
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
