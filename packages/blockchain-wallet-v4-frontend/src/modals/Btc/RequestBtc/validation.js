import {
  InvalidAmountMessageMax,
  InvalidAmountMessageMin
} from './validationMessages'
import { prop } from 'ramda'
import React from 'react'

export const invalidAmountMin = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  return valueBtc > 0 ? undefined : <InvalidAmountMessageMin />
}

export const invalidAmountMax = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  return valueBtc <= 21000000 ? undefined : <InvalidAmountMessageMax />
}
