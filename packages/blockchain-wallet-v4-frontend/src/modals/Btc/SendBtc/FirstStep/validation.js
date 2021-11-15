import React from 'react'
import { isEmpty, path, prop } from 'ramda'

import { Exchange, utils } from '@core'
import Currencies from '@core/exchange/currencies'
import { formatFiat } from '@core/exchange/utils'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { OverYourLimitMessage } from '../../../components'
import {
  AddressMatchesPriv,
  InsufficientFundsMessage,
  InvalidAmountMessage,
  MaximumAmountMessage,
  MaximumFeeMessage,
  MinimumAmountMessage,
  MinimumFeeMessage,
  MinimumOneSatoshiMessage
} from './validationMessages'

const DUST = 546

const getEffectiveBalance = (props) => {
  return Number(props.effectiveBalance)
}

export const insufficientFunds = (value, allValues, props) => {
  const effectiveBalance = getEffectiveBalance(props)
  return effectiveBalance > 0 && DUST <= effectiveBalance ? undefined : <InsufficientFundsMessage />
}

export const invalidAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertCoinToCoin({
    baseToStandard: false,
    coin: 'BTC',
    value: valueBtc
  })
  return valueSatoshi > 0 ? undefined : <InvalidAmountMessage />
}

export const minimumAmount = (value, allValues, props) => {
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertCoinToCoin({
    baseToStandard: false,
    coin: 'BTC',
    value: valueBtc
  })
  return parseInt(valueSatoshi) >= DUST ? undefined : <MinimumAmountMessage />
}

export const maximumAmount = (value, allValues, props) => {
  const effectiveBalance = getEffectiveBalance(props)
  const valueBtc = prop('coin', value)
  const valueSatoshi = Exchange.convertCoinToCoin({
    baseToStandard: false,
    coin: 'BTC',
    value: valueBtc
  })
  return valueSatoshi <= effectiveBalance ? undefined : <MaximumAmountMessage />
}

export const minimumFeePerByte = (value, allValues, props) =>
  value && parseInt(value) >= props.minFeePerByte ? undefined : <MinimumFeeMessage />

export const minimumOneSatoshi = (value, allValues, props) =>
  value >= 1 ? undefined : <MinimumOneSatoshiMessage />

export const maximumFeePerByte = (value, allValues, props) =>
  value && parseInt(value) <= props.maxFeePerByte ? undefined : <MaximumFeeMessage />

export const shouldError = ({ initialRender, nextProps, props, structure, values }) => {
  if (initialRender) {
    return true
  }
  return (
    initialRender ||
    !structure.deepEqual(values, nextProps.values) ||
    props.effectiveBalance !== nextProps.effectiveBalance
  )
}

export const shouldWarn = ({ initialRender, nextProps, props, structure, values }) => {
  if (initialRender) {
    return true
  }
  return (
    initialRender ||
    !structure.deepEqual(values, nextProps.values) ||
    props.effectiveBalance !== nextProps.effectiveBalance
  )
}

export const isAddressDerivedFromPriv = (value, allValues, props) => {
  const format = utils.btc.detectPrivateKeyFormat(value)
  const address = path(['from', 'address'], allValues)
  const key = utils.btc.privateKeyStringToKey(value, format, props.network)
  return utils.btc.keyPairToAddress(key) === address ? undefined : <AddressMatchesPriv />
}

export const isSendLimitOver = (value, allValues, props) => {
  const { from, sendLimits } = props
  const fiatValue = prop('fiat', value)
  const isFromCustodial = from && from.type === 'CUSTODIAL'

  if (!isFromCustodial || isEmpty(sendLimits) || !sendLimits?.current?.available?.currency) {
    return undefined
  }

  const { currency, value: availableAmount } = sendLimits?.current?.available

  const availableAmountInBase = convertBaseToStandard('FIAT', availableAmount)

  return fiatValue > Number(availableAmountInBase) ? (
    <OverYourLimitMessage
      amount={formatFiat(availableAmountInBase)}
      currency={Currencies[currency].units[currency].symbol}
    />
  ) : undefined
}
