import { useDispatch } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'

import { Remote } from '@core'
import { BSPaymentTypes } from '@core/types'
import { selectors } from 'data'
import { RecurringBuyItemState, RecurringBuyPeriods, RecurringBuyRegisteredList } from 'data/types'

import { useListRecurringBuy } from '.'

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
      components: {
        recurringBuy: {
          fetchRegisteredList: jest.fn(),
          getRegisteredList: jest.fn()
        }
      }
    }
  }
})

const btcRecurringBuy: RecurringBuyRegisteredList = {
  destinationCurrency: 'BTC',
  id: '1',
  inputCurrency: 'AUD',
  inputValue: '100',
  insertedAt: '',
  nextPayment: '',
  paymentMethod: BSPaymentTypes.BANK_ACCOUNT,
  paymentMethodId: '',
  period: RecurringBuyPeriods.WEEKLY,
  state: RecurringBuyItemState.ACTIVE,
  updatedAt: '',
  userId: ''
}

const ethRecurringBuy: RecurringBuyRegisteredList = {
  destinationCurrency: 'ETH',
  id: '1',
  inputCurrency: 'AUD',
  inputValue: '100',
  insertedAt: '',
  nextPayment: '',
  paymentMethod: BSPaymentTypes.BANK_ACCOUNT,
  paymentMethodId: '',
  period: RecurringBuyPeriods.WEEKLY,
  state: RecurringBuyItemState.ACTIVE,
  updatedAt: '',
  userId: ''
}

describe('useListRecurringBuy()', () => {
  beforeAll(() => {
    const getRegisteredListMock = selectors.components.recurringBuy.getRegisteredList as jest.Mock

    getRegisteredListMock.mockImplementation(() => Remote.of([btcRecurringBuy, ethRecurringBuy]))
  })

  beforeEach(() => jest.clearAllMocks())

  it('Should fire the fetch actions on mount', () => {
    renderHook(useListRecurringBuy)

    const dispatch = useDispatch()

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'recurringBuy/fetchRegisteredList'
    })
  })

  it('Should return the data in from the selector', () => {
    const { result } = renderHook(useListRecurringBuy)

    const { data } = result.current

    expect(data).toEqual([btcRecurringBuy, ethRecurringBuy])
  })

  it('Should not refetch the recurring buy on coin change', () => {
    const { rerender } = renderHook(useListRecurringBuy)

    const dispatch = useDispatch()

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'recurringBuy/fetchRegisteredList'
    })

    rerender()

    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})
