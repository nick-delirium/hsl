/* eslint-disable */
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

const PUSH_ENDPOINT = 'https://your-server.com/users/push-token'

function registerForPushNotificationsAsync() {
  return new Promise(async (resolve, reject) => {
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
      throw new Error(e)
    }
  })
}

export const pushNotification = (token) => {
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
      user: {
        username: 'Brent',
      },
    }),
  })
}

export default registerForPushNotificationsAsync
