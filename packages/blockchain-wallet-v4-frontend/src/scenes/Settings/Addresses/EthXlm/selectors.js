import { Exchange } from 'blockchain-wallet-v4/src'
import { getEthBalance } from 'components/Balances/wallet/selectors'
import { selectors } from 'data'

export const getData = (state, props) => {
  const accountId = selectors.core.kvStore.xlm
    .getDefaultAccountId(state)
    .getOrElse('')
  const amount = selectors.core.data.xlm
    .getAccountBalance(accountId, state)
    .getOrElse(0)

  const ethKvStoreSelectors = selectors.core.kvStore.eth
  const legacyEthAddr = ethKvStoreSelectors
    .getLegacyAccountAddress(state)
    .getOrElse('')

  const legacyAddressInfo = {
    addr: legacyEthAddr,
    balance: selectors.core.data.eth.getLegacyBalance(state).getOrElse(0),
    priv: state.securityCenter.shownEthLegacyPrivKey
  }

  const addressInfo = {
    addr: ethKvStoreSelectors.getContext(state).getOrElse(''),
    balance: getEthBalance(state).getOrElse(0),
    priv: state.securityCenter.shownEthPrivKey
  }

  const path = selectors.router.getPathname(state)

  const coin = path.includes('eth') ? 'eth' : 'xlm'

  return {
    eth: {
      addressInfo,
      legacyAddressInfo: legacyEthAddr ? legacyAddressInfo : null
    },
    coin,
    isLegacy: !!legacyEthAddr,
    xlm: {
      addressInfo: {
        addr: accountId,
        balance: Exchange.convertCoinToCoin({
          coin: 'XLM',
          value: amount,
          baseToStandard: false
        }).value,
        priv: state.securityCenter.shownXlmPrivKey
      }
    }
  }
}
