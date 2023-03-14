import { FirebaseApp } from 'firebase/app'
import {
  activate,
  fetchConfig,
  getAll,
  getRemoteConfig as _getRemoteConfig,
  RemoteConfig
} from 'firebase/remote-config'

let remoteConfig: RemoteConfig | undefined

const withFirebaseRemoteConfig = <T>(
  firebaseApp: FirebaseApp,
  callback: (remoteConfig: RemoteConfig) => T
) => {
  remoteConfig =
    typeof remoteConfig === 'undefined'
      ? (remoteConfig = _getRemoteConfig(firebaseApp))
      : remoteConfig

  return callback(remoteConfig)
}

export const makeRemoteConfigApi = (firebaseApp: FirebaseApp) => {
  const fetchAndCacheRemoteConfig = () => withFirebaseRemoteConfig(firebaseApp, fetchConfig)

  const activateRemoteConfig = () => withFirebaseRemoteConfig(firebaseApp, activate)

  const getRemoteConfig = () => withFirebaseRemoteConfig(firebaseApp, getAll)

  return {
    activateRemoteConfig,
    fetchAndCacheRemoteConfig,
    getRemoteConfig
  }
}
