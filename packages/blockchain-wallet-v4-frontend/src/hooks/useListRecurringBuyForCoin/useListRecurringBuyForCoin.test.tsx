import { renderHook } from '@testing-library/react-hooks'

import { BSPaymentTypes } from '@core/types'
import { RecurringBuyItemState, RecurringBuyPeriods, RecurringBuyRegisteredList } from 'data/types'

import { useListRecurringBuy } from '../useListRecurringBuy'
import { createRemoteSuccessState } from '../useRemote'
import { useListRecurringBuyForCoin } from '.'

jest.mock('../useListRecurringBuy', () => ({
  useListRecurringBuy: jest.fn()
}))

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

describe('useListRecurringBuyForCoin()', () => {
  const useListRecurringBuyMock = useListRecurringBuy as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should return the recurring buys for BTC', () => {
    useListRecurringBuyMock.mockImplementation(() =>
      createRemoteSuccessState<string, RecurringBuyRegisteredList[]>([
        btcRecurringBuy,
        ethRecurringBuy
      ])
    )

    const { result } = renderHook(() => useListRecurringBuyForCoin({ coin: 'BTC' }))

    const { data } = result.current

    expect(data).toEqual([btcRecurringBuy])
  })
})
