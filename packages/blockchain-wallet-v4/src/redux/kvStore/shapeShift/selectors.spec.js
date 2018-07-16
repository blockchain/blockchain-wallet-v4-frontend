import { reverse } from 'ramda'
import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore shapeshift selectors', () => {
  const pendingTrade = {
    status: 'no_deposits',
    hashIn: 'hashin2',
    time: 'Tue Mar 13 2018 18:07:30 GMT+0000 (GMT)',
    timestamp: 1520964450657,
    quote: {
      orderId: '1',
      quotedRate: '0.07',
      deposit: '0x50b3b88941948ef337458f766971c407e7180a29',
      minerFee: '0.002',
      pair: 'eth_btc',
      withdrawal: '0xf606506de6c22574b1f02392bd2b1ba08c7040f7',
      withdrawalAmount: '0.05',
      depositAmount: '0.00030224'
    }
  }

  const completeTrade = {
    status: 'complete',
    hashIn: 'hashin1',
    time: 'Tue May 29 2018 16:33:43 GMT+0100 (BST)',
    timestamp: 1527608023019,
    quote: {
      orderId: '0',
      quotedRate: '0.07402171',
      deposit: '0x50c3b88941948ef337458f766971c407e7180a29',
      minerFee: '0.00015',
      pair: 'eth_btc',
      withdrawalAmount: '0.00014888',
      depositAmount: 0.00403769
    }
  }

  const trades = [pendingTrade, completeTrade]

  const USAState = {
    Code: 'AL',
    Name: 'Alabama'
  }

  const shapeshiftMetadata = {
    value: {
      trades,
      USAState
    }
  }

  const successState = {
    kvStorePath: {
      shapeshift: Remote.Success(shapeshiftMetadata)
    }
  }

  it('getMetadata should return success of metadata', () => {
    const expectedResult = Remote.Success(shapeshiftMetadata)
    expect(selectors.getMetadata(successState)).toEqual(expectedResult)
  })

  it('getUsState should return success of USAState', () => {
    const expectedResult = Remote.Success(USAState)
    expect(selectors.getUsState(successState)).toEqual(expectedResult)
  })

  it('getTrades should return success of trades', () => {
    const expectedResult = Remote.Success(reverse(trades))
    expect(selectors.getTrades(successState)).toEqual(expectedResult)
  })

  it('getTrade should return success of trade', () => {
    const completeTradeAddress = '0x50c3b88941948ef337458f766971c407e7180a29'
    const expectedResult = Remote.Success(completeTrade)
    expect(selectors.getTrade(completeTradeAddress, successState)).toEqual(
      expectedResult
    )
  })

  const loadingState = {
    kvStorePath: {
      shapeshift: Remote.Loading
    }
  }

  it('getMetadata should return loading in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getMetadata(loadingState)).toEqual(expectedResult)
  })

  it('getUsState should return loading in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getUsState(loadingState)).toEqual(expectedResult)
  })

  it('getTrades should return loading in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getTrades(loadingState)).toEqual(expectedResult)
  })

  it('getTrade should return loading in loading state', () => {
    const completeTradeAddress = '0x50c3b88941948ef337458f766971c407e7180a29'
    const expectedResult = Remote.Loading
    expect(selectors.getTrade(completeTradeAddress, loadingState)).toEqual(
      expectedResult
    )
  })

  const failureState = {
    kvStorePath: {
      shapeshift: Remote.Failure('Error in shapeshift metadata')
    }
  }

  it('getMetadata should return failure in failure state', () => {
    const expectedResult = Remote.Failure('Error in shapeshift metadata')
    expect(selectors.getMetadata(failureState)).toEqual(expectedResult)
  })

  it('getUsState should return failure in failure state', () => {
    const expectedResult = Remote.Failure('Error in shapeshift metadata')
    expect(selectors.getUsState(failureState)).toEqual(expectedResult)
  })

  it('getTrades should return failure in failure state', () => {
    const expectedResult = Remote.Failure('Error in shapeshift metadata')
    expect(selectors.getTrades(failureState)).toEqual(expectedResult)
  })

  it('getTrade should return failure in failure state', () => {
    const completeTradeAddress = '0x50c3b88941948ef337458f766971c407e7180a29'
    const expectedResult = Remote.Failure('Error in shapeshift metadata')
    expect(selectors.getTrade(completeTradeAddress, failureState)).toEqual(
      expectedResult
    )
  })
})
