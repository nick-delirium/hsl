import React, { PureComponent } from 'react'
import { 
  StyleSheet,
  View,
  Text, 
  Image, 
  ActivityIndicator, 
  Dimensions, 
  Platform 
} from 'react-native'
import { FileSystem } from 'expo'

class CachedImage extends PureComponent {
  state = { 
    loading: true, 
    failed: false,
    imguri: '', 
  }

  componentDidMount() {
    fetch(this.props.source)
      .then(response => response.json())
      .then(result => {
        const url = result.source_url || '.err'
        const extension = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2)
        // if not jpg/png/gif => error
        if ((extension.toLowerCase() !== 'jpg') && (extension.toLowerCase() !== 'png') && (extension.toLowerCase() !== 'gif')) {
          this.setState({ loading: false, failed: true })
        } else {
          FileSystem.getInfoAsync(
            `${FileSystem.cacheDirectory + this.props.title}.${extension}`
          ).then(({ exists, uri }) => {
            if (exists) this.loadLocal(uri)
            else {
              FileSystem.downloadAsync(
                url,
              `${FileSystem.cacheDirectory + this.props.title}.${extension}`
              ).then(({ uri }) => {
                this.loadLocal(Platform.OS === 'ios'? uri : url)
              }).catch(e => {
                console.log('Image loading error:', e)
                // if the online download fails, load the local version
                this.loadLocal(`${FileSystem.cacheDirectory + this.props.title}.${extension}`)
              });
            }
          })
        }
      })
  }

  loadLocal(uri) {
    this.setState({ imguri: uri, loading: false })
  }

  render() {
    const { style, categories } = this.props

    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', ...style }}>
          <ActivityIndicator
            color='#42C2F3'
            size='large'
          />
        </View>
      )
    }

    if (this.state.failed) {
      return <Text></Text>
    }

    return (
      <View>
        <Image
          style={style}
          source={{ uri: this.state.imguri }}
          resizeMethod="scale"
        />
        {categories && (
          <View style={styles.category}>
            <Text style={{color: '#fff'}}>{categories.name}</Text>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  category: {
    padding: 7,
    marginLeft: 10,
    fontSize: 12,
    backgroundColor: '#000',
    borderRadius: 2,
    color: '#fff',
    alignSelf: 'flex-start',
    top: -180,
  }
})

export default CachedImage
