import { append, assoc, assocPath, compose, set } from 'ramda'
import { mapped, over } from 'ramda-lens'
import Remote from '../../../remote'
import { KVStoreEntry } from '../../../types'
import { lensProp } from '../../../types/util'
import { derivationMap, SHAPESHIFT } from '../config'
import reducer from './reducers'
import * as actions from './actions'

const INITIAL_STATE = Remote.NotAsked

describe('kvStore shapeshift reducers', () => {
  const typeId = derivationMap[SHAPESHIFT]
  const shapeshiftObject = {
    trades: [
      {
        quote: { deposit: 'my deposit address' },
        status: 'no_deposits'
      },
      {
        quote: { deposit: 'my deposit address 2' },
        status: 'no_deposits'
      }
    ],
    USAState: {
      Code: 'AL',
      Name: 'Alabama'
    }
  }

  const shapeshiftMetadata = set(
    KVStoreEntry.value,
    shapeshiftObject,
    KVStoreEntry.createEmpty(typeId)
  )

  const shapeshiftMetadataSuccess = Remote.Success(shapeshiftMetadata)
  const valueLens = compose(
    mapped,
    KVStoreEntry.value
  )

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  it('should handle FETCH_METADATA_SHAPESHIFT_LOADING', () => {
    const action = actions.fetchMetadataShapeshiftLoading()
    const expectedState = Remote.Loading
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_SHAPESHIFT_FAILURE', () => {
    const error = 'Cannot load shapeshift metadata'
    const action = actions.fetchMetadataShapeshiftFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_METADATA_SHAPESHIFT_SUCCESS', () => {
    const action = actions.fetchMetadataShapeshiftSuccess(shapeshiftMetadata)
    const expectedState = shapeshiftMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle CREATE_METADATA_SHAPESHIFT', () => {
    const action = actions.createMetadataShapeshift(shapeshiftMetadata)
    const expectedState = shapeshiftMetadataSuccess
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle FETCH_SHAPESHIFT_TRADE_FAILURE', () => {
    const error = 'Cannot load shapeshift trade metadata'
    const action = actions.fetchShapeshiftTradeFailure(error)
    const expectedState = Remote.Failure(error)
    expect(reducer(undefined, action)).toEqual(expectedState)
  })

  it('should handle ADD_STATE_METADATA_SHAPESHIFT', () => {
    const usState = { code: 'CA', name: 'California' }
    const action = actions.addStateMetadataShapeshift(usState)
    const setUSState = assoc('USAState', { Code: 'CA', Name: 'California' })
    const expectedState = over(valueLens, setUSState, shapeshiftMetadataSuccess)
    expect(reducer(shapeshiftMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle ADD_TRADE_METADATA_SHAPESHIFT', () => {
    const trade = {
      status: 'no_deposits',
      time: 'Tue Mar 13 2018 15:13:35 GMT+0000 (GMT)',
      timestamp: 1520954015584,
      quote: {}
    }
    const action = actions.addTradeMetadataShapeshift(trade)
    const setShapeshiftTrade = append(trade)
    const tradesLens = compose(
      valueLens,
      lensProp('trades')
    )
    const expectedState = over(
      tradesLens,
      setShapeshiftTrade,
      shapeshiftMetadataSuccess
    )
    expect(reducer(shapeshiftMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle UPDATE_TRADE_METADATA_SHAPESHIFT', () => {
    const action = actions.updateTradeMetadataShapeshift(
      'my deposit address',
      'complete',
      'my hashOut'
    )
    const expectedState = Remote.Success(
      set(
        KVStoreEntry.value,
        assocPath(
          ['trades', 0],
          {
            quote: { deposit: 'my deposit address' },
            status: 'complete',
            hashOut: 'my hashOut'
          },
          shapeshiftObject
        ),
        KVStoreEntry.createEmpty(typeId)
      )
    )
    expect(reducer(shapeshiftMetadataSuccess, action)).toEqual(expectedState)
  })

  it('should handle FETCH_SHAPESHIFT_TRADE_SUCCESS', () => {
    const payload = {
      status: 'complete',
      address: 'my deposit address 2',
      incomingCoin: 1,
      outgoingCoin: 15,
      incomingType: 'BTC',
      outgoingType: 'ETH'
    }
    const action = actions.fetchShapeshiftTradeSuccess(payload)
    const expectedState = Remote.Success(
      set(
        KVStoreEntry.value,
        assocPath(
          ['trades', 1],
          {
            status: payload.status,
            quote: {
              deposit: payload.address,
              depositAmount: payload.incomingCoin,
              withdrawalAmount: payload.outgoingCoin,
              pair: 'btc_eth'
            }
          },
          shapeshiftObject
        ),
        KVStoreEntry.createEmpty(typeId)
      )
    )
    expect(reducer(shapeshiftMetadataSuccess, action)).toEqual(expectedState)
  })
})
