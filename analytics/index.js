import * as Amplitude from 'expo-analytics-amplitude'

const AmplitudeAPIKey = 'bbca3d5fb31f12780ba56d2d245b5ab6'

const setUpAnalytics = (userId, userParams) => {
  Amplitude.initialize(AmplitudeAPIKey)
  Amplitude.setUserId(userId)
  if (userParams !== undefined) {
    Amplitude.setUserProperties(userParams)
  }
}

const logEvent = (eventName, info) => {
  if (info !== undefined) {
    return Amplitude.logEventWithProperties(eventName, info)
  }
  return Amplitude.logEvent(eventName)
}

const events = {
  openApp: (id, okbkLogin) => {
    logEvent('open app', { user: id, okbkLogin })
  },
  openPost: (id) => {
    logEvent('open post', { post_id: id })
  },
  closePost: () => {
    logEvent('close post')
  },
  openDrawer: () => {
    logEvent('open drawer')
  },
  closeDrawer: () => {
    logEvent('close drawer')
  },
  clickOnDrawerNavigation: (destination) => {
    console.log('click on nav', destination)
    logEvent('click on drawer nav', { destination })
  },
  clickOnSocialLink: (type) => {
    logEvent('click on social link', { type })
  },
}

export {
  setUpAnalytics,
  events,
}
