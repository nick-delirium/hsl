import api from '../api'

const CHANGE_LOCATION = 'app.location.change'
const FETCH_CATEGORIES_START = 'app.categories.fetch.start'
const FETCH_CATEGORIES_SUCCESS = 'app.categories.fetch.succes'
const FETCH_CATEGORIES_FAIL = 'app.categories.fetch.fail'

export const changeLocation = (href) => ({
  type: CHANGE_LOCATION,
  payload: href,
})

const initialState = {
  path: '/',
  categories: [],
}

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
    case CHANGE_LOCATION:
      return {
        ...state,
        path: action.payload
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
