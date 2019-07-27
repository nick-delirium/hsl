import api from '@/api'

const SEARCH_START = 'app.allposts.search.start'
const SEARCH_SUCCESS = 'app.allposts.search.succes'
const SEARCH_FAIL = 'app.allposts.search.fail'

const DEFAULT_LIMIT = 20

const searchAllPostsReq = (query) => ({
  type: SEARCH_START,
  payload: query,
})

const searchAllSuccess = (data) => ({
  type: SEARCH_SUCCESS,
  payload: data,
})

const searchAllFail = (reason) => ({
  type: SEARCH_FAIL,
  payload: reason,
})

export const searchPosts = (query, limit = DEFAULT_LIMIT) => {
  return dispatch => {
    dispatch(searchAllPostsReq(query))
    const result = fetch(api.search(query, limit))
      .then((response) => response.json())
      .then((res) => {
        return dispatch(searchAllSuccess(res))
      })
      .catch(e => dispatch(searchAllFail(e)))
  }
}

const initialState = {
  searchResult: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  searchQuery: '',
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH_START:
      return {
        ...state,
        isLoading: true,
        searchQuery: action.payload,
      }
    case SEARCH_SUCCESS:
    return {
        ...state,
        searchResult: [...action.payload],
        isLoading: false,
      }
    case SEARCH_FAIL:
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
