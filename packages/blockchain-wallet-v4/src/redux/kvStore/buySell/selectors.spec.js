import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore root selectors', () => {
  const coinifyTrades = [
    {
      id: 42,
      state: 'awaiting_transfer_in',
      confirmed: false,
      is_buy: false
    }
  ]

  const sfoxTrades = [
    {
      id: 'my sfox trade id',
      state: 'processing',
      tx_hash: 'my sfox tx hash',
      confirmed: false,
      is_buy: false
    }
  ]

  const buySellMetadata = {
    value: {
      coinify: {
        offline_token: 'my coinify token',
        trades: coinifyTrades,
        user: 42
      },
      sfox: {
        account_token: 'my sfox account token',
        trades: sfoxTrades,
        user: 'my user id'
      }
    }
  }

  const successState = {
    kvStorePath: {
      buySell: Remote.Success(buySellMetadata)
    }
  }

  const noTradesKeyState = {
    kvStorePath: {
      buySell: Remote.Success({
        value: {
          coinify: {
            offline_token: 'my coinify token',
            user: 42
          },
          sfox: {
            account_token: 'my sfox account token',
            user: 'my user id'
          }
        }
      })
    }
  }

  it('getMetadata should return success of metadata', () => {
    const expectedResult = Remote.Success(buySellMetadata)
    expect(selectors.getMetadata(successState)).toEqual(expectedResult)
  })

  it('getSfoxTrades should return success of metadata sfox trades in success state', () => {
    const expectedResult = Remote.Success(sfoxTrades)
    expect(selectors.getSfoxTrades(successState)).toEqual(expectedResult)
  })

  it('getSfoxTrades should return success of empty array when there\'s no "trades" key in sfox metadata', () => {
    const expectedResult = Remote.Success([])
    expect(selectors.getSfoxTrades(noTradesKeyState)).toEqual(expectedResult)
  })

  it('getSfoxUser should return success of metadata sfox user in success state', () => {
    const expectedResult = Remote.Success('my user id')
    expect(selectors.getSfoxUser(successState)).toEqual(expectedResult)
  })

  it('getCoinifyTrades should return success of empty array when there\'s no "trades" key in coinify metadata', () => {
    const expectedResult = Remote.Success([])
    expect(selectors.getCoinifyTrades(noTradesKeyState)).toEqual(expectedResult)
  })

  it('getCoinifyTrades should return success of metadata coinify trades in success state', () => {
    const expectedResult = Remote.Success(coinifyTrades)
    expect(selectors.getCoinifyTrades(successState)).toEqual(expectedResult)
  })

  it('getBuySellTxHashMatch should return buy_sell in success state if hash exists', () => {
    const expectedResult = 'buy-sell'
    expect(
      selectors.getBuySellTxHashMatch(successState, 'my sfox tx hash')
    ).toEqual(expectedResult)
  })

  const loadingState = {
    kvStorePath: {
      buySell: Remote.Loading
    }
  }

  it('getMetadata should return loading of metadata', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getMetadata(loadingState)).toEqual(expectedResult)
  })

  it('getSfoxTrades should return loading of metadata sfox trades in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getSfoxTrades(loadingState)).toEqual(expectedResult)
  })

  it('getSfoxUser should return loading of metadata sfox user in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getSfoxUser(loadingState)).toEqual(expectedResult)
  })

  it('getCoinifyTrades should return loading of metadata coinify trades in loading state', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getCoinifyTrades(loadingState)).toEqual(expectedResult)
  })

  it('getBuySellTxHashMatch should return false in loading state', () => {
    const expectedResult = false
    expect(
      selectors.getBuySellTxHashMatch(loadingState, 'my sfox tx hash')
    ).toEqual(expectedResult)
  })

  const failureState = {
    kvStorePath: {
      buySell: Remote.Failure('Metadata buysell selectors failure')
    }
  }

  it('getMetadata should return failure of metadata', () => {
    const expectedResult = Remote.Failure('Metadata buysell selectors failure')
    expect(selectors.getMetadata(failureState)).toEqual(expectedResult)
  })

  it('getSfoxTrades should return failure of metadata sfox trades in failure state', () => {
    const expectedResult = Remote.Failure('Metadata buysell selectors failure')
    expect(selectors.getSfoxTrades(failureState)).toEqual(expectedResult)
  })

  it('getSfoxUser should return failure of metadata sfox user in failure state', () => {
    const expectedResult = Remote.Failure('Metadata buysell selectors failure')
    expect(selectors.getSfoxUser(failureState)).toEqual(expectedResult)
  })

  it('getCoinifyTrades should return failure of metadata coinify trades in failure state', () => {
    const expectedResult = Remote.Failure('Metadata buysell selectors failure')
    expect(selectors.getCoinifyTrades(failureState)).toEqual(expectedResult)
  })

  it('getBuySellTxHashMatch should return false in failure state', () => {
    const expectedResult = false
    expect(
      selectors.getBuySellTxHashMatch(failureState, 'my sfox tx hash')
    ).toEqual(expectedResult)
  })
})
