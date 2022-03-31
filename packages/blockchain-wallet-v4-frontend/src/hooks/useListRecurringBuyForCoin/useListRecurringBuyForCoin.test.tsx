import { useDispatch } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'

import { useListRecurringBuyForCoin } from '.'

jest.mock('react-redux', () => {
  const dispatch = jest.fn()
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useDispatch: jest.fn(() => dispatch),
    useSelector: jest.fn(() => [])
  }
})

describe('useListRecurringBuyForCoin()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should fire the fetch actions on mount', () => {
    renderHook(() => useListRecurringBuyForCoin({ coin: 'BTC' }))

    const dispatch = useDispatch()

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'recurringBuy/fetchRegisteredList'
    })
  })

  it('Should return the data in from the selector', () => {
    const { result } = renderHook(() => useListRecurringBuyForCoin({ coin: 'BTC' }))

    const { data } = result.current

    expect(data).toEqual([])
  })

  it('Should not refetch the recurring buy on coin change', () => {
    const { rerender } = renderHook(useListRecurringBuyForCoin, {
      initialProps: {
        coin: 'BTC'
      }
    })

    const dispatch = useDispatch()

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'recurringBuy/fetchRegisteredList'
    })

    rerender({
      coin: 'ETH'
    })

    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})
