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
      name,
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
export const getUsers = gql`
query users(
  $session: String!,
  $business_club_id: Int,
  $business_area_id: Int,
  $city_id: Int,
  $country_id: Int,
  $user_group_id: Int,
  $search: String
)
{
  users (
      session : $session,
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
          name,
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
