import { events } from '@/analytics'
import api from '@/api'

const SET_DATA = 'app.article.set'
const SET_READ = 'app.article.set_read'
const FETCH_SIMILAR_POSTS_SUCCESS = 'app.posts.similar.succes'
const FETCH_SIMILAR_POSTS_FAIL = 'app.posts.similar.fail'

export const setData = (article) =>
  async (dispatch) => {
    dispatch({
      type: SET_DATA,
      payload: article,
    })
    try {
      const similarPosts = await fetchSimilar(article.id)
      dispatch(fetchSimilarSuccess(similarPosts))
    } catch (e) {
      dispatch(fetchSimilarFail(e))
      console.error(e)
    }
  }

const fetchSimilar = (id) =>
  fetch(api.getSimilarPosts(id))
    .then((response) => response.json())
    .then((result) => result)
    .catch((e) => {
      throw new Error(e)
    })


export const setRead = (id, type) => {
  events.postReaded({ id, type })
  return {
    type: SET_READ,
  }
}

const fetchSimilarSuccess = (data) => ({
  type: FETCH_SIMILAR_POSTS_SUCCESS,
  payload: data,
})
const fetchSimilarFail = (reason) => ({
  type: FETCH_SIMILAR_POSTS_FAIL,
  payload: reason,
})


const initialState = {
  isRead: false,
  isLoading: false,
  isError: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_READ: {
      return { ...state, isRead: true }
    }
    case SET_DATA: {
      return { ...state, ...action.payload }
    }
    case FETCH_SIMILAR_POSTS_SUCCESS:
      return {
        ...state,
        similar: action.payload,
        isLoading: false,
      }
    case FETCH_SIMILAR_POSTS_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        isLoading: false,
        isError: true,
      }
    default:
      return state
  }
}
