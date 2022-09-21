import { useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { change } from 'redux-form'

import { selectors } from 'data'
import { FORM_BS_CHECKOUT } from 'data/components/buySell/model'
import { RecurringBuyPeriods } from 'data/types'

import { RecurringBuySectionHook } from './useRecurringBuySection.types'

export const useRecurringBuySection: RecurringBuySectionHook = ({ initialPeriod, paymentType }) => {
  const selectedPeriodRef = useRef(initialPeriod)
  const dispatch = useDispatch()

  const availableRecurringBuyPayments = useSelector(
    selectors.components.recurringBuy.availableMethods
  )

  const isRecurringBuysInCheckoutPageEnabled =
    useSelector(selectors.core.walletOptions.getRecurringBuysInCheckoutPage).data === true

  const isPaymentEllegbleForRecurringBuy = useMemo(() => {
    if (!paymentType) return false

    return availableRecurringBuyPayments.includes(paymentType)
  }, [paymentType, availableRecurringBuyPayments])

  const showRecurringBuySection = useMemo(
    () =>
      selectedPeriodRef.current === RecurringBuyPeriods.ONE_TIME &&
      isRecurringBuysInCheckoutPageEnabled &&
      isPaymentEllegbleForRecurringBuy,
    [selectedPeriodRef, isRecurringBuysInCheckoutPageEnabled, isPaymentEllegbleForRecurringBuy]
  )

  const setPeriod = useCallback(
    (period: RecurringBuyPeriods) => {
      dispatch(change(FORM_BS_CHECKOUT, 'period', period))
    },
    [dispatch]
  )

  return {
    setPeriod,
    showRecurringBuySection
  }
}
