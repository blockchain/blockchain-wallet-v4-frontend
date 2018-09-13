import * as AT from './actionTypes'
import Remote from '../../../remote'
import { mapped, over } from 'ramda-lens'
import { append, compose, lensProp, remove, assoc, map, addIndex } from 'ramda'
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
      const { deviceIndex, deviceName } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value,
        lensProp('devices')
      )
      let assocDeviceName = assoc('device_name', deviceName)
      // eslint-disable-next-line eqeqeq
      let setDeviceName = (d, i) => (i == deviceIndex ? assocDeviceName(d) : d)
      let mapIndexed = addIndex(map)
      return over(valueLens, mapIndexed(setDeviceName), state)
    }
    // TODO: update balance display
    // case AT.UPDATE_DEVICE_BALANCE_DISPLAY: {
    //   const { deviceIndex, showBalances } = payload
    //   const valueLens = compose(
    //     mapped,
    //     KVStoreEntry.value
    //   )
    //   let setShowBalances = assocPath(
    //     ['devices', deviceIndex, 'showBalances'],
    //     showBalances
    //   )
    //   return over(valueLens, setShowBalances, state)
    // }
    // DELETE
    case AT.DELETE_DEVICE_LOCKBOX: {
      const { deviceIndex } = payload
      const valueLens = compose(
        mapped,
        KVStoreEntry.value,
        lensProp('devices')
      )
      return over(valueLens, remove(deviceIndex, 1), state)
    }
    default:
      return state
  }
}
