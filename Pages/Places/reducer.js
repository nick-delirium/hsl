import api from '../../api'

const FETCH_PLACES_START = 'app.places.fetch.start'
const FETCH_PLACES_SUCCESS = 'app.places.fetch.succes'
const FETCH_PLACES_FAIL = 'app.places.fetch.fail'

const fetchPlacesReq = () => ({
  type: FETCH_PLACES_START,
})

const fetchPlacesSuccess = (data) => ({
  type: FETCH_PLACES_SUCCESS,
  payload: data
})

const fetchPlacesFail = (reason) => ({
  type: FETCH_PLACES_FAIL,
  payload: reason,
})

export const getPlaces = () => {
  return dispatch => {
    dispatch(fetchPlacesReq())
    const result = fetch(api.getPlaces())
      .then((response) => response.json())
      .then((result) => dispatch(fetchPlacesSuccess(result.places)))
      .catch(e => dispatch(fetchPlacesFail(e)))
  }
}

const initialState = {
  places: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLACES_START:
      return {
        ...state,
        isLoading: true,
      }
    case FETCH_PLACES_SUCCESS:
      return {
        ...state,
        places: action.payload,
        isLoading: false,
      }
    case FETCH_PLACES_FAIL:
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
