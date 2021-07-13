import {
  append,
  assoc,
  assocPath,
  compose,
  lensIndex,
  lensPath,
  lensProp,
  remove
} from 'ramda'
import { mapped, over, set } from 'ramda-lens'

import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'

const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    // CREATE
    case AT.CREATE_METADATA_LOCKBOX: {
      return Remote.Success(payload)
    }
    case AT.CREATE_NEW_DEVICE_ENTRY: {
      const { deviceEntry } = payload
      const valueLens = compose(mapped, KVStoreEntry.value, lensProp('devices'))
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

      // TODO: multiple account support
      const accountLabelLens = coin => lensPath([coin, 'accounts', 0, 'label'])

      const setDeviceName = compose(
        assoc('device_name', deviceName),
        set(accountLabelLens('btc'), deviceName + ' - BTC Wallet'),
        set(accountLabelLens('bch'), deviceName + ' - BCH Wallet'),
        set(accountLabelLens('eth'), deviceName + ' - ETH Wallet'),
        lockboxKv => {
          if (lockboxKv.xlm) {
            return set(
              accountLabelLens('xlm'),
              deviceName + ' - XLM Wallet'
            )(lockboxKv)
          }
          return lockboxKv
        }
      )

      return over(valueLens, setDeviceName, state)
    }
    case AT.ADD_COIN_ENTRY: {
      const { account, coin, deviceIndex } = payload
      let valueLens = compose(
        mapped,
        KVStoreEntry.value,
        lensProp('devices'),
        lensIndex(parseInt(deviceIndex))
      )
      let addCoin = assocPath([coin], account)
      return over(valueLens, addCoin, state)
    }
    case AT.SET_LATEST_TX_ETH_LOCKBOX: {
      const { deviceIndex, txHash } = payload
      let valueLens = compose(
        mapped,
        KVStoreEntry.value,
        lensProp('devices'),
        lensIndex(parseInt(deviceIndex))
      )
      let setTx = assocPath(['eth', 'last_tx'], txHash)
      return over(valueLens, setTx, state)
    }
    case AT.SET_LATEST_TX_TIMESTAMP_ETH_LOCKBOX: {
      const { deviceIndex, timestamp } = payload
      let valueLens = compose(
        mapped,
        KVStoreEntry.value,
        lensProp('devices'),
        lensIndex(parseInt(deviceIndex))
      )
      let setTxTimestamp = assocPath(['eth', 'last_tx_timestamp'], timestamp)
      return over(valueLens, setTxTimestamp, state)
    }
    // DELETE
    case AT.DELETE_DEVICE_LOCKBOX: {
      const { deviceIndex } = payload
      const valueLens = compose(mapped, KVStoreEntry.value, lensProp('devices'))
      return over(valueLens, remove(deviceIndex, 1), state)
    }
    default:
      return state
  }
}
