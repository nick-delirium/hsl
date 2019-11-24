/* eslint-disable no-lonely-if */
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import get from 'lodash/get'
import cacheFolder from '../constants/cacheFolder'

class CachedImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      failed: false,
      imguri: '',
    }
    this._isMounted = false
  }

  /* eslint-disable */
  componentDidMount() {
    FileSystem.getInfoAsync(
      `${cacheFolder + this.props.title}.jpg`
    ).then(({ exists, uri }) => {
      if (exists) this.loadLocal(uri)
      else {
        if (!this.props.streight) {
          fetch(this.props.source)
            .then((response) => response.json())
            .then((result) => {
              const url = get(result, 'media_details.sizes.large.source_url') || result.source_url || '.err'
              const extension = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2)
              // if not jpg/png/gif => error
              if ((extension.toLowerCase() !== 'jpg') && (extension.toLowerCase() !== 'png') && (extension.toLowerCase() !== 'gif')) {
                this.setSafeState({ loading: false, failed: true })
              } else {
                FileSystem.downloadAsync(
                  url,
                  `${cacheFolder + this.props.title}.${extension}`
                ).then(({ uri }) => {
                  this.loadLocal(Platform.OS === 'ios'? uri : url)
                }).catch(e => {
                  // if the online download fails, load the local version
                  this.loadLocal(`${cacheFolder + this.props.title}.${extension}`)
                });
              }
            })
        } else {
          const extension = this.props.source.slice((this.props.source.lastIndexOf(".") - 1 >>> 0) + 2)
          FileSystem.downloadAsync(
            this.props.source,
            `${cacheFolder + this.props.title}.${extension}`
          ).then(({ uri }) => {
            this.loadLocal(Platform.OS === 'ios'? uri : this.props.source)
          }).catch(e => {
            console.log('Image loading error:', e)
            // if the online download fails, load the local version
            this.loadLocal(`${cacheFolder + this.props.title}.${extension}`)
          })
        }
      }
    })
    this._isMounted = true
  }
  /* eslint-enable */

  componentWillUnmount() {
    this._isMounted = false
  }

  setSafeState = (data) => (this._isMounted ? this.setState(data) : null)

  loadLocal(uri) {
    this.setSafeState({ imguri: uri, loading: false })
  }

  render() {
    const { style, categories } = this.props
    const { loading, failed, imguri } = this.state
    if (loading) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', ...style }}>
          <ActivityIndicator
            color="#42C2F3"
            size="large"
          />
        </View>
      )
    }

    if (failed) {
      return <View style={style} />
    }

    return (
      <View style={{ ...style, ...styles.container }}>
        <Image
          source={{ uri: imguri }}
          resizeMethod="scale"
          style={{
            height: style.height,
            overflow: 'hidden',
          }}
        />
        {categories && (
          <View style={styles.category}>
            <Text style={styles.text}>
              {categories.name}
            </Text>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#525252',
    position: 'relative',
  },
  category: {
    padding: 7,
    marginLeft: 10,
    fontSize: 12,
    borderRadius: 2,
    alignSelf: 'flex-start',
    top: -180,
    // backgroundColor: 'rgba(0,0,0, 0.15)',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
})

export default CachedImage
