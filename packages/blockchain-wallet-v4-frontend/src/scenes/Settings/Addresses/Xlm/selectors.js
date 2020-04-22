import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = state => {
  const accountId = selectors.core.kvStore.xlm
    .getDefaultAccountId(state)
    .getOrElse('')
  const amount = selectors.core.data.xlm
    .getAccountBalance(accountId, state)
    .getOrElse(0)
  return {
    balance: Exchange.convertCoinToCoin({
      coin: 'XLM',
      value: amount,
      baseToStandard: false
    }).value,
    addr: accountId,
    priv: state.securityCenter.shownXlmPrivKey
  }
}
