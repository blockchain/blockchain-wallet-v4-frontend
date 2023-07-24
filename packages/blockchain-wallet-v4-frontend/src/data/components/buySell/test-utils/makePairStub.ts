import { BSPairType } from '@core/network/api/buySell/types'

export const makePairStub = (): BSPairType => ({
  buyMax: '',
  buyMin: '',
  pair: 'BTC-USD',
  sellMax: '',
  sellMin: ''
})
