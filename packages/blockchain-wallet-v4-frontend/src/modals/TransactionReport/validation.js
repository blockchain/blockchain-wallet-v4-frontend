import React from 'react'
import { prop } from 'ramda'
import { InvalidDateMessage } from './validationMessages'
import { isValidBtcStartDate, isValidBchStartDate, isValidBtcEndDate, isValidBchEndDate } from './services'

export const validStartDate = (value, allValues, props) => {
  const coin = prop('coin', props)
  const end = prop('end', allValues)
  const result = coin === 'BTC' ? isValidBtcStartDate(value, end) : isValidBchStartDate(value, end)
  return result ? undefined : <InvalidDateMessage />
}

export const validEndDate = (value, allValues, props) => {
  const coin = prop('coin', props)
  const start = prop('start', allValues)
  const result = coin === 'BTC' ? isValidBtcEndDate(value, start) : isValidBchEndDate(value, start)
  return result ? undefined : <InvalidDateMessage />
}
