import { concat, lift } from 'ramda'
import * as adapter from 'adapter'
import { selectors } from 'data'

export const getData = state => {
  const btcHDAccountsInfo = selectors.core.common.bitcoin.getAccountsInfo(state)
  const btcAddressesInfo = selectors.core.common.bitcoin.getAddressesInfo(state)
  const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
  const ethAccountsInfoR = selectors.core.common.ethereum.getAccountsInfo(state)
  const quotationLoading = adapter.selectors.components.exchange.getFirstStepLoading(state)
  const quotationError = adapter.selectors.components.exchange.getFirstStepError(state)

  const transform = (ethAccountsInfo) => {
    const elements = [
      { group: 'Bitcoin', items: btcAccountsInfo.map(x => ({ text: x.label, value: x })) },
      { group: 'Ethereum', items: ethAccountsInfo.map(x => ({ text: x.label, value: x })) }
    ]

    return {
      elements,
      quotationLoading,
      quotationError
    }
  }

  return lift(transform)(ethAccountsInfoR)
}
