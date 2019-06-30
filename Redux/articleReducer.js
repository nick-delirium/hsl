const SET_DATA = 'app.article.set'

export const setData = (article) => ({
  type: SET_DATA,
  payload: article,
})

const initialState = {
  title: '',
  imgUrl: '',
  content: '',
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA: {
      const {
        title,
        imgUrl,
        content,
      } = action.payload
      return {
        ...state,
        title,
        imgUrl,
        content,
      }
    }
    default:
      return state
  }
}