import * as AT from './actionTypes'
import Remote from '../../../remote'
import { mapped, over } from 'ramda-lens'
import { append, assocPath, compose, dissocPath, lensProp } from 'ramda'
import { KVStoreEntry } from '../../../types'

const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    // CREATE
    case AT.CREATE_METADATA_LOCKBOX: {
      return Remote.Success(payload)
    }
    case AT.CREATE_NEW_DEVICE_ENTRY: {
      const { deviceEntry } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value,
        lensProp('devices')
      )
      return over(valueLens, append(deviceEntry), state)
    }
    // FETCH
    case AT.FETCH_METADATA_LOCKBOX_LOADING: {
      return Remote.Loading
    }
    case AT.FETCH_METADATA_LOCKBOX_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_LOCKBOX_FAILURE: {
      return Remote.Failure(payload)
    }
    // UPDATE
    case AT.UPDATE_DEVICE_NAME: {
      const { deviceID, deviceName } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setDeviceName = assocPath(['devices', deviceID, 'name'], deviceName)
      return over(valueLens, setDeviceName, state)
    }
    case AT.UPDATE_DEVICE_BALANCE_DISPLAY: {
      const { deviceID, showBalances } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      let setShowBalances = assocPath(
        ['devices', deviceID, 'showBalances'],
        showBalances
      )
      return over(valueLens, setShowBalances, state)
    }
    // DELETE
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
