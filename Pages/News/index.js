import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import Article from './components/Article.js'

class News extends React.Component {
  state = {
    data: [],
    isFetching: true,
    error: null,
  }
  componentDidMount() {
    fetch('http://hansanglab.com/wp-json/wp/v2/posts?per_page=30')
      .then(response => response.json())
      .then(result => this.setState({data: result, isFetching: false }))
      .catch(e => {
        console.error(e)
        this.setState({isFetching: false, error: e })
      });
  }

  render() {
    const { data } = this.state
    return (
      <View>
        <Text style={styles.header}>News</Text>
        {data && data.map((item, i) => {
          let mediaUrl = item._links['wp:attachment'] && item._links['wp:attachment'][0] && item._links['wp:attachment'][0].href
          return (
          <Article 
            key={i} 
            data={item}
            title={item.title.rendered}
            descr={item.excerpt.rendered}
            mediaUrl={mediaUrl ? mediaUrl : null}
          />
          )
          })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20
  },
})

export default News