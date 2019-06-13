const url = `https://hansanglab.com/wp-json/wp/v2`

const getPosts = (limit) => `${url}/posts?per_page=${limit}`
const getPostsByCategory = (category, limit) => `${url}/posts?categories=${category}&per_page=${limit}`
const getCategories = () => `${url}/categories?per_page=100`
const getPostBySlug = (slug) => `${url}/posts?slug=${slug}`

export default {
  getPosts,
  getPostsByCategory,
  getCategories,
  getPostBySlug,
}
