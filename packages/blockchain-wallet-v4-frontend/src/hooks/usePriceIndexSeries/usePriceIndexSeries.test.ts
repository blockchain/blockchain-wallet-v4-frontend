import { renderHook } from '@testing-library/react-hooks'

import { Remote } from '@core'
import { selectors } from 'data'

import { PriceIndexSeriesData, usePriceIndexSeries } from '.'

jest.mock('react-redux', () => {
  const dispatch = jest.fn()
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useDispatch: jest.fn(() => dispatch),
    useSelector: jest.fn((selector) => selector())
  }
})

jest.mock('data', () => {
  const originalModule = jest.requireActual('data')

  return {
    ...originalModule,
    selectors: {
      core: {
        data: {
          misc: {
            getPriceIndexSeries: jest.fn()
          }
        }
      }
    }
  }
})

describe('usePriceIndexSeries()', () => {
  beforeAll(() => {
    const getPriceIndexSeriesMock = selectors.core.data.misc.getPriceIndexSeries as jest.Mock

    getPriceIndexSeriesMock.mockImplementation(() => {
      return Remote.of<PriceIndexSeriesData>([
        {
          price: 1000,
          timestamp: 2000,
          volume24h: 3000
        },
        {
          price: 4000,
          timestamp: 5000,
          volume24h: 6000
        }
      ])
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should return the series data', () => {
    const { result } = renderHook(usePriceIndexSeries)

    const { data } = result.current

    expect(data).toEqual([
      {
        price: 1000,
        timestamp: 2000000,
        volume24h: 3000
      },
      {
        price: 4000,
        timestamp: 5000000,
        volume24h: 6000
      }
    ])
  })
})
