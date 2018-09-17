import * as AT from './actionTypes'
import Remote from '../../../remote'
import { mapped, over, set } from 'ramda-lens'
import {
  append,
  compose,
  lensProp,
  lensPath,
  remove,
  assoc,
  lensIndex
} from 'ramda'
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
        lensProp('devices'),
        lensIndex(parseInt(deviceIndex))
      )

      const accountLabelLens = coin => lensPath([coin, 'accounts', 0, 'label'])

      const setDeviceName = compose(
        assoc('device_name', deviceName),
        set(accountLabelLens('btc'), deviceName + ' - BTC Wallet'),
        set(accountLabelLens('bch'), deviceName + ' - BCH Wallet'),
        set(accountLabelLens('eth'), deviceName + ' - ETH Wallet')
      )

      return over(valueLens, setDeviceName, state)
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
