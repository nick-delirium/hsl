import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'

class Article extends React.Component {
constructor(props) {
    super(props)
    this.state = {
    imgUrl: null,
    isFetching: false,
    error: null,
    }
}

componentDidMount() {
    if (this.props.mediaUrl) {
    fetch(this.props.mediaUrl)
        .then(response => response.json())
        .then(result => this.setState({imgUrl: result && result[0] && result[0].source_url, isFetching: false }))
        .catch(e => {
        console.error(e)
        this.setState({isFetching: false, error: e })
        })
    }
}

render () {
  const { title, descr, imgSrc } = this.props, 
    { imgUrl } = this.state;

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

export default Article;