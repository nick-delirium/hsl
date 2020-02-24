import { useState, useCallback } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { Keyboard } from 'react-native'
import { events } from '@/analytics'
import {
  client,
  getUsersQuery,
} from '../../gqlQueries'

function useMemberSearch(initialValue = '', activeTab, setFoundData) {
  const [searchFieldValue, setFieldValue] = useState(initialValue)

  const getUsers = useCallback((id, fromItem = false) => {
    if (searchFieldValue === '' && !fromItem) return
    Keyboard.dismiss()
    const searchByItem = {
      business_club_id: activeTab === 'okbk' ? id : undefined,
      business_area_id: activeTab === 'areas' ? id : undefined,
      city_id: activeTab === 'cities' ? id : undefined,
    }
    const searchByQuery = {
      search: searchFieldValue,
    }

    events.clickOnSearch(searchFieldValue)
    trackPromise(
      client.query({
        query: getUsersQuery,
        variables: fromItem ? searchByItem : searchByQuery,
      })
        .then((response) => {
          const resultData = {
            asked: true,
            data: response.data.users.users.length > 0 ? response.data.users.users : [],
          }
          setFoundData(resultData)
        }),
    )
  }, [searchFieldValue, activeTab])

  return {
    searchFieldValue,
    setFieldValue,
    getUsers,
  }
}

export default useMemberSearch
