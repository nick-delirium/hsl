/* eslint-disable no-async-promise-executor */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-spread */
import api from '../../api'

const FETCH_PLACES_START = 'app.places.fetch.start'
const FETCH_PLACES_SUCCESS = 'app.places.fetch.succes'
const FETCH_PLACES_FAIL = 'app.places.fetch.fail'

const fetchPlacesReq = () => ({
  type: FETCH_PLACES_START,
})

const fetchPlacesSuccess = (data) => ({
  type: FETCH_PLACES_SUCCESS,
  payload: data,
})

const fetchPlacesFail = (reason) => ({
  type: FETCH_PLACES_FAIL,
  payload: reason,
})

const fetchPlaces = async (page) => {
  return new Promise(async (resolve) => {
    if (page === 0) resolve([])
    const placesResponse = await fetch(api.getPlaces(page + 1))
    const places = await placesResponse.json()

    resolve(places.venues)
  })
}

export const getPlaces = (city) => {
  return (dispatch) => {
    dispatch(fetchPlacesReq())
    fetch(api.getPlaces())
      .then((response) => response.json())
      .then(async (result) => {
        const pages = result.total_pages
        const resultArray = result.venues
        // returns Array with range from 0 to x - 1; e.g pages = 2 => iteratee = [0, 1]
        const iteratee = Array.apply(null, Array(pages)).map((x, i) => i)
        await iteratee.reduce(async (promise, page) => {
          await promise
          const contents = await fetchPlaces(page)
          resultArray.push(...contents)
        }, Promise.resolve())
        return resultArray
      })
      .then((resultArray) => {
        const res = city ? resultArray.filter((place) => place.city === city) : resultArray
        const transformedMarkers = []
        res.forEach((item) => {
          if (item.location && item.location.lat) {
            // check if there are several markers on one place and add some space
            if (!transformedMarkers.find(
              (OC) => OC.location.lat === item.location.lat && (OC.id !== item.id),
            )) {
              transformedMarkers.push({
                ...item,
                location: {
                  latitude: parseFloat(item.location.lat),
                  longitude: parseFloat(item.location.lng),
                },
              })
            } else {
              transformedMarkers.push({
                ...item,
                location: {
                  latitude: parseFloat(item.location.lat) + 0.00005,
                  longitude: parseFloat(item.location.lng),
                },
              })
            } // wierd thing: somehow some points may have only theese coords
          } else if (item.geo_lat && item.geo_lng) {
            transformedMarkers.push({
              ...item,
              location: {
                latitude: parseFloat(item.geo_lat),
                longitude: parseFloat(item.geo_lng),
              },
            })
          }
        })

        return dispatch(fetchPlacesSuccess(transformedMarkers))
      })
      .catch((e) => dispatch(fetchPlacesFail(e)))
  }
}

const initialState = {
  places: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
}

export default function (state = initialState, action) {
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
