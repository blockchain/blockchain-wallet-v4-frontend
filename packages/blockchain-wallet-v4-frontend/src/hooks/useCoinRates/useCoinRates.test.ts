import { renderHook } from '@testing-library/react-hooks'

import { Remote } from '@core'
import { selectors } from 'data'

import { useCoinRates } from '.'

jest.mock('data', () => ({
  selectors: {
    core: {
      data: {
        misc: {
          getRatesSelector: jest.fn()
        }
      }
    }
  }
}))

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useSelector: jest.fn((selector) => selector())
  }
})

describe('useCoinRates()', () => {
  const getRatesSelectorMock = selectors.core.data.misc.getRatesSelector as jest.MockedFunction<
    typeof selectors.core.data.misc.getRatesSelector
  >

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('When rates are not available', () => {
    beforeEach(() => {
      getRatesSelectorMock.mockImplementation(() => Remote.Success(undefined))
    })

    it('Should return undefined', () => {
      const { result } = renderHook(() => useCoinRates({ coin: 'BTC' }))

      const { data } = result.current

      expect(data).toBeUndefined()
    })
  })

  describe('When rates are available for BTC', () => {
    beforeEach(() => {
      getRatesSelectorMock.mockImplementation(() =>
        Remote.Success({
          marketCap: 387749398216.14,
          price: 3220.59,
          timestamp: 1649262180,
          volume24h: 51688.68
        })
      )
    })

    it('Should provide the coin rate', () => {
      const { result } = renderHook(() => useCoinRates({ coin: 'BTC' }))

      const { data } = result.current

      expect(data).toEqual({
        marketCap: 387749398216.14,
        price: 3220.59,
        timestamp: 1649262180000,
        volume24h: 51688.68
      })
    })
  })
})
