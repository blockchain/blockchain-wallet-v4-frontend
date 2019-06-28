import { over, set, mapped } from 'ramda-lens'
import { assoc, assocPath, compose, lensPath, prepend } from 'ramda'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.UPDATE_METADATA_BUYSELL: {
      return set(
        compose(
          mapped,
          KVStoreEntry.value
        ),
        payload,
        state
      )
    }
    case AT.SET_SFOX_TRADES_BUYSELL: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const setTrades = assocPath(['sfox', 'trades'], payload)
      return over(valueLens, setTrades, state)
    }
    case AT.SET_SFOX_HAS_SEEN_SHUTDOWN: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      return over(
        valueLens,
        assocPath(['sfox', 'has_seen_shutdown'], true),
        state
      )
    }
    case AT.SET_COINIFY_TRADES_BUYSELL: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const setTrades = assocPath(['coinify', 'trades'], payload)
      return over(valueLens, setTrades, state)
    }
    case AT.ADD_COINIFY_TRADE_BUYSELL: {
      let valueLens = compose(
        mapped,
        KVStoreEntry.value,
        lensPath(['coinify', 'trades'])
      )
      return over(valueLens, prepend(payload), state)
    }
    case AT.FETCH_METADATA_BUYSELL_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_BUYSELL:
    case AT.FETCH_METADATA_BUYSELL_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_BUYSELL_FAILURE: {
      return Remote.Failure(payload)
    }

    case AT.SFOX_SET_PROFILE_BUYSELL: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const setAll = compose(
        assocPath(['sfox', 'account_token'], payload.token),
        assocPath(['sfox', 'user'], payload.account.id)
      )

      return over(valueLens, setAll, state)
    }
    case AT.SFOX_SET_JUMIO_TOKEN: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const setJumio = compose(assocPath(['sfox', 'jumio'], payload))
      return over(valueLens, setJumio, state)
    }
    case AT.SFOX_SET_PHONE_CALL: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const setPhoneCall = compose(assocPath(['sfox', 'phone_call'], payload))
      return over(valueLens, setPhoneCall, state)
    }
    case AT.COINIFY_SET_PROFILE_BUYSELL: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const setAll = compose(
        assocPath(['coinify', 'offline_token'], payload.offlineToken),
        assocPath(['coinify', 'user'], payload.trader.id)
      )

      return over(valueLens, setAll, state)
    }
    case AT.WIPE_EXTERNAL: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const wipe = assoc('coinify', { trades: [] })
      return over(valueLens, wipe, state)
    }
    case AT.WIPE_EXTERNAL_SFOX: {
      const valueLens = compose(
        mapped,
        KVStoreEntry.value
      )
      const wipe = assoc('sfox', { trades: [] })
      return over(valueLens, wipe, state)
    }
    default:
      return state
  }
}
