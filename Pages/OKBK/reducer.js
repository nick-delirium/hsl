import { AsyncStorage } from 'react-native'
import {
  client,
  auth,
  getClubsQuery,
  getUsersQuery,
} from './gqlQueries'

// Auth
const SING_IN = 'app.okbk.sing_in'
const SING_IN_SUCCESS = 'app.okbk.sing_in_succsess'
const ACCOUNT_CONFIRMED = 'app.okbk.account_session_acive'
const SING_IN_FALURE = 'app.okbk.sing_in.fail'
const SING_OUT = 'app.okbk.sing_out'
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
export const singInRequest = () => ({
  type: SING_IN,
})
export const singInRequestSuccsess = (account) => ({
  type: SING_IN_SUCCESS,
  payload: account,
})
export const accountConfirmed = (account) => ({
  type: ACCOUNT_CONFIRMED,
  payload: account,
})
export const singInRequestFalure = () => ({
  type: SING_IN_FALURE,
})
export const singIn = (account) => (
  async (dispatch) => {
    dispatch(singInRequest)
    try {
      const response = await client.query({ query: auth, variables: account })
      if (response.data.auth.result) {
        const { sessionId, groups, user } = response.data.auth
        const accountInfo = { sessionId, groups, user }
        dispatch({ type: SING_IN_SUCCESS, payload: accountInfo })
        try {
          await AsyncStorage.setItem('account', JSON.stringify(accountInfo))
        } catch (error) {
          console.log(error)
        }
      } else {
        dispatch({ type: SING_IN_FALURE, payload: response.data.auth.code })
      }
    } catch (e) {
      console.error(e)
      dispatch({ type: SING_IN_FALURE, payload: e.message })
    }
  }
)

export const singOut = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('account')
    dispatch({ type: SING_OUT })
  } catch (e) {
    console.log(e)
  }
}

// Getting clubs
const GET_CLUBS = 'app.okbk.get_clubs'
const GET_CLUBS_SUCCESS = 'app.okbk.get_clubs_succsess'
const GET_CLUBS_FALURE = 'app.okbk.get_clubs_falure'
const SET_SELECTED_CLUB = 'app.okbk.set_selected_club'

export const getClubsRequest = () => ({
  type: GET_CLUBS,
})
export const getClubsSuccsess = (clubs) => ({
  type: GET_CLUBS_SUCCESS,
  payload: clubs,
})
export const getClubsFalure = () => ({
  type: GET_CLUBS_FALURE,
})

export const getClubs = () => (
  async (dispatch) => {
    dispatch({ type: GET_CLUBS })
    try {
      const response = await client.query({ query: getClubsQuery })
      const res = response.data.businessClubList
      if (res.result) {
        dispatch(getClubsSuccsess(res.businessClubs))
      } else {
        console.error(res.message)
        dispatch(getClubsFalure())
      }
    } catch (e) {
      console.error(e)
    }
  }
)

export const setSelectedClub = (club) => ({
  type: SET_SELECTED_CLUB,
  payload: club,
})

// Getting users
const GET_USERS = 'app.okbk.get_users'
const GET_USERS_SUCCESS = 'app.okbk.get_users_succsess'
const GET_USERS_FALURE = 'app.okbk.get_users_falure'
const SET_SELECTED_USER = 'app.okbk.set_selected_user'

export const getUsersRequest = () => ({
  type: GET_USERS,
})
export const getUsersSuccsess = (users) => ({
  type: GET_USERS_SUCCESS,
  payload: users,
})
export const getUsersFalure = () => ({
  type: GET_USERS_FALURE,
})

export const getUsers = (params) => (
  async (dispatch) => {
    dispatch({ type: GET_USERS })
    try {
      const response = await client.query({ query: getUsersQuery, variables: params })
      const res = response.data.users
      if (res.result) {
        dispatch(getUsersSuccsess(res.users))
      } else {
        console.error(res.message)
        dispatch(getUsersFalure())
      }
    } catch (e) {
      console.error(e)
    }
  }
)

export const setSelectedUser = (user) => ({
  type: SET_SELECTED_USER,
  payload: user,
})

export const defaultSearchResult = {
  asked: false,
  data: [],
}

const initialState = {
  searchData: defaultSearchResult,
  currentTab: 'feed',
  tabHistory: ['feed'],
  fakeHistory: [],
  title: 'ОКБК Новости',
  titleHistory: [],
  prevTitle: '',
  shouldRenderFakeHeader: false,
  account: {},
  clubs: [],
  users: [],
  selectedClub: {},
  personalInfo: {},
  isLoading: false,
  isLoggedIn: false,
  error: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_DATA:
      return {
        ...state,
        searchData: action.payload,
      }
    case SING_IN:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case SING_IN_FALURE:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        error: action.payload,
      }
    case ACCOUNT_CONFIRMED:
    case SING_IN_SUCCESS:
      return {
        ...state,
        account: action.payload,
        isLoggedIn: true,
        isLoading: false,
      }
    case CHANGE_TAB: {
      const newTitle = action.payload.title || state.title
      return {
        ...state,
        currentTab: action.payload.tabName,
        personalInfo: action.payload.tabName !== 'profile' ? {} : state.personalInfo,
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
    case GET_CLUBS_SUCCESS:
      return {
        ...state,
        clubs: action.payload,
      }
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      }
    case SET_SELECTED_CLUB:
      return {
        ...state,
        selectedClub: action.payload,
      }
    case SET_SELECTED_USER:
      return {
        ...state,
        personalInfo: action.payload,
      }
    case SING_OUT:
      return initialState
    default:
      return state
  }
}
