import { createSelector } from '@reduxjs/toolkit'

import { SBPaymentMethodType } from 'core/types'
import { RootState } from 'data/rootReducer'

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

export const getRegisteredListByCoin = (coin) =>
  createSelector(getRegisteredList, (registeredListR) => {
    return registeredListR.getOrElse([]).filter((l) => l.destinationCurrency === coin)
  })

export default getStep
