import React from 'react'
import { WebView } from 'react-native-webview'
import {
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native'

const { width } = Dimensions.get('window')


const IframeRender = ({ atrs, onRemoteUrlPress, styles }) => {
  const { OS } = Platform
  // eslint-disable-next-line camelcase
  const is_iOS = OS === 'ios'
  const videoId = atrs.src.split('/')[4]
  const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`
  // eslint-disable-next-line camelcase
  if (is_iOS) {
    return (
      <WebView
        key={videoId}
        source={{ uri: atrs.src }}
        style={styles.videoFrameContainer}
      />
    )
  }
  return (
    <TouchableOpacity
      key={videoId}
      style={styles.videoFrameContainer}
      onPress={() => onRemoteUrlPress(atrs.src)}
    >
      <Image source={{ uri: thumbnail }} style={styles.videoFrameContainer} />
      <Image
        source={require('@/assets/images/youtube-play-btn.png')}
        style={{ position: 'absolute', top: (0.56 * (width - 40) - 56) / 2, right: (width - 40 - 80) / 2 }}
      />
    </TouchableOpacity>
  )
}

export default IframeRender
