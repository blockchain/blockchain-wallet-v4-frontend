import { useDispatch } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'

import { ListRecurringBuyQuery, useListRecurringBuyQuery } from '.'

jest.mock('react-redux', () => {
  const dispatch = jest.fn()
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useDispatch: jest.fn(() => dispatch),
    useSelector: jest.fn(() => [])
  }
})

describe('useListRecurringBuyQuery()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should fire the fetch actions on mount', () => {
    renderHook(() => useListRecurringBuyQuery())

    const dispatch = useDispatch()

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'recurringBuy/fetchRegisteredList'
    })
  })

  it('Should return the data in from the selector', () => {
    const { result } = renderHook(() => useListRecurringBuyQuery())

    const { data } = result.current

    expect(data).toEqual([])
  })

  it('Should not refetch the recurring buy on coin change', () => {
    const { rerender } = renderHook(
      (query: ListRecurringBuyQuery) => useListRecurringBuyQuery(query),
      {
        initialProps: {
          coin: {
            equal: 'BTC'
          }
        }
      }
    )

    const dispatch = useDispatch()

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'recurringBuy/fetchRegisteredList'
    })

    rerender({
      coin: {
        equal: 'ETH'
      }
    })

    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})
