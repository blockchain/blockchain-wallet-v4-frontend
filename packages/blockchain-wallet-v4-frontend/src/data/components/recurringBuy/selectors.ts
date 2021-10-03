import { createSelector } from '@reduxjs/toolkit'
import { compose, flatten, uniq } from 'ramda'

import { SBPaymentMethodType, SBPaymentTypes } from 'core/types'
import { RootState } from 'data/rootReducer'

import { getPayment } from '../interest/selectors'
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

export const isAvailableMethod = (period: RecurringBuyPeriods, method?: SBPaymentMethodType) =>
  createSelector(getPaymentInfoPeriod(period), (paymentInfoPeriod) => {
    if (!method) return false
    // All periods support ONE_TIME buys
    if (period === RecurringBuyPeriods.ONE_TIME) return true
    return (paymentInfoPeriod && paymentInfoPeriod.eligibleMethods.includes(method.type)) || false
  })

export const availableMethods = createSelector(getPaymentInfo, (paymentInfoR) => {
  const data = paymentInfoR
    .map((paymentInfo) => {
      return paymentInfo.map((info) => info.eligibleMethods)
    })
    .getOrElse([])
  return uniq(flatten(data))
})

export const hasAvailablePeriods = (method?: SBPaymentMethodType) =>
  createSelector(getPaymentInfo, (paymentInfoR) => {
    if (!method) return false

    const paymentInfo = paymentInfoR.getOrElse([]).filter((pi) => {
      return pi.eligibleMethods.includes(method.type)
    })

    return paymentInfo.length > 0
  })

export const getRegisteredListByCoin = (coin) =>
  createSelector(getRegisteredList, (registeredListR) => {
    return registeredListR.getOrElse([]).filter((l) => l.destinationCurrency === coin)
  })

export default getStep
