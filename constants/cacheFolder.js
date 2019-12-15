import * as FileSystem from 'expo-file-system'

const cacheFolder = `${FileSystem.cacheDirectory}/img/`
const cacheDateStorageKey = 'cachedate'

export {
  cacheFolder,
  cacheDateStorageKey,
}
