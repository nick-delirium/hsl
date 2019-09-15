const SING_IN = 'app.okbk.sing_in'
const SING_OUT = 'app.okbk.sing_out'
const CHANGE_TAB = 'app.okbk.change_tab'

export const changeCurrentTab = (newTab) => ({
  type: CHANGE_TAB,
  payload: newTab,
})

export const singIn = (account) => ({
  type: SING_IN,
  payload: account,
})

export const singOut = () => ({
  type: SING_OUT,
})

const initialState = {
  currentTab: 'feed',
  isLoggedIn: true,
  account: '',
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SING_IN:
      return {
        ...state,
        account: action.payload,
        isLoggedIn: true,
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
