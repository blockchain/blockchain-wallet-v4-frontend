import { lift } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
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

const getData = (state, ownProps: OwnProps) => {
  const { coin, includeCustodial } = ownProps
  let addressDataR

  // TODO: erc20 phase 2, remove hardcoded list
  switch (coin) {
    case 'BCH':
      addressDataR = getBchAddressData(state, {
        excludeImported: true,
        excludeLockbox: true,
        includeAll: false,
        includeCustodial,
        includeInterest: false
      })
      break
    case 'BTC':
      addressDataR = getBtcAddressData(state, {
        excludeImported: true,
        excludeLockbox: true,
        includeAll: false,
        includeCustodial,
        includeInterest: false
      })
      break
    case 'ETH':
      addressDataR = getEthAddressData(state, {
        excludeLockbox: true,
        includeCustodial,
        includeInterest: false
      })
      break
    case 'XLM':
      addressDataR = getXlmAddressData(state, {
        excludeLockbox: true,
        includeCustodial,
        includeInterest: false
      })
      break
    default:
      switch (true) {
        case selectors.core.data.eth.getErc20Coins().includes(coin):
          addressDataR = getErc20AddressData(state, {
            coin,
            includeCustodial,
            includeInterest: false
          })
          break
        case selectors.core.data.coins.getCoins().includes(coin):
          addressDataR = getCoinAddressData(state, {
            coin,
            includeCustodial
          })
          break
        default:
          addressDataR = Remote.Success({ data: [] })
      }
  }

  const transform = (addressData) => {
    return {
      addressData
    }
  }

  return lift(transform)(addressDataR)
}

export default getData
