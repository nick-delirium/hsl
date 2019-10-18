import {
  client,
  getClubsQuery,
} from '../gqlQueries'
import { SING_OUT } from '../Login/reducer'

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

const initialState = {
  clubs: [],
  setSelectedClub: [],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CLUBS_SUCCESS:
      return {
        ...state,
        clubs: action.payload,
      }
    case SET_SELECTED_CLUB:
      return {
        ...state,
        selectedClub: action.payload,
      }
    case SING_OUT:
      return initialState
    default:
      return state
  }
}
