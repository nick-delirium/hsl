import { SING_OUT } from './Login/reducer'
import api from '@/api'

const CHANGE_TAB = 'app.okbk.change_tab'
const CHANGE_TITLE = 'app.okbk.change_title'
const GO_BACK = 'app.okbk.go_back'
const SET_SEARCH_DATA = 'app.okbk.set_search_data'

export const setFoundData = (data) => ({
  type: SET_SEARCH_DATA,
  payload: data,
})
export const goBack = () => ({
  type: GO_BACK,
})
export const changeTitle = (title, shouldRenderFakeHeader = false) => ({
  type: CHANGE_TITLE,
  payload: {
    title,
    shouldRenderFakeHeader,
  },
})

export const changeCurrentTab = (tabName, title, fakeNavBar = false) => ({
  type: CHANGE_TAB,
  payload: {
    tabName, title, fakeNavBar,
  },
})

// getting OKBK news
const GET_NEWS = 'app.okbk.get_news'
const GET_NEWS_SUCCESS = 'app.okbk.get_news_succsess'
const GET_NEWS_FALURE = 'app.okbk.get_news_falure'
const GET_NEWS_INITIAL_SUCCESS = 'app.okbk.get_news_initial_success'
const REMOVE_REFRESH_FLAG = 'app.okbk.rm_flag'
const DEFAULT_LIMIT = 20

export const getNewsRequest = () => ({
  type: GET_NEWS,
})
export const getNewsSuccess = (posts) => ({
  type: GET_NEWS_SUCCESS,
  payload: posts,
})
const getNewsInitialSuccess = (data) => ({
  type: GET_NEWS_INITIAL_SUCCESS,
  payload: data,
})
export const getNewsFalure = () => ({
  type: GET_NEWS_FALURE,
})

export const rmRefreshFlag = () => ({
  type: REMOVE_REFRESH_FLAG,
})

export const getNews = (
  limit = DEFAULT_LIMIT,
  isRefresh = false,
  page = 1,
  isInitial = true,
) => (dispatch) => {
  dispatch(getNewsRequest(limit, isRefresh))
  console.log(limit, isRefresh, page)
  fetch(api.getPostsByCategory(792, limit, page))
    .then((response) => response.json())
    .then((posts) => {
      if (isInitial) return dispatch(getNewsInitialSuccess(posts))
      return dispatch(getNewsSuccess(posts))
    })
    .catch((e) => {
      console.log(e)
      return dispatch(getNewsFalure(e))
    })
}


export const defaultSearchResult = {
  asked: false,
  data: [],
}

const initialState = {
  searchData: defaultSearchResult,
  currentTab: 'groups',
  tabHistory: ['groups'],
  title: 'ОКБК',
  fakeHistory: [],
  titleHistory: [],
  prevTitle: '',
  shouldRenderFakeHeader: false,
  isLoading: false,
  error: null,
  isRefresh: false,
  posts: [],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_DATA:
      return {
        ...state,
        searchData: action.payload,
      }
    case CHANGE_TAB: {
      const newTitle = action.payload.title || state.title
      return {
        ...state,
        currentTab: action.payload.tabName,
        title: newTitle,
        titleHistory: [newTitle, ...state.titleHistory],
        tabHistory: [action.payload.tabName, ...state.tabHistory],
        searchData: initialState.searchData,
        users: initialState.users,
        personalInfo: {},
        shouldRenderFakeHeader: action.payload.fakeNavBar,
        fakeHistory: [],
      }
    }
    case CHANGE_TITLE:
      return {
        ...state,
        title: action.payload.title,
        titleHistory: [action.payload.title, ...state.titleHistory],
        shouldRenderFakeHeader: action.payload.shouldRenderFakeHeader || false,
        fakeHistory: [action.payload.title, ...state.fakeHistory],
      }
    case GO_BACK: {
      const { tabHistory, fakeHistory, titleHistory } = state
      if (tabHistory.length === 0) return state
      if (fakeHistory.length === 0) tabHistory.shift()
      else fakeHistory.shift()
      titleHistory.shift()
      return {
        ...state,
        currentTab: tabHistory[0],
        tabHistory,
        fakeHistory,
        title: titleHistory[0],
        personalInfo: {},
        users: fakeHistory.length === 1 ? state.users : initialState.users,
        shouldRenderFakeHeader: fakeHistory.length > 0,
      }
    }
    case REMOVE_REFRESH_FLAG:
      return {
        ...state,
        isRefresh: false,
      }
    case GET_NEWS_INITIAL_SUCCESS:
      return {
        ...state,
        posts: action.payload,
        isLoading: false,
      }
    case GET_NEWS_SUCCESS:
      return {
        ...state,
        posts: [...state.posts, ...action.payload],
        isLoading: false,
      }
    case SING_OUT:
      return initialState
    default:
      return state
  }
}
