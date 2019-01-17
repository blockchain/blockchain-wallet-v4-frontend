import MockWalletOptions from './__mocks__/wallet-options-v4'
import * as selectors from './selectors'
import Remote from '../../remote'

describe('walletOptions selectors', () => {
  const successState = {
    walletOptionsPath: Remote.Success(MockWalletOptions)
  }

  it('getBtcNetwork should return correct network', () => {
    expect(selectors.getBtcNetwork(successState)).toEqual(Remote.of('bitcoin'))
  })

  it('getEthTxFuse should return correct lastTxFuse', () => {
    expect(selectors.getEthTxFuse(successState)).toEqual(Remote.of(86400))
  })

  it('getAnnouncements should return correct announcements', () => {
    const expected = {
      public: {},
      wallet: {},
      sendBch: {},
      receiveBch: {}
    }
    expect(selectors.getAnnouncements(successState)).toEqual(
      Remote.of(expected)
    )
  })

  it('getMigrationRedirects should return correct redirects', () => {
    expect(selectors.getMigrationRedirects(successState)).toEqual(
      Remote.of(true)
    )
  })

  it('getCoinAvailability should return correct btc availability', () => {
    const expected = {
      send: true,
      request: true,
      lockbox: true,
      exchange: true
    }
    expect(selectors.getCoinAvailability(successState, 'BTC')).toEqual(
      Remote.of(expected)
    )
  })

  it('getCoinAvailability should return correct eth availability', () => {
    const expected = {
      send: true,
      request: true,
      lockbox: false,
      exchange: false
    }
    expect(selectors.getCoinAvailability(successState, 'ETH')).toEqual(
      Remote.of(expected)
    )
  })
})
