import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, props) => {
  const accountId = selectors.core.kvStore.xlm
    .getDefaultAccountId(state)
    .getOrElse('')
  const amount = selectors.core.data.xlm
    .getAccountBalance(accountId, state)
    .getOrElse(0)

  return {
    addressInfo: {
      addr: accountId,
      balance: Exchange.convertCoinToCoin({
        coin: 'XLM',
        value: amount,
        baseToStandard: false
      }).value,
      priv: state.securityCenter.shownXlmPrivKey
    },
    coin: 'XLM'
  }
}
