import { createSelector } from '@reduxjs/toolkit'

import { SBPaymentMethodsType, SBPaymentMethodType } from 'core/types'
import { RootState } from 'data/rootReducer'

import { RecurringBuyPeriods } from './types'

export const getActive = (state: RootState) => state.components.recurringBuy.active
export const getStep = (state: RootState) => state.components.recurringBuy.step
export const getMethods = (state: RootState) => state.components.recurringBuy.methods
export const getPeriod = (state: RootState) => state.components.recurringBuy.period
export const getRegisteredList = (state: RootState) => state.components.recurringBuy.registeredList

export const isAvailableMethod = (method) =>
  createSelector(
    getMethods,
    (methodsR) => methodsR.getOrElse([]).filter((m) => m === method.type).length > 0
  )

export const getRegisteredListByCoin = (coin) =>
  createSelector(getRegisteredList, (registeredListR) => {
    return registeredListR.getOrElse([]).filter((l) => l.destinationCurrency === coin)
  })

export default getStep
