import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
// @ts-ignore
import { concat, curry, filter, has, map, prop, reduce, sequence } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (
  state,
  ownProps: {
    exclude?: Array<string>
    excludeLockbox?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
  }
) => {
  const {
    exclude = [],
    excludeLockbox,
    includeExchangeAddress,
    includeCustodial
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
      `XLM Trading Wallet` +
      ` (${Exchange.displayXlmToXlm({
        value: x ? x.available : 0,
        fromUnit: 'STROOP',
        toUnit: 'XLM'
      })})`
    )
  }
  // @ts-ignore
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = x => [{ label: `Exchange XLM Address`, value: x }]
  const toCustodialDropdown = x => [
    {
      label: buildCustodialDisplay(x),
      value: {
        ...x,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: 'XLM Trading Wallet'
      }
    }
  ]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    'XLM',
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

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
    includeCustodial
      ? selectors.components.simpleBuy
          .getSBBalances(state)
          .map<any, any>(prop('XLM'))
          .map(toCustodialDropdown)
          .map(toGroup('Custodial Wallet'))
      : Remote.of([])
  ]).map(([b1, b2, b3, b4]) => ({
    // @ts-ignore
    data: reduce(concat, [], [b1, b2, b3, b4])
  }))
}
