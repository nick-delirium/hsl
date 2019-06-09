import api from '../../api'

const FETCH_POSTS_START = 'app.news.fetch.start'
const FETCH_POSTS_SUCCESS = 'app.news.fetch.succes'
const FETCH_POSTS_FAIL = 'app.news.fetch.fail'

const DEFAULT_LIMIT = 20

const fetchPostsReq = (limit) => ({
  type: FETCH_POSTS_START,
  payload: limit,
})

const fetchSuccess = (data) => ({
  type: FETCH_POSTS_SUCCESS,
  payload: data,
})

const fetchFail = (reason) => ({
  type: FETCH_POSTS_FAIL,
  payload: reason,
})

export const getPosts = (limit = DEFAULT_LIMIT) => {
  return dispatch => {
    dispatch(fetchPostsReq())
    const result = fetch(api.getPosts(limit))
      .then((response) => response.json())
      .then((result) => dispatch(fetchSuccess(result)))
      .catch(e => dispatch(fetchFail(e)))
  }
}

const initialState = {
  posts: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_POSTS_START:
      return {
        ...state,
        isLoading: true,
      }
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        posts: [...action.payload],
        isLoading: false,
      }
    case FETCH_POSTS_FAIL:
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
