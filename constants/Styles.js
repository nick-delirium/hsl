import {
    Platform,
    PixelRatio,
    Dimensions,
  } from 'react-native';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

function normalize(size) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export const fonts = {
  mini: normalize(12),
  small: normalize(13),
  normal: normalize(15),
  heading: normalize(16),
  big: normalize(18),
}
