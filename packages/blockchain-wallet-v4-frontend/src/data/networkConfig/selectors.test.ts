import Remote from '@core/remote'
import * as selectors from 'data/networkConfig/selectors'
import { RootState } from 'data/rootReducer'

import { NetworkConfigState, NetworkType } from './types'

const makeState = (configState: NetworkConfigState['config']) =>
  ({
    networkConfig: {
      config: configState
    }
  } as RootState)

describe('networkConfig selectors', () => {
  describe('getEvmCompatibleCoins', () => {
    describe('when network config is available', () => {
      it('should return symbols for EVM compatible coins', () => {
        const state = makeState(
          Remote.of({
            networks: [
              {
                nativeAsset: 'AVAX',
                type: NetworkType.EVM
              },
              {
                nativeAsset: 'MATIC.MATIC',
                type: NetworkType.EVM
              },
              {
                nativeAsset: 'BTC',
                type: 'BTC'
              }
            ]
          })
        )

        expect(selectors.getEvmCompatibleCoins(state)).toEqual(['AVAX', 'MATIC.MATIC'])
      })
    })

    describe('when network config is not available', () => {
      it('should return empty array', () => {
        const state = makeState(Remote.Failure(null))

        expect(selectors.getEvmCompatibleCoins(state)).toEqual([])
      })
    })
  })
})
