import { assoc, assocPath, compose, lensPath, prepend, set } from 'ramda'
import { mapped, over } from 'ramda-lens'
import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { derivationMap, BUYSELL } from '../config'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore buysell reducers', () => {
  const typeId = derivationMap[BUYSELL]
  const buySellObject = {
    sfox: {
      trades: []
    },
    coinify: {
      trades: []
    }
  }

  const buySellMetadata = set(
    KVStoreEntry.value,
    buySellObject,
    KVStoreEntry.createEmpty(typeId)
  )

  const buySellMetadataSuccess = Remote.Success(buySellMetadata)
  const valueLens = compose(
    mapped,
    KVStoreEntry.value
  )

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_BUYSELL_LOADING', () => {
    const action = actions.fetchMetadataBuySellLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_BUYSELL_FAILURE', () => {
    const error = 'Cannot load buysell metadata'
    const action = actions.fetchMetadataBuySellFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_BUYSELL_SUCCESS', () => {
    const action = actions.fetchMetadataBuySellSuccess(buySellMetadata)
    const expectedState = buySellMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle CREATE_METADATA_BUYSELL', () => {
    const action = actions.createMetadataBuySell(buySellMetadata)
    const expectedState = buySellMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle UPDATE_METADATA_BUYSELL', () => {
    const action = actions.updateMetadataBuySell(buySellObject)
    const expectedState = buySellMetadataSuccess
    expect(reducer(buySellMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SET_SFOX_TRADES_BUYSELL', () => {
    const trades = [1, 2, 3]
    const action = actions.setSfoxTradesBuySell(trades)
    const setSfoxTrades = assocPath(['sfox', 'trades'], trades)
    const expectedState = over(valueLens, setSfoxTrades, buySellMetadataSuccess)
    expect(reducer(buySellMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle ADD_COINIFY_TRADE_BUYSELL true', () => {
    const newTrade = 5
    const action = actions.addCoinifyTradeBuySell(newTrade)
    const tradesLens = compose(
      valueLens,
      lensPath(['coinify', 'trades'])
    )
    const expectedState = over(
      tradesLens,
      prepend(newTrade),
      buySellMetadataSuccess
    )
    expect(reducer(buySellMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle SFOX_SET_PROFILE_BUYSELL false', () => {
    const payload = {
      token: 'some sfox token',
      account: {
        id: 42
      }
    }
    const action = actions.sfoxSetProfileBuySell(payload)
    const setSfoxProfile = compose(
      assocPath(['sfox', 'account_token'], payload.token),
      assocPath(['sfox', 'user'], payload.account.id)
    )
    const expectedState = over(
      valueLens,
      setSfoxProfile,
      buySellMetadataSuccess
    )
    expect(reducer(buySellMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle COINIFY_SET_PROFILE_BUYSELL', () => {
    const payload = {
      offlineToken: 'some coinify token',
      trader: {
        id: 42
      }
    }
    const action = actions.coinifySetProfileBuySell(payload)
    const setCoinifyProfile = compose(
      assocPath(['coinify', 'offline_token'], payload.offlineToken),
      assocPath(['coinify', 'user'], payload.trader.id)
    )
    const expectedState = over(
      valueLens,
      setCoinifyProfile,
      buySellMetadataSuccess
    )
    expect(reducer(buySellMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle WIPE_EXTERNAL', () => {
    const action = actions.wipeExternal()
    const wipe = assoc('coinify', { trades: [] })
    const expectedState = over(valueLens, wipe, buySellMetadataSuccess)
    expect(reducer(buySellMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle WIPE_EXTERNAL_SFOX', () => {
    const action = actions.wipeExternalSfox()
    const wipe = assoc('sfox', { trades: [] })
    const expectedState = over(valueLens, wipe, buySellMetadataSuccess)
    expect(reducer(buySellMetadataSuccess, action)).toEqual(expectedState)
  })
})
