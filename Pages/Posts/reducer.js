import api from '../../api'

const FETCH_ALLPOSTS_START = 'app.posts_all.fetch.start'
const FETCH_ALLPOSTS_SUCCESS = 'app.posts_all.fetch.succes'
const FETCH_ALLPOSTS_FAIL = 'app.posts_all.fetch.fail'

const FETCH_POSTS_START = 'app.posts.fetch.start'
const FETCH_POSTS_SUCCESS = 'app.posts.fetch.succes'
const FETCH_POSTS_BY_SUBCATEGORY_SUCCESS = 'app.posts.by_subcategory.success'
const FETCH_POSTS_FAIL = 'app.posts.fetch.fail'

const FETCH_EVENTS_START = 'app.events.fetch.start'
const FETCH_EVENTS_SUCCESS = 'app.events.fetch.succes'
const FETCH_EVENTS_FAIL = 'app.events.fetch.fail'

const FETCH_ADS_START  = 'app.ads.fetch.start'
const FETCH_ADS_SUCCESS  = 'app.ads.fetch.success'
const FETCH_ADS_FAIL = 'app.ads.fetch.fail'

const REMOVE_REFRESH_FLAG = 'app.rm_flag'

const DEFAULT_LIMIT = 20

export const fetchAllPostsReq = (limit, isRefresh) => ({
  type: FETCH_ALLPOSTS_START,
  payload: { limit, isRefresh },
})

export const fetchAllSuccess = (data) => ({
  type: FETCH_ALLPOSTS_SUCCESS,
  payload: data,
})

export const fetchAllFail = (reason) => ({
  type: FETCH_ALLPOSTS_FAIL,
  payload: reason,
})

export const rmRefreshFlag = () => ({
  type: REMOVE_REFRESH_FLAG,
})

export const fetchAdsReq = (limit, isRefresh) => ({
  type: FETCH_ADS_START,
  payload: { limit, isRefresh }
})
export const fetchAdsSuccess = (data) => ({
  type: FETCH_ADS_SUCCESS,
  payload: data,
})
const fetchAdsFail = (reason) => ({
  type: FETCH_ADS_FAIL,
  payload: reason,
})
export const getAds = (limit = DEFAULT_LIMIT, isRefresh = false) => {
  return dispatch => {
    dispatch(fetchAdsReq(limit, isRefresh))
    fetch(api.getPromoCards(limit))
      .then(response => response.json())
      .then(result => dispatch(fetchAdsSuccess(result)))
      .catch(e => dispatch(fetchAdsFail(e)))
  }
}
// flatten( [[1,2], 3, [[4]]] ) => [1, 2, 3, 4]
export const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

export const getPosts = (limit = DEFAULT_LIMIT, isRefresh = false) => {
  return dispatch => {
    dispatch(fetchAllPostsReq(limit, isRefresh))
    dispatch(fetchAdsReq(limit, isRefresh))
    const fetchResult = fetch(api.getPosts(limit))
      .then((response) => response.json())
      .then(posts => {
        fetch(api.getPromoCards(limit))
          .then(r => r.json())
          .then(ads => {
            const result = posts.map(
              (post, index) => {
                const div = index % 3
                const pointer = index % 3 - 1
                const ad = ads[pointer]
                return index > 0 && div === 0 && ad
                  ? [post, ad] : post
              }
            )
            const flatResult = flatten(result)
            dispatch(fetchAdsSuccess(ads))
            return dispatch(fetchAllSuccess(flatResult))
          })
          .catch(e => dispatch(fetchAdsFail(e)))
      })
      .catch(e => dispatch(fetchAllFail(e)))
  }
}

const fetchPostsReq = (category, limit, isRefresh) => ({
  type: FETCH_POSTS_START,
  payload: { limit, category, isRefresh },
})

const fetchSuccess = (data, category, isRefresh = false) => ({
  type: FETCH_POSTS_SUCCESS,
  payload: { category, data, isRefresh }
})

const fetchSubCategorySuccess = (data, category, isRefresh = false, mainCategory) => ({
  type: FETCH_POSTS_BY_SUBCATEGORY_SUCCESS,
  payload: { category, data, isRefresh, mainCategory }
})

const fetchFail = (reason) => ({
  type: FETCH_POSTS_FAIL,
  payload: reason,
})

export const getPostsByCategory = (category, limit = DEFAULT_LIMIT, isRefresh = false, mainCategory) => {
  return dispatch => {
    console.log('trying to get', api.getPostsByCategory(category, limit, mainCategory))
    dispatch(fetchPostsReq(limit, category, isRefresh))
    const result = fetch(api.getPostsByCategory(category, limit, mainCategory))
      .then((response) => response.json())
      .then((result) => {
        if (mainCategory) {
          dispatch(fetchSubCategorySuccess(result, category, isRefresh, mainCategory))
        } else {
          dispatch(fetchSuccess(result, category, isRefresh))
        }})
      .catch(e => dispatch(fetchFail(e)))
  }
}

const fetchEventsReq = (startDate, endDate, limit, isRefresh) => ({
  type: FETCH_EVENTS_START,
  payload: { startDate, endDate, limit, isRefresh },
})

const fetchEventsSuccess = (data, isRefresh) => ({
  type: FETCH_EVENTS_SUCCESS,
  payload: { data, isRefresh }
})

const fetchEventsFail = (reason) => ({
  type: FETCH_EVENTS_FAIL,
  payload: reason,
})

export const getEvents = (startDate, endDate = undefined, limit = DEFAULT_LIMIT, isRefresh = false) => {
  return dispatch => {
    dispatch(fetchEventsReq(startDate, endDate, limit, isRefresh))
    const result = fetch(api.getEvents(startDate, endDate, limit))
      .then((response) => response.json())
      .then((result) => dispatch(fetchEventsSuccess(result.events)))
      .catch(e => dispatch(fetchEventsFail(e)))
  }
}

const initialState = {
  posts: [],
  data: {},
  isLoading: false,
  isError: false,
  errorMessage: '',
  // category: '',
}

export default function(state = initialState, action) {
  switch (action.type) {
    case REMOVE_REFRESH_FLAG:
      return {
        ...state,
        isRefresh: false,
      }
    case FETCH_ALLPOSTS_START:
      return {
        ...state,
        isLoading: true,
        isRefresh: action.payload.isRefresh,
      }
    case FETCH_ALLPOSTS_SUCCESS:
      return {
        ...state,
        posts: [...action.payload],
        isLoading: false,
      }
    case FETCH_ALLPOSTS_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        isLoading: false,
        isError: true,
      }
    case FETCH_POSTS_START:
      return {
        ...state,
        category: action.payload.category,
        isLoading: true,
        isRefresh: action.payload.isRefresh,
      }
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [`${action.payload.category}`]: [...action.payload.data]
        },
        isLoading: false,
      }
    case FETCH_POSTS_BY_SUBCATEGORY_SUCCESS:
      const { category, mainCategory, data } = action.payload
      const withSubcategory = Boolean(mainCategory)
      return {
        ...state,
        data: {
          [`${withSubcategory ? mainCategory : category}`]: [...data]
        },
        isLoading: false,
      }
    case FETCH_POSTS_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        isLoading: false,
        isError: true,
      }
    case FETCH_EVENTS_START:
      return {
        ...state,
        isLoading: true,
        isRefresh: action.payload.isRefresh,
      }
    case FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        data: {...state.data, [`00`]: [...action.payload.data]}, //00 is our id for events
        isLoading: false,
      }
    case FETCH_EVENTS_FAIL:
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
