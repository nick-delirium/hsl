import { client, auth } from './gqlQueries'

const SING_IN = 'app.okbk.sing_in'
const SING_IN_SUCCESS = 'app.okbk.sing_in_succsess'
const SING_IN_FALURE = 'app.okbk.sing_in_falure'
const SING_OUT = 'app.okbk.sing_out'
const CHANGE_TAB = 'app.okbk.change_tab'

export const changeCurrentTab = (newTab) => ({
  type: CHANGE_TAB,
  payload: newTab,
})

export const singInRequest = () => ({
  type: SING_IN,
})
export const singInRequestSuccsess = () => ({
  type: SING_IN_SUCCESS,
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
        dispatch({ type: SING_IN_SUCCESS, payload: response.data })
      } else {
        dispatch({ type: SING_IN_FALURE, payload: response.data.auth.code })
      }
    } catch (e) {
      console.error(e)
      dispatch({ type: SING_IN_FALURE, payload: e.message })
    }
  }
)

export const singOut = () => ({
  type: SING_OUT,
})

const initialState = {
  currentTab: 'feed',
  isLoggedIn: false,
  isLoading: false,
  account: {},
  error: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
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
    case SING_IN_SUCCESS:
      return {
        ...state,
        account: action.payload,
        isLoggedIn: true,
        isLoading: true,
      }
    case SING_OUT:
      return {
        ...state,
        isLoggedIn: false,
      }
    case CHANGE_TAB:
      return {
        ...state,
        currentTab: action.payload,
      }
    default:
      return state
  }
}
