import {
  client,
  getUsersQuery,
} from '../gqlQueries'
import { SING_OUT } from '../Login/reducer'

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

const initialState = {
  users: [],
  personalInfo: {},
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
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
