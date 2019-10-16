import ApolloClient, { gql } from 'apollo-boost'

export const client = new ApolloClient({
  uri: 'https://hansanglab.com/superapi/',
})

export const auth = gql`
  query auth ($email: String!, $password: String!) {
    auth (email: $email, password: $password) {
      result,
      code,
      message,
      sessionId,
      groups { id, name },
      user {
        id,
        first_name,
        last_name,
        bio,
        photo,
        career,
        social_media,
        contact_email,
        phone,
        business_club_id,
        business_club_name,
        city_id,
        city_name,
        country_id,
        country_name,
        business_areas { id, name },
        groups { id, name }
      }
    }
  }
`

export const logaut = gql`
  query logout($session: String!) {
    logout (session : $session){
      result
    }
  }
`
export const getUsersQuery = gql`
query users(
  $business_club_id: Int,
  $business_area_id: Int,
  $city_id: Int,
  $country_id: Int,
  $user_group_id: Int,
  $search: String
)
{
  users (
    business_club_id: $business_club_id,
    business_area_id: $business_area_id,
    city_id: $city_id,
    country_id: $country_id,
    user_group_id: $user_group_id,
    search: $search
  )
  {
    result,
    code,
    message,
    users {
      id,
      first_name,
      last_name,
      bio,
      photo,
      career,
      social_media,
      contact_email,
      phone,
      business_club_id,
      business_club_name,
      city_id,
      city_name,
      country_id,
      country_name,
      business_areas { id, name },
      groups {id, name}
    }
  }
}
`
export const getClubsQuery = gql`
query businessClubList
{
  businessClubList
  {
    result,
    code,
    message,
    businessClubs {
      id,
      parent_id,
      name,
      short_name,
      icon,
      icon2,
      description,
      phone,
      email,
      site,
      usersCount,
      randomUsers {
        photo
      },
      chief_position,
      chief {
        id,
        first_name,
        last_name,
        photo,
        career,
        bio,
        social_media,
        contact_email,
        phone,
        business_club_id,
        business_club_name,
        city_id,
        city_name,
        country_id,
        country_name,
        business_areas { id, name },
        groups {id, name}
      }
    }
  }
}
`
export const getAreasQuery = gql`
  query businessAreaList {
    businessAreaList {
      result,
      code,
      message,
      businessAreas {
        id,
        name,
      }
    }
  }
`
export const getCitiesListQuery = gql`
  query citiesList {
    citiesList {
      result,
      code,
      message,
      citiesList {
        id,
        name,
        country { id, name },
      }
    }
  }
`
