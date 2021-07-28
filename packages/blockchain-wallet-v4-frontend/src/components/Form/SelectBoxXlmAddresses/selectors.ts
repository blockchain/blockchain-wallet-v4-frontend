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

  const buildDisplay = (wallet) => {
    if (has('balance', wallet)) {
      const xlmDisplay = Exchange.displayCoinToCoin({
        coin: 'XLM',
        value: wallet.balnace
      })
      return `${wallet.label} (${xlmDisplay})`
    }
    return wallet.label
  }
  const buildCustodialDisplay = (account) => {
    return (
      `Trading Account` +
      ` (${Exchange.displayCoinToCoin({
        coin: 'XLM',
        value: account ? account.available : 0
      })})`
    )
  }
  const buildInterestDisplay = (account: InterestAccountBalanceType['XLM']) => {
    return (
      `Interest Account` +
      ` (${Exchange.displayCoinToCoin({
        coin: 'XLM',
        value: account ? account.balance : 0
      })})`
    )
  }
  // @ts-ignore
  const excluded = filter((x) => !exclude.includes(x.label))
  const toDropdown = map((x) => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = (x) => [{ label: `XLM Exchange Account`, value: x }]
  const toCustodialDropdown = (currencyDetails) => [
    {
      label: buildCustodialDisplay(currencyDetails),
      value: {
        ...currencyDetails,
        label: 'Trading Account',
        type: ADDRESS_TYPES.CUSTODIAL
      }
    }
  ]
  const toInterestDropdown = (account) =>
    account
      ? [
          {
            label: buildInterestDisplay(account),
            value: {
              ...account,
              label: 'Interest Account',
              type: ADDRESS_TYPES.INTEREST
            }
          }
        ]
      : []

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange('XLM', state)
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress('XLM', state)
  const hasAccountAddress = Remote.Success.is(accountAddress)
  const showCustodial = includeCustodial && !forceCustodialFirst
  const showCustodialWithAddress = includeCustodial && forceCustodialFirst && hasAccountAddress

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
          .map((x) => ({
            ...x.XLM,
            address: accountAddress ? accountAddress.data : null
          }))
          .map(toCustodialDropdown)
          .map(toGroup('Custodial Wallet'))
      : Remote.of([]),
    includeInterest
      ? selectors.components.interest
          .getInterestAccountBalance(state)
          .map((x) => x.XLM)
          .map(toInterestDropdown)
          .map(toGroup('Interest Account'))
      : Remote.of([])
  ]).map(([b1, b2, b3, b4, b5]) => {
    const orderArray = forceCustodialFirst ? [b2, b1, b3, b4, b5] : [b1, b2, b3, b4, b5]
    // @ts-ignore
    const data = reduce(concat, [], orderArray)
    return { data }
  })
}
