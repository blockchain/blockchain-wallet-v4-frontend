import { useDispatch } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'

import { BSPaymentTypes } from '@core/types'
import { actions } from 'data'
import {
  RecurringBuyItemState,
  RecurringBuyOrigins,
  RecurringBuyPeriods,
  RecurringBuyRegisteredList,
  RecurringBuyStepType
} from 'data/types'

import { useOpenRecurringBuyFlayout } from '.'

jest.mock('react-redux', () => {
  const dispatch = jest.fn()
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useDispatch: jest.fn(() => dispatch)
  }
})

describe('useOpenRecurringBuyFlayout()', () => {
  it('Should dispatch actions to open recurring buy', () => {
    const recurringBuy: RecurringBuyRegisteredList = {
      destinationCurrency: 'BTC',
      id: '1',
      inputCurrency: 'USD',
      inputValue: '200',
      insertedAt: '2022-03-30T17:28:08.684Z',
      nextPayment: '2022-03-30T17:28:08.684Z',
      paymentMethod: BSPaymentTypes.BANK_ACCOUNT,
      paymentMethodId: '2',
      period: RecurringBuyPeriods.BI_WEEKLY,
      state: RecurringBuyItemState.ACTIVE,
      updatedAt: '2022-03-30T17:28:08.684Z',
      userId: '3'
    }

    const { result } = renderHook(() => useOpenRecurringBuyFlayout())

    const open = result.current

    const dispatch = useDispatch()

    open({
      origin: 'COIN_PAGE',
      recurringBuy
    })

    expect(dispatch).toHaveBeenCalledWith(actions.components.recurringBuy.setActive(recurringBuy))

    expect(dispatch).toHaveBeenCalledWith(
      actions.components.recurringBuy.showModal({
        origin: RecurringBuyOrigins.COIN_PAGE
      })
    )

    expect(dispatch).toHaveBeenCalledWith(
      actions.components.recurringBuy.setStep({
        origin: RecurringBuyOrigins.COIN_PAGE,
        step: RecurringBuyStepType.DETAILS
      })
    )
  })
})
