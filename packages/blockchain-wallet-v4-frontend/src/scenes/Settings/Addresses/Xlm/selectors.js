import { Exchange } from '@core'
import { selectors } from 'data'

export const getData = (state, props) => {
  const accountId = selectors.core.kvStore.xlm.getDefaultAccountId(state).getOrElse('')
  const amount = selectors.core.data.xlm.getAccountBalance(accountId, state).getOrElse(0)

  return {
    addressInfo: {
      addr: accountId,
      balance: Exchange.convertCoinToCoin({
        baseToStandard: false,
        coin: 'XLM',
        value: amount
      }),
      priv: state.securityCenter.shownXlmPrivKey
    },
    coin: 'XLM'
  }
}
