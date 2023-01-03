import { lift } from 'ramda'

import { Exchange, Remote } from '@core'
import { ExtractSuccess, FiatType } from '@core/types'
import { getData as getBchAddressData } from 'components/Form/SelectBoxBchAddresses/selectors'
import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { getData as getCoinAddressData } from 'components/Form/SelectBoxCoinAddresses/selectors'
import {
  getErc20Data as getErc20AddressData,
  getEthData as getEthAddressData
} from 'components/Form/SelectBoxEthAddresses/selectors'
import { getData as getXlmAddressData } from 'components/Form/SelectBoxXlmAddresses/selectors'
import { selectors } from 'data'

import { OwnProps } from '.'

export const getData = (state, ownProps: OwnProps) => {
  const { coin } = ownProps
  let addressDataR
  let balanceDataR

  const isActiveRewardsEnabled = selectors.core.walletOptions
    .getActiveRewardsEnabled(state)
    .getOrElse(false) as boolean
  const isStakingEnabled = selectors.core.walletOptions
    .getIsStakingEnabled(state)
    .getOrElse(false) as boolean

  switch (coin) {
    case 'BTC':
      addressDataR = getBtcAddressData(state, {
        includeActiveRewards: isActiveRewardsEnabled,
        includeAll: false,
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = selectors.balances.getCoinTotalBalance(coin)(state)
      break
    case 'BCH':
      addressDataR = getBchAddressData(state, {
        coin: 'BCH',
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = selectors.balances.getCoinTotalBalance(coin)(state)
      break
    case 'ETH':
      addressDataR = getEthAddressData(state, {
        includeCustodial: true,
        includeInterest: true,
        includeStaking: isStakingEnabled
      })
      balanceDataR = selectors.balances.getCoinTotalBalance(coin)(state)
      break
    case 'XLM':
      addressDataR = getXlmAddressData(state, {
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = selectors.balances.getCoinTotalBalance(coin)(state)
      break
    case 'EUR':
    case 'GBP':
    case 'USD':
    case 'ARS':
      addressDataR = Remote.Success({ data: [] })
      balanceDataR = selectors.balances.getFiatCurrencyBalance(coin)(state)
      break
    default:
      switch (true) {
        case selectors.core.data.coins.getErc20Coins().includes(coin):
          addressDataR = getErc20AddressData(state, {
            coin,
            includeCustodial: true,
            includeInterest: true
          })
          balanceDataR = selectors.balances.getCoinTotalBalance(coin)(state)
          break
        case selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(coin):
          addressDataR = getCoinAddressData(state, {
            coin,
            includeCustodial: true,
            includeSelfCustody: true
          })
          balanceDataR = selectors.balances.getCoinTotalBalance(coin)(state)
          break
        case selectors.core.data.coins.getCustodialCoins().includes(coin):
          addressDataR = getCoinAddressData(state, {
            coin,
            includeCustodial: true,
            includeInterest: true
          })
          balanceDataR = selectors.balances.getCoinCustodialBalance(coin)(state)
          break
        default:
      }
  }
  const currencyR = selectors.core.settings.getCurrency(state)
  const sbBalancesR = selectors.components.buySell.getBSBalances(state)

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
