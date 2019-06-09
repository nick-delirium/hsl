const getPosts = (limit) => `http://hansanglab.com/wp-json/wp/v2/posts?per_page=${limit}`

export default {
  getPosts
}
