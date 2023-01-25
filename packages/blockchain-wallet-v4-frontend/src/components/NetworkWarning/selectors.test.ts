import Remote from '@core/remote'
import { RootState } from 'data/rootReducer'

import { getCoinNetworkWarning } from './selectors'

const makeState = () =>
  ({
    networkConfig: {
      config: Remote.of({
        networks: [
          {
            nativeAsset: 'AVAX',
            type: 'EVM'
          }
        ]
      })
    }
  } as RootState)

describe('NetworkWarning selectors', () => {
  describe('getCoinNetworkWarning', () => {
    describe('when provided coin is not a native asset', () => {
      it('should return network warning with network equal to parent chain name', () => {
        expect(getCoinNetworkWarning(makeState(), 'AAVE')).toEqual({
          network: 'Ethereum',
          symbol: 'AAVE'
        })
      })
    })

    describe('when provided coin is native asset on EMV compatible network', () => {
      it('should return network warning with network equal to coin name', () => {
        expect(getCoinNetworkWarning(makeState(), 'AVAX')).toEqual({
          network: 'Avalanche C-Chain',
          symbol: 'AVAX'
        })
      })
    })

    describe('when provided coin is native asset on non EMV compatible network', () => {
      it('should return null', () => {
        expect(getCoinNetworkWarning(makeState(), 'BTC')).toBeNull()
      })
    })
  })
})
