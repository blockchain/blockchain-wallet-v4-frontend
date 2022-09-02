import { createSelector } from '@reduxjs/toolkit'
import { flatten, uniq } from 'ramda'

import { BSPaymentMethodType, BSPaymentTypes } from '@core/types'
import { RootState } from 'data/rootReducer'
import { buyPaymentMethodSelectedPaymentTypeDictionary } from 'middleware/analyticsMiddleware/utils'

import { RecurringBuyPeriods } from './types'

export const getActive = (state: RootState) => state.components.recurringBuy.active
export const getStep = (state: RootState) => state.components.recurringBuy.step
export const getPaymentInfo = (state: RootState) => state.components.recurringBuy.paymentInfo
export const getPeriod = (state: RootState) => state.components.recurringBuy.period
export const getRegisteredList = (state: RootState) => state.components.recurringBuy.registeredList

export const getPaymentInfoPeriod = (period: RecurringBuyPeriods) =>
  createSelector(getPaymentInfo, (paymentInfoR) => {
    return paymentInfoR.getOrElse([]).filter((pi) => pi.period === period)[0]
  })

export const isAvailableMethod = (period: RecurringBuyPeriods, method?: BSPaymentMethodType) =>
  createSelector(getPaymentInfoPeriod(period), (paymentInfoPeriod) => {
    if (!method) return false
    // All periods support ONE_TIME buys
    if (period === RecurringBuyPeriods.ONE_TIME) return true
    // Card type can be PAYMENT_CARD or USER_CARD, but backend doesn't support USER_CARD
    // for recurring buy eligible payment methods. We may want to refactor cards code to
    // remove the need for USER_CARD
    const methodType = buyPaymentMethodSelectedPaymentTypeDictionary(
      method.type
    ) as unknown as BSPaymentTypes
    return (paymentInfoPeriod && paymentInfoPeriod.eligibleMethods.includes(methodType)) || false
  })

export const availableMethods = createSelector(getPaymentInfo, (paymentInfoR) => {
  const data = paymentInfoR
    .map((paymentInfo) => {
      return paymentInfo.map((info) => info.eligibleMethods)
    })
    .getOrElse([])
  return uniq(flatten(data))
})

export const hasAvailablePeriods = (method?: BSPaymentMethodType) =>
  createSelector(getPaymentInfo, (paymentInfoR) => {
    if (!method) return false

    const paymentInfo = paymentInfoR.getOrElse([]).filter((pi) => {
      const methodType = buyPaymentMethodSelectedPaymentTypeDictionary(
        method.type
      ) as unknown as BSPaymentTypes
      return pi.eligibleMethods.includes(methodType)
    })

    return paymentInfo.length > 0
  })

export const getRegisteredListByCoin = (coin) =>
  createSelector(getRegisteredList, (registeredListR) => {
    return registeredListR.getOrElse([]).filter((l) => l.destinationCurrency === coin)
  })

export default getStep
