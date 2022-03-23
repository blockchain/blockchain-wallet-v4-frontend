import { flatten, lift, map } from 'ramda'

import { Remote } from '@core'
import { CoinType, ExtractSuccess } from '@core/types'
import { getData as getBchAddressData } from 'components/Form/SelectBoxBchAddresses/selectors'
import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { getData as getCoinAddressData } from 'components/Form/SelectBoxCoinAddresses/selectors'
import {
  getErc20Data as getErc20AddressData,
  getEthData as getEthAddressData
} from 'components/Form/SelectBoxEthAddresses/selectors'
import { getData as getXlmAddressData } from 'components/Form/SelectBoxXlmAddresses/selectors'
import { selectors } from 'data'

export const getData = (state, coin: CoinType) => {
  let coinSelector
  let coinWalletParams

  // TODO: These coin specific selectors should be moved to one master selector
  switch (coin) {
    case 'BTC':
      coinSelector = getBtcAddressData
      coinWalletParams = {
        excludeLockbox: true,
        includeAll: false,
        includeCustodial: true,
        includeInterest: true
      }
      break
    case 'BCH':
      coinSelector = getBchAddressData
      coinWalletParams = {
        coin: 'BCH',
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: true
      }
      break
    case 'ETH':
      coinSelector = getEthAddressData
      coinWalletParams = {
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: true
      }
      break
    case 'XLM':
      coinSelector = getXlmAddressData
      coinWalletParams = {
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: true
      }
      break
    case 'EUR':
    case 'GBP':
    case 'USD':
      coinSelector = Remote.Success({ data: [] })
      break
    default:
      switch (true) {
        case selectors.core.data.coins.getErc20Coins().includes(coin):
          coinSelector = getErc20AddressData
          coinWalletParams = {
            coin,
            includeCustodial: true,
            includeInterest: true
          }
          break
        case selectors.core.data.coins.getCustodialCoins().includes(coin):
          coinSelector = getCoinAddressData
          coinWalletParams = {
            coin,
            includeCustodial: true,
            includeInterest: true
          }
          break
        default:
      }
  }

  const addressDataR = coinSelector(state, coinWalletParams)
  const currency = selectors.core.settings.getCurrency(state).getOrElse('USD')
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)

  const transform = (addressData, rates: ExtractSuccess<typeof ratesR>) => {
    const addresses =
      (Array.isArray(addressData.data) && addressData.data.map((address) => address.options)) || []

    return {
      addressData: flatten(addresses),
      currency,
      rates
    }
  }

  return lift(transform)(addressDataR, ratesR)
}
