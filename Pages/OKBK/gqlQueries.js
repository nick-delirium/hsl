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

export const subscribeToPush = gql`
  query subscribe(
    $userId: String!,
    $token: String!
  ) {
    subscribe (
      userId: $userId,
      token: $token
    ) {
      result,
      code,
      message
    }
  }
`

export const getOKBKposts = gql`
  query postsList(
    $page: Int!
    $per_page: Int,
    $categories: String
  )
  {
    postsList (
      page: $page,
      per_page: $per_page,
      categories: $categories
    )
    {
      result,
      code,
      message,
      posts {
        id,
        date,
        guid { rendered },
        modified,
        modified_gmt,
        slug,
        status,
        type,
        link,
        title { rendered },
        content { rendered,protected },
        excerpt { rendered,protected },
        author,
        featured_media,
        comment_status,
        ping_status,
        sticky,
        template,
        format,
        meta { _tribe_blocks_recurrence_rules, _tribe_blocks_recurrence_exclusions, _tribe_blocks_recurrence_description },
        categories,
        tags,
        _links {
          self { href },
          collection { href },
          about { href },
          author { href, embeddable } ,
          replies { href, embeddable } ,
          versionHistory { count, href, },
          predecessorVersion { id, href, },
          wpFeaturedmedia { embeddable, href },
          wpAttachment { href },
          wpTerm { taxonomy, embeddable, href },
          curies { name, templated, href }
        },
        comments { commentId, comment, author { userId, name, lastname, photo },
          likes,
          parentId { commentId, comment, author { userId, name, lastname, photo } },
          date
        },
        topComment { commentId, comment, author { userId, name, lastname, photo }, likes},
        likes {
          count,
          authors { userId, photo }
        }
      }
    }
  }
`

export const addCommentQuery = gql`
  mutation addComment (
    $postId: Int!
    $comment: String!
    $userId: Int!
  )
  {
    addComment (
      postId: $postId,
      comment: $comment,
      userId: $userId
    )
    {
      result,
      code,
      message
    }
  }
`

export const deleteCommentQuery = gql`
  mutation removeComment (
    $commentId: Int!
  )
  {
    removeComment (
      commentId: $commentId
    )
    {
      result,
      code,
      message
    }
  }
`

export const addReplayQuery = gql`
  mutation addCommentToComment (
    $postId: Int!
    $comment: String!
    $userId: Int!
    $parentId: Int!
  )
  {
    addCommentToComment (
      postId: $postId,
      comment: $comment,
      userId: $userId,
      parentId: $parentId
    )
    {
      result,
      code,
      message
    }
  }
`

export const addCommentLikeQuery = gql`
  mutation addCommentLike (
    $commentId: Int!
    $userId: Int!
  )
  {
    addCommentLike (
      commentId: $commentId,
      userId: $userId
    )
    {
      result,
      code,
      message
    }
  }
`

export const removeCommentLikeQuery = gql`
mutation removeCommentLike (
  $commentId: Int!
  $userId: Int!
)
{
  removeCommentLike (
    commentId: $commentId,
    userId: $userId
  )
  {
    result,
    code,
    message
  }
}
`
