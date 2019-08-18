import api from '../api'

const CHANGE_LOCATION = 'app.location.change'
const FETCH_CATEGORIES_START = 'app.categories.fetch.start'
const FETCH_CATEGORIES_SUCCESS = 'app.categories.fetch.succes'
const FETCH_CATEGORIES_FAIL = 'app.categories.fetch.fail'
const TOGGLE_POST = 'app.categories.fetch.fail'
const SET_FEED_TYPE = 'app.set_feed_type'

export const changeLocation = (href) => ({
  type: CHANGE_LOCATION,
  payload: href,
})

const initialState = {
  path: '/',
  categories: [],
  isPostOpen: false,
  type: '',
  feedType: '',
}

export const setFeedType = (type) => ({
  type: SET_FEED_TYPE,
  payload: type,
})

const fetchCategoriesReq = () => ({
  type: FETCH_CATEGORIES_START,
})

const fetchSuccess = (data) => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: data,
})

const fetchFail = (reason) => ({
  type: FETCH_CATEGORIES_FAIL,
  payload: reason,
})
export const togglePost = (isPostOpen, type = '') => ({
  type: TOGGLE_POST,
  payload: {
    isPostOpen,
    type,
  }
})

export const getCategories = () => {
  return dispatch => {
    dispatch(fetchCategoriesReq())
    const res = fetch(api.getCategories())
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        result = result.map(cat => ({
          id: cat.id,
          parent: cat.parent,
          name: cat.name,
          slug: cat.slug
        }))
        dispatch(fetchSuccess(result))
      })
      .catch(e => {
        console.log('error', e)
        dispatch(fetchFail(e))
      })
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FEED_TYPE:
      return {
        ...state,
        feedType: action.payload,
      }
    case CHANGE_LOCATION:
      return {
        ...state,
        path: action.payload
      }
      case TOGGLE_POST:
        return {
          ...state,
          isPostOpen: action.payload.isPostOpen,
          type: action.payload.type,
        }
    case FETCH_CATEGORIES_START:
      return {
        ...state,
        isLoading: true,
      }
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        isLoading: false,
      }
    case FETCH_CATEGORIES_FAIL:
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
