import api from '../../api'

const FETCH_ALLPOSTS_START = 'app.allposts.fetch.start'
const FETCH_ALLPOSTS_SUCCESS = 'app.allposts.fetch.succes'
const FETCH_ALLPOSTS_FAIL = 'app.allposts.fetch.fail'

const FETCH_POSTS_START = 'app.posts.fetch.start'
const FETCH_POSTS_SUCCESS = 'app.posts.fetch.succes'
const FETCH_POSTS_FAIL = 'app.posts.fetch.fail'

const FETCH_EVENTS_START = 'app.events.fetch.start'
const FETCH_EVENTS_SUCCESS = 'app.events.fetch.succes'
const FETCH_EVENTS_FAIL = 'app.events.fetch.fail'

const REMOVE_REFRESH_FLAG = 'app.rm_flag'

const DEFAULT_LIMIT = 20

const fetchAllPostsReq = (limit, isRefresh) => ({
  type: FETCH_ALLPOSTS_START,
  payload: { limit, isRefresh },
})

export const fetchAllSuccess = (data) => ({
  type: FETCH_ALLPOSTS_SUCCESS,
  payload: data,
})

const fetchAllFail = (reason) => ({
  type: FETCH_ALLPOSTS_FAIL,
  payload: reason,
})

export const rmRefreshFlag = () => ({
  type: REMOVE_REFRESH_FLAG,
})

export const getPosts = (limit = DEFAULT_LIMIT, isRefresh = false) => {
  return dispatch => {
    dispatch(fetchAllPostsReq(limit, isRefresh))
    const result = fetch(api.getPosts(limit))
      .then((response) => response.json())
      .then((result) => dispatch(fetchAllSuccess(result)))
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

const fetchFail = (reason) => ({
  type: FETCH_POSTS_FAIL,
  payload: reason,
})

export const getPostsByCategory = (category, limit = DEFAULT_LIMIT, isRefresh = false) => {
  return dispatch => {
    dispatch(fetchPostsReq(limit, category, isRefresh))
    const result = fetch(api.getPostsByCategory(category, limit))
      .then((response) => response.json())
      .then((result) => dispatch(fetchSuccess(result, category, isRefresh)))
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
        data: {...state.data, [`${action.payload.category}`]: [...action.payload.data]},
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
