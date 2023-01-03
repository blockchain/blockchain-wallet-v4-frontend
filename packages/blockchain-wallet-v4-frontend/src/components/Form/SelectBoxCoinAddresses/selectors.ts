// @ts-ignore
import { concat, curry, reduce, sequence } from 'ramda'

import { Exchange, Remote } from '@core'
import { getBalance } from '@core/redux/data/coins/selectors'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { EarnAccountBalanceResponseType } from '@core/types'
import { selectors } from 'data'

export const getData = (
  state,
  ownProps: {
    coin: string
    exclude?: Array<string>
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
    includeSelfCustody?: boolean
  }
) => {
  const {
    /* exclude = [], */ coin,
    includeCustodial,
    includeExchangeAddress,
    includeInterest,
    includeSelfCustody
  } = ownProps

  const buildCustodialDisplay = (x) => {
    return (
      `Trading Account` +
      ` (${Exchange.displayCoinToCoin({
        coin,
        value: x ? x.available : 0
      })})`
    )
  }

  const buildSelfCustodyDisplay = (x) => {
    return (
      `Private Key` +
      ` (${Exchange.displayCoinToCoin({
        coin,
        value: x || 0
      })})`
    )
  }

  const buildInterestDisplay = (account: EarnAccountBalanceResponseType[string]) => {
    return (
      `Rewards Account` +
      ` (${Exchange.displayCoinToCoin({
        coin,
        value: account ? account.balance : 0
      })})`
    )
  }
  // @ts-ignore
  // const excluded = filter(x => !exclude.includes(x.label))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = (x) => [{ label: `Exchange Account`, value: x }]
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
  const toSelfCustodyDropdown = (balance) => [
    {
      label: buildSelfCustodyDisplay(balance),
      value: { balance, label: 'Private Key', type: ADDRESS_TYPES.ACCOUNT }
    }
  ]
  const toInterestDropdown = (account) =>
    account
      ? [
          {
            label: buildInterestDisplay(account),
            value: {
              ...account,
              label: 'Rewards Account',
              type: ADDRESS_TYPES.INTEREST
            }
          }
        ]
      : []

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(coin, state)
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  return sequence(Remote.of, [
    includeExchangeAddress && hasExchangeAddress
      ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
      : Remote.of([]),
    includeCustodial
      ? selectors.components.buySell
          .getBSBalances(state)
          .map((x) => x[coin])
          .map(toCustodialDropdown)
          .map(toGroup('Custodial Wallet'))
      : Remote.of([]),
    includeSelfCustody
      ? getBalance(coin, state).map(toSelfCustodyDropdown).map(toGroup('Private Key'))
      : Remote.of([]),
    includeInterest
      ? selectors.components.interest
          .getPassiveRewardsAccountBalance(state)
          .map((x) => x[coin])
          .map(toInterestDropdown)
          .map(toGroup('Rewards Account'))
      : Remote.of([])
  ]).map(([b1, b2, b3, b4]) => ({
    // @ts-ignore
    data: reduce(concat, [], [b1, b2, b3, b4])
  }))
}
