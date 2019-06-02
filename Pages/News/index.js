import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'

class News extends React.Component {
  state = {
    data: [],
    isFetching: false,
    error: null,
  }
  componentDidMount() {
    fetch('http://hansanglab.com/wp-json/wp/v2/posts?per_page=30')
      .then(response => response.json())
      .then(result => this.setState({data: result, isFetching: false }))
      .catch(e => {
        console.log(e)
        this.setState({isFetching: false, error: e })
      });
  }

  render() {
    const { data } = this.state
    return (
      <View>
        <Text style={styles.header}>News</Text>
        {data && data.map((item, i) => (
          <Article 
            key={i} 
            data={item}
            title={item.title.rendered}
            descr={item.excerpt.rendered}
            mediaUrl={item._links['wp:attachment'][0].href}
          />
        ))}
      </View>
    )
  }
}

class Article extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // data: props.data,
      // mediaUrl: '',
      imgUrl: null,
      isFetching: false,
      error: null,
    }
  }

  componentDidMount() {
    fetch(this.props.mediaUrl)
      .then(response => response.json())
      .then(result => this.setState({imgUrl: result && result[0].source_url, isFetching: false }))
      .catch(e => {
        console.log(e)
        this.setState({isFetching: false, error: e })
      });
  }

  render () {
    const { title, descr, imgSrc } = this.props
    const { imgUrl } = this.state
    return (
      <View style={styles.card}>

      {imgUrl && <Image style={{flex: 1, height: 140}} source={{uri: imgUrl}}/>}
      <View style={styles.cardText}>
        <Text style={{fontWeight: 'bold'}}>{title}</Text>
        <Text>{descr.split(' \n<')[0]}...</Text>
        <Text>{imgSrc}</Text>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20
  },
  card: {
    marginBottom: 10,
    marginRight: 17,
    marginLeft: 17,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
  },
  cardText: {
    paddingTop: 18,
    paddingRight: 18,
    paddingLeft: 18,
  }
})

export default News