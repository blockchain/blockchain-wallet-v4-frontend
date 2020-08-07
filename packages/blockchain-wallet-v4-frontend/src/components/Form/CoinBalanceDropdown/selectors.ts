// import { OwnProps } from '.'
// import { selectors } from 'data'
// import Remote from 'blockchain-wallet-v4/src/remote/remote'

// export const getData = (state, ownProps?: OwnProps) => {
//   if (!ownProps) return Remote.Success([])

//   switch (ownProps.coin) {
//     case 'BTC':
//       return selectors.core.common.btc.getActiveAccountsBalances(state)

//     case 'ETH':
//       return selectors.core.common.eth.getAccountBalances(state)
//     case 'PAX':
//       return selectors.core.common.eth.getErc20AccountBalances(state, 'PAX')
//     case 'USDT':
//       return selectors.core.common.eth.getErc20AccountBalances(state, 'USDT')
//     default:
//       return Remote.Success([])
//   }
// }

import { Remote } from 'blockchain-wallet-v4/src'

import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import {
  getErc20Data as getErc20AddressData,
  getEthData as getEthAddressData
} from 'components/Form/SelectBoxEthAddresses/selectors'

import { lift } from 'ramda'
import { OwnProps } from '.'

export const getData = (state, ownProps: OwnProps) => {
  const { coin } = ownProps
  let addressDataR

  switch (coin) {
    case 'BTC':
      addressDataR = getBtcAddressData(state, {
        excludeLockbox: true,
        excludeImported: true,
        includeCustodial: true,
        includeInterest: false,
        includeAll: false
      })
      break
    case 'ETH':
      addressDataR = getEthAddressData(state, {
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: false
      })
      break
    case 'PAX':
      addressDataR = getErc20AddressData(state, {
        coin: 'PAX',
        includeCustodial: true,
        includeInterest: false
      })
      break
    case 'USDT':
      addressDataR = getErc20AddressData(state, {
        coin: 'USDT',
        includeCustodial: true,
        includeInterest: false
      })
      break

    default:
      addressDataR = Remote.Success({ data: [] })
  }

  const transform = addressData => {
    return {
      addressData
    }
  }

  // @ts-ignore
  return lift(transform)(addressDataR)
}
