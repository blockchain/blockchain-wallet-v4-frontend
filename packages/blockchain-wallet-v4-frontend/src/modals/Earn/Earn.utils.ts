import { Exchange, Remote } from '@core'
import { CoinType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getAddressDataR = (state: RootState, coin: CoinType) => {
  switch (coin) {
    case 'BCH':
      return selectors.core.common.bch.getAccountsBalances(state)
    case 'BTC':
      return selectors.core.common.btc.getActiveAccountsBalances(state)
    case 'ETH':
      return selectors.core.common.eth.getAccountBalances(state)
    case 'XLM':
      return selectors.core.common.xlm.getAccountBalances(state)
    default:
      switch (true) {
        case selectors.core.data.coins.getErc20Coins().includes(coin):
          return selectors.core.common.eth.getErc20AccountBalances(state, coin)
        default:
          return Remote.Success([{}])
      }
  }
}

// BTC & BCH balance is a number
// ETH balance is a bigNumber
// XLM & ERC20 balance is a string
export const getHasNonCustodialBalance = (addressData): boolean =>
  addressData.some(({ balance }) => {
    const balanceType = typeof balance
    return balanceType === 'number' || balanceType === 'string'
      ? Number(balance) > 0
      : Number(Exchange.convertCoinToCoin({ baseToStandard: true, coin: 'ETH', value: balance })) >
          0
  })
