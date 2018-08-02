import * as AT from './actionTypes'
import Remote from '../../../remote'
import { mapped, over } from 'ramda-lens'
import { assocPath, compose } from 'ramda'
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
    case AT.ADD_DEVICE_LOCKBOX: {
      const { deviceID, deviceName } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setLabel = assocPath(['devices', deviceID], { deviceName })
      return over(valueLens, setLabel, state)
    }
    case AT.SAVE_DEVICE_LOCKBOX: {
      const { deviceID, accounts } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setAccounts = assocPath(['devices', deviceID, 'accounts'], accounts)
      return over(valueLens, setAccounts, state)
    }
    default:
      return state
  }
}
