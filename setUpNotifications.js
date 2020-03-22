/* eslint-disable */
import { Notifications } from 'expo'
import { Platform } from 'react-native'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';

const PUSH_ENDPOINT = 'https://your-server.com/users/push-token'

function registerForPushNotificationsAsync() {
  return new Promise(async (resolve, reject) => {
    if (!Constants.isDevice) reject('not a real device')
    try {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        reject('no permission')
      }

      const token = await Notifications.getExpoPushTokenAsync()
      resolve(token)
    } catch (e) {
      reject(e)
    }
  })
}

export function dismissNotifications() {
  if (Platform.OS === 'ios') {
    Notifications.setBadgeNumberAsync(0)
  } else {
    Notifications.dismissAllNotificationsAsync()
  }
}

export function createAndroidNotificationChanel() {
  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('new-posts', {
      name: 'New posts',
      sound: true,
    });
  }
}

export default registerForPushNotificationsAsync
