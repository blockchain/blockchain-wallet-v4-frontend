import React from 'react'
import { prop } from 'ramda'
import {
  InvalidAmountMessageMin,
  InvalidAmountMessageMax
} from './validationMessages'

export const invalidAmountMin = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  return valueBtc > 0 ? undefined : <InvalidAmountMessageMin />
}

export const invalidAmountMax = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  return valueBtc <= 21000000 ? undefined : <InvalidAmountMessageMax />
}
