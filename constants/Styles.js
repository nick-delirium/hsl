import {
  Platform,
  PixelRatio,
  Dimensions,
} from 'react-native'

export const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window')

const scale = SCREEN_WIDTH / 320

function normalize(size) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 3
}

export const fonts = {
  ultra: normalize(11),
  mini: normalize(12),
  small: normalize(13),
  normal: normalize(15),
  heading: normalize(16),
  big: normalize(18),
  bigger: normalize(20),
  veryBig: normalize(22),
}
