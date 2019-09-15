import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "<YOUR-API-KEY>",
  authDomain: "<YOUR-AUTH-DOMAIN>",
  databaseURL: "<YOUR-DATABASE-URL>",
  storageBucket: "<YOUR-STORAGE-BUCKET>",
  projectId: '',
  messageSenderId: '',
}

const initFirebase = (token) => {
  firebase.initializeApp(firebaseConfig)
  firebase.auth().signInWithCustomToken(token)
}

export default initFirebase
