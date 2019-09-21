const mainUrl = 'https://hansanglab.com/wp-json'
const url = `${mainUrl}/wp/v2`

const getPosts = (limit, page = 1) => `${url}/posts?per_page=${limit}&page=${page}`
const getPostsByCategory = (category, limit, page = 1) => `${url}/posts?categories=${category}&per_page=${limit}&page=${page}`
const getPromoCards = (limit) => getPostsByCategory(617, limit)
const getCategories = () => `${url}/categories?per_page=100&orderby=count&order=desc`
const getPostBySlug = (slug) => `${url}/posts?slug=${slug}`
const getEvents = (startDate, endDate, limit) => (
  `${mainUrl}/tribe/events/v1/events/?per_page=${limit}&status=publish&start_date=${startDate}${endDate ? `&end_date=${endDate}` : ''}`
)
const search = (query, limit) => `${url}/posts?search=${query}&per_page=${limit}`
// we cant get more than 50...
const getPlaces = (page = 1) => `${mainUrl}/tribe/events/v1/venues?per_page=50&page=${page}`

export default {
  getPosts,
  getPostsByCategory,
  getCategories,
  getPostBySlug,
  getEvents,
  search,
  getPlaces,
  getPromoCards,
}
