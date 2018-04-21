import React from 'react'
import { isEmpty, prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { MaximumAmountMessage } from './validationMessages'

export const maximumAmount = (value, allValues, props) => {
  const valueBch = prop('coin', value)
  const valueSatoshi = Exchange.convertBchToBch({ value: valueBch, fromUnit: 'BCH', toUnit: 'SAT' }).value
  return valueSatoshi <= props.effectiveBalance ? undefined : <MaximumAmountMessage />
}
