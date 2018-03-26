import { concat, lift, path } from 'ramda'
import * as adapter from 'adapter'
import { selectors } from 'data'

export const getData = state => {
  const btcHDAccountsInfo = selectors.core.common.bitcoin.getAccountsInfo(state)
  const btcAddressesInfo = selectors.core.common.bitcoin.getAddressesInfo(state)
  const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
  const ethAccountsInfoR = selectors.core.common.ethereum.getAccountsInfo(state)
  const loading = adapter.selectors.components.exchange.getLoading(state)
  const error = adapter.selectors.components.exchange.getError(state)
  const effectiveBalance = 0

  const transform = (ethAccountsInfo) => {
    const elements = [
      { group: 'Bitcoin', items: btcAccountsInfo.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethAccountsInfo.map(x => ({ text: x.label, value: x })) }
    ]

    return {
      elements,
      effectiveBalance,
      loading,
      error
    }
  }

  return lift(transform)(ethAccountsInfoR)
}

// export const getData = state => {
  // const transform = () => {

  //   return {
  //     elements:
  //     sourceAccount:
  //     targetAccount:
  //     sourceAmount: {
  //       coinValue:
  //       coinUnit:
  //       fiatValue:
  //       fiatUnit:
  //     },
  //     targetAmout: {
  //       coinValue:
  //       coinUnit:
  //       fiatValue:
  //       fiatUnit:
  //     },
  //     effectiveBalance
  //   }
  // }

  // return lift(transform)()
//   return 'test'
// }
