import React from 'react'
import BigNumber from 'bignumber.js'
import { prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { MaximumAmountMessage, InsufficientFundsMessage, InvalidAmountMessage } from './validationMessages'

export const insufficientFunds = (value, allValues, props) => {
  return props.effectiveBalance > 0 ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value, allValues, props) => {
  const valueEth = prop('coin', value)
  const valueWei = Exchange.convertEtherToEther({ value: valueEth, fromUnit: 'ETH', toUnit: 'WEI' }).value
  return valueWei > 0 ? undefined : <InvalidAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const valueEth = prop('coin', value)
  const valueWei = Exchange.convertEtherToEther({ value: valueEth, fromUnit: 'ETH', toUnit: 'WEI' }).value
  return new BigNumber(valueWei).lessThanOrEqualTo(new BigNumber(props.effectiveBalance || 0)) ? undefined : <MaximumAmountMessage />
}
