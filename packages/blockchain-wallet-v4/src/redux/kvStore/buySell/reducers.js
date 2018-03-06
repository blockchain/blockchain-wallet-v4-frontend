import { over, set, mapped } from 'ramda-lens'
import { assocPath, compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import Remote from '../../../remote'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.UPDATE_METADATA_BUYSELL: {
      return set(compose(mapped, KVStoreEntry.value), payload, state)
    }
    case AT.SET_TRADES_BUYSELL: {
      let valueLens = compose(mapped, KVStoreEntry.value)
      let setTrades = assocPath(['sfox', 'trades'], payload)
      return over(valueLens, setTrades, state)
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

    case AT.SET_PROFILE_BUYSELL: {
      let valueLens = compose(mapped, KVStoreEntry.value)
      let setProfile = assocPath(['sfox', 'account_token'], payload.token)
      console.log('set profile buysell kvstore reducer', payload)
      return over(valueLens, setProfile, state)
    }
    default:
      return state
  }
}
