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
import * as FileSystem from 'expo-file-system'

class CachedImage extends PureComponent {
  _isMounted = false;
  state = { 
    loading: true, 
    failed: false,
    imguri: '', 
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    FileSystem.getInfoAsync(
      `${FileSystem.cacheDirectory + this.props.title}.jpg`
    ).then(({ exists, uri }) => {
      if (exists) this.loadLocal(uri)
      else {
        if (!this.props.streight) {
        fetch(this.props.source)
          .then(response => response.json())
          .then(result => {
            const url = result.source_url || '.err'
            const extension = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2)
            // if not jpg/png/gif => error
            if ((extension.toLowerCase() !== 'jpg') && (extension.toLowerCase() !== 'png') && (extension.toLowerCase() !== 'gif')) {
              this.setSafeState({ loading: false, failed: true })
            } else {
              FileSystem.downloadAsync(
                url,
                `${FileSystem.cacheDirectory + this.props.title}.${extension}`
              ).then(({ uri }) => {
                this.loadLocal(Platform.OS === 'ios'? uri : url)
              }).catch(e => {
                // if the online download fails, load the local version
                this.loadLocal(`${FileSystem.cacheDirectory + this.props.title}.${extension}`)
              });
            }
          })
        } else {
          const extension = this.props.source.slice((this.props.source.lastIndexOf(".") - 1 >>> 0) + 2)
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
      }
    })
    this._isMounted = true
  }

  loadLocal(uri) {
    this.setSafeState({ imguri: uri, loading: false })
  }

  setSafeState = (data) => {
    return this._isMounted ? this.setState(data) : null
  }

  render() {
    const { style, categories } = this.props

    if (this.state.loading) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', ...style }}>
          <ActivityIndicator
            color='#42C2F3'
            size='large'
          />
        </View>
      )
    }

    if (this.state.failed) {
      return <View style={style}></View>
    }

    return (
      <View
        style={{ ...style, backgroundColor: '#525252' }}
      >
        <Image
          source={{ uri: this.state.imguri }}
          resizeMethod="scale"
          style={{ height: style.height}}
        />
        {categories && (
          <View style={styles.category}>
            <Text style={{color: '#000', fontWeight: 'bold'}}>{categories.name}</Text>
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
    opacity: 0.7, 
    borderRadius: 2,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    top: -180,
  }
})

export default CachedImage
