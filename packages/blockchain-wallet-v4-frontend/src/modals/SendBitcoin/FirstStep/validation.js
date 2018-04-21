import React from 'react'
import { isEmpty, prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { MaximumAmountMessage, MaximumFeeMessage, MinimumAmountMessage, MinimumFeeMessage, EmptyAccount } from './validationMessages'

const DUST = 546

const DUST_BTC = '0.00000546'

export const minimumAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({ value: valueBtc, fromUnit: 'BTC', toUnit: 'SAT' }).value
  return parseInt(valueSatoshi) >= DUST ? undefined : <MinimumAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertBitcoinToBitcoin({ value: valueBtc, fromUnit: 'BTC', toUnit: 'SAT' }).value
  return valueSatoshi <= props.effectiveBalance ? undefined : <MaximumAmountMessage />
}

export const minimumFeePerByte = (value, allValues, props) => value >= props.minFeePerByte ? undefined : <MinimumFeeMessage />

export const maximumFeePerByte = (value, allValues, props) => value <= props.maxFeePerByte ? undefined : <MaximumFeeMessage />