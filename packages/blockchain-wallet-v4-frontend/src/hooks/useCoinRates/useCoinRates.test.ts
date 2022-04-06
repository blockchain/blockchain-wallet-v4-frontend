import { useSelector } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'

import { useCoinRates } from '.'

jest.mock('react-redux', () => {
  const dispatch = jest.fn()
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useDispatch: jest.fn(() => dispatch),
    useSelector: jest.fn(() => ({}))
  }
})

describe('useCoinRates()', () => {
  const useSelectorMock = useSelector as jest.MockedFunction<typeof useSelector>

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('When rates are not available', () => {
    beforeEach(() => {
      useSelectorMock.mockImplementation(() => ({
        data: undefined
      }))
    })

    it('Should return undefined', () => {
      const { result } = renderHook(() => useCoinRates({ coin: 'BTC' }))

      const { data } = result.current

      expect(data).toBeUndefined()
    })
  })

  describe('When rates are available for BTC', () => {
    beforeEach(() => {
      useSelectorMock.mockImplementation(() => ({
        data: {
          marketCap: 387749398216.14,
          price: 3220.59,
          timestamp: 1649262180,
          volume24h: 51688.68
        }
      }))
    })

    it('Should provide the coin rate', () => {
      const { result } = renderHook(() => useCoinRates({ coin: 'BTC' }))

      const { data } = result.current

      expect(data).toEqual({
        price: 3220.59,
        timestamp: new Date('2022-04-06T16:23:00.000Z'),
        volume24h: 51688.68
      })
    })
  })
})
