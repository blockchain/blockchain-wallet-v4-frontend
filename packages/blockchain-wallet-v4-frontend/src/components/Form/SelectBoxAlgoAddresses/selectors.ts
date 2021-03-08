import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
// @ts-ignore
import { concat, curry, reduce, sequence } from 'ramda'

import { selectors } from 'data'

export const getData = (
  state,
  ownProps: {
    exclude?: Array<string>
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
  }
) => {
  const {
    /* exclude = [], */ includeCustodial,
    includeExchangeAddress
  } = ownProps

  const buildCustodialDisplay = x => {
    return (
      `ALGO Trading Wallet` +
      ` (${Exchange.displayAlgoToAlgo({
        value: x ? x.available : 0,
        fromUnit: 'mALGO',
        toUnit: 'ALGO'
      })})`
    )
  }
  // @ts-ignore
  // const excluded = filter(x => !exclude.includes(x.label))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = x => [{ label: `Exchange ALGO Address`, value: x }]
  const toCustodialDropdown = currencyDetails => [
    {
      label: buildCustodialDisplay(currencyDetails),
      value: {
        ...currencyDetails,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: 'ALGO Trading Wallet'
      }
    }
  ]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    'ALGO',
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  return sequence(Remote.of, [
    includeExchangeAddress && hasExchangeAddress
      ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
      : Remote.of([]),
    includeCustodial
      ? selectors.components.simpleBuy
          .getSBBalances(state)
          .map(x => x.ALGO)
          .map(toCustodialDropdown)
          .map(toGroup('Custodial Wallet'))
      : Remote.of([])
  ]).map(([b1, b2]) => ({
    // @ts-ignore
    data: reduce(concat, [], [b1, b2])
  }))
}
