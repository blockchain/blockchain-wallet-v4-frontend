import { lift } from 'ramda'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import {
  // CoinType,
  ExtractSuccess,
  FiatType
} from 'blockchain-wallet-v4/src/types'
import * as balanceSelectors from 'components/Balances/selectors'
import { getData as getBchAddressData } from 'components/Form/SelectBoxBchAddresses/selectors'
import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { getData as getCoinAddressData } from 'components/Form/SelectBoxCoinAddresses/selectors'
import {
  getErc20Data as getErc20AddressData,
  getEthData as getEthAddressData
} from 'components/Form/SelectBoxEthAddresses/selectors'
import { getData as getXlmAddressData } from 'components/Form/SelectBoxXlmAddresses/selectors'
import { selectors } from 'data'

// import { ALL_ACCOUNTS_SELECTOR } from 'data/coins/model/all'
// import { getCoinAccounts } from 'data/coins/selectors/index'
// import { CoinAccountSelectorType } from 'data/coins/types'
import { OwnProps } from '.'

export const getData = (state, ownProps: OwnProps) => {
  const { coin } = ownProps
  let addressDataR
  let balanceDataR

  // const accounts = getCoinAccounts(state, {
  //   coins: [coin],
  //   ...ALL_ACCOUNTS_SELECTOR
  // } as CoinAccountSelectorType)[coin as CoinType]

  switch (coin) {
    case 'BTC':
      addressDataR = getBtcAddressData(state, {
        excludeLockbox: true,
        includeAll: false,
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = balanceSelectors.getBtcBalance(state)
      break
    case 'BCH':
      addressDataR = getBchAddressData(state, {
        coin: 'BCH',
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = balanceSelectors.getBchBalance(state)
      break
    case 'ETH':
      addressDataR = getEthAddressData(state, {
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = balanceSelectors.getEthBalance(state)
      break
    case 'XLM':
      addressDataR = getXlmAddressData(state, {
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = balanceSelectors.getXlmBalance(state)
      break
    case 'EUR':
    case 'GBP':
    case 'USD':
      addressDataR = Remote.Success({ data: [] })
      balanceDataR = balanceSelectors.getFiatBalance(coin, state)
      break
    default:
      switch (true) {
        case selectors.core.data.eth.getErc20Coins().includes(coin):
          addressDataR = getErc20AddressData(state, {
            coin,
            includeCustodial: true,
            includeInterest: true
          })
          balanceDataR = balanceSelectors.getErc20Balance(coin)(state)
          break
        case selectors.core.data.coins.getCustodialCoins().includes(coin):
          addressDataR = getCoinAddressData(state, {
            coin,
            includeCustodial: true
          })
          balanceDataR = balanceSelectors.getCoinCustodialBalance(coin)(state)
          break
        default:
      }
  }
  const currencyR = selectors.core.settings.getCurrency(state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)

  const transform = (
    addressData,
    balanceData,
    currency: FiatType,
    sbBalances: ExtractSuccess<typeof sbBalancesR>
  ) => {
    return {
      addressData,
      balanceData,
      currency,
      currencySymbol: Exchange.getSymbol(currency),
      sbBalance: sbBalances[coin]
    }
  }

  return lift(transform)(addressDataR, balanceDataR, currencyR, sbBalancesR)
}
