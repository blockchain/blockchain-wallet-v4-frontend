import React from 'react'
import BigNumber from 'bignumber.js'
import { prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { MaximumAmountMessage } from './validationMessages'

export const maximumAmount = (value, allValues, props) => {
  const valueEth = prop('coin', value)
  const valueWei = Exchange.convertEtherToEther({ value: valueEth, fromUnit: 'ETH', toUnit: 'WEI' }).value
  return new BigNumber(valueWei).lessThanOrEqualTo(new BigNumber(props.effectiveBalance || 0)) ? undefined : <MaximumAmountMessage />
}