import React, { PureComponent } from 'react'
import { View, Text, Image, ActivityIndicator, Dimensions, Platform } from 'react-native'
import { FileSystem } from 'expo'

class CachedImage extends PureComponent {
  state = { 
    loading: true, 
    failed: false,
    imguri: '', 
  }

  componentDidMount() {
    const extension = this.props.source.slice((this.props.source.lastIndexOf(".") - 1 >>> 0) + 2)
    // if not jpg/png/gif => error
    if ((extension.toLowerCase() !== 'jpg') && (extension.toLowerCase() !== 'png') && (extension.toLowerCase() !== 'gif')) {
      this.setState({ loading: false, failed: true })
    }

    FileSystem.getInfoAsync(
      `${FileSystem.cacheDirectory + this.props.title}.${extension}`
    ).then(({ exists, uri }) => {
      if (exists) this.loadLocal(uri)
      else {
        FileSystem.downloadAsync(
          this.props.source,
        `${FileSystem.cacheDirectory + this.props.title}.${extension}`
        ).then(({ uri }) => {
          this.loadLocal(Platform.OS === 'ios'? uri : this.props.source)
        }).catch(e => {
          console.log('Image loading error:', e)
          // if the online download fails, load the local version
          this.loadLocal(`${FileSystem.cacheDirectory + this.props.title}.${extension}`)
        });
      }
    })
  }

  loadLocal(uri) {
    this.setState({ imguri: uri, loading: false })
  }

  render() {
    const { style } = this.props

    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator
            color='#42C2F3'
            size='large'
          />
        </View>
      )
    }
    if (this.state.failed) {
      return( <Text>error</Text> );
    }
    return (
      <View>
        <Image
          style={style}
          source={{ uri: this.state.imguri }}
        />
      </View>
    )
  }
}

export default CachedImage
