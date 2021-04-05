// @ts-ignore
import { concat, curry, filter, has, map, reduce, sequence } from 'ramda'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { InterestAccountBalanceType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (
  state,
  ownProps: {
    exclude?: Array<string>
    excludeLockbox?: boolean
    forceCustodialFirst?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
  }
) => {
  const {
    exclude = [],
    excludeLockbox,
    includeExchangeAddress,
    includeCustodial,
    includeInterest,
    forceCustodialFirst
  } = ownProps

  const buildDisplay = wallet => {
    if (has('balance', wallet)) {
      let xlmDisplay = Exchange.displayXlmToXlm({
        value: wallet.balance,
        fromUnit: 'STROOP',
        toUnit: 'XLM'
      })
      return wallet.label + ` (${xlmDisplay})`
    }
    return wallet.label
  }
  const buildCustodialDisplay = x => {
    return (
      `Trading Account` +
      ` (${Exchange.displayXlmToXlm({
        value: x ? x.available : 0,
        fromUnit: 'STROOP',
        toUnit: 'XLM'
      })})`
    )
  }
  const buildInterestDisplay = (x: InterestAccountBalanceType['XLM']) => {
    return (
      `Interest Account` +
      ` (${Exchange.displayXlmToXlm({
        value: x ? x.balance : 0,
        fromUnit: 'STROOP',
        toUnit: 'XLM'
      })})`
    )
  }
  // @ts-ignore
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = x => [{ label: `XLM Exchange Account`, value: x }]
  const toCustodialDropdown = currencyDetails => [
    {
      label: buildCustodialDisplay(currencyDetails),
      value: {
        ...currencyDetails,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: 'Trading Account'
      }
    }
  ]
  const toInterestDropdown = x => [
    {
      label: buildInterestDisplay(x),
      value: {
        ...x,
        type: ADDRESS_TYPES.INTEREST,
        label: 'Interest Account'
      }
    }
  ]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    'XLM',
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress(
    'XLM',
    state
  )
  const hasAccountAddress = Remote.Success.is(accountAddress)
  const showCustodial = includeCustodial && !forceCustodialFirst
  const showCustodialWithAddress =
    includeCustodial && forceCustodialFirst && hasAccountAddress

  return sequence(Remote.of, [
    includeExchangeAddress && hasExchangeAddress
      ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
      : Remote.of([]),
    selectors.core.common.xlm
      .getAccountBalances(state)
      .map(excluded)
      .map(toDropdown)
      .map(toGroup('Wallet')),
    excludeLockbox
      ? Remote.of([])
      : selectors.core.common.xlm
          .getLockboxXlmBalances(state)
          .map(excluded)
          .map(toDropdown)
          .map(toGroup('Lockbox')),
    showCustodial || showCustodialWithAddress
      ? selectors.components.simpleBuy
          .getSBBalances(state)
          .map(x => ({
            ...x.XLM,
            address: accountAddress ? accountAddress.data : null
          }))
          .map(toCustodialDropdown)
          .map(toGroup('Custodial Wallet'))
      : Remote.of([]),
    includeInterest
      ? selectors.components.interest
          .getInterestAccountBalance(state)
          .map(x => x.XLM)
          .map(toInterestDropdown)
          .map(toGroup('Interest Account'))
      : Remote.of([])
  ]).map(([b1, b2, b3, b4]) => {
    const orderArray = forceCustodialFirst ? [b2, b1, b3, b4] : [b1, b2, b3, b4]
    // @ts-ignore
    const data = reduce(concat, [], orderArray)
    return { data }
  })
}
