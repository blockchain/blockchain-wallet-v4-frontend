import * as AT from './actionTypes'
import Remote from '../../../remote'
import { mapped, over } from 'ramda-lens'
import { assocPath, compose, dissocPath } from 'ramda'
import { KVStoreEntry } from '../../../types'

const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_METADATA_LOCKBOX_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_LOCKBOX:
    case AT.FETCH_METADATA_LOCKBOX_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_LOCKBOX_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.STORE_DEVICE_NAME: {
      const { deviceID, deviceName } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setDeviceName = assocPath(['devices', deviceID], { deviceName })
      return over(valueLens, setDeviceName, state)
    }
    case AT.STORE_DEVICE_BACKUP_FLAG: {
      const { deviceID, backupConfirmed } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setBackupFlag = assocPath(['devices', deviceID], { backupConfirmed })
      return over(valueLens, setBackupFlag, state)
    }
    case AT.STORE_DEVICE_ACCOUNTS: {
      const { deviceID, accounts } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setAccounts = assocPath(['devices', deviceID, 'accounts'], accounts)
      return over(valueLens, setAccounts, state)
    }
    case AT.DELETE_DEVICE_LOCKBOX: {
      const { deviceID } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let removeAccount = dissocPath(['devices', deviceID])
      return over(valueLens, removeAccount, state)
    }
    default:
      return state
  }
}
