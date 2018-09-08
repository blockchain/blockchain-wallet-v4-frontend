import * as AT from './actionTypes'
import Remote from '../../../remote'
import { mapped, over } from 'ramda-lens'
import { assoc, append, compose, lensProp, reject, propEq, map } from 'ramda'
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
        KVStoreEntry.value,
        lensProp('devices')
      )
      let isDevice = propEq('device_id', deviceID)
      let assocDeviceName = assoc('device_name', deviceName)
      let setDeviceName = d => (isDevice(d) ? assocDeviceName(d) : d)
      return over(valueLens, map(setDeviceName), state)
    }
    // TODO: update balance display
    // case AT.UPDATE_DEVICE_BALANCE_DISPLAY: {
    //   const { deviceID, showBalances } = payload
    //   const valueLens = compose(
    //     mapped,
    //     KVStoreEntry.value
    //   )
    //   let setShowBalances = assocPath(
    //     ['devices', deviceID, 'showBalances'],
    //     showBalances
    //   )
    //   return over(valueLens, setShowBalances, state)
    // }
    // DELETE
    case AT.DELETE_DEVICE_LOCKBOX: {
      const { deviceID } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value,
        lensProp('devices')
      )
      let removeAccount = reject(propEq('device_id', deviceID))
      return over(valueLens, removeAccount, state)
    }
    default:
      return state
  }
}
