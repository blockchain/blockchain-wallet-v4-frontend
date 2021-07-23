import { lift } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { getData as getBchAddressData } from 'components/Form/SelectBoxBchAddresses/selectors'
import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { getData as getCloutAddressData } from 'components/Form/SelectBoxCloutAddresses/selectors'
import { getData as getDogeAddressData } from 'components/Form/SelectBoxDogeAddresses/selectors'
import { getData as getDotAddressData } from 'components/Form/SelectBoxDotAddresses/selectors'
import {
  getErc20Data as getErc20AddressData,
  getEthData as getEthAddressData
} from 'components/Form/SelectBoxEthAddresses/selectors'
import { getData as getXlmAddressData } from 'components/Form/SelectBoxXlmAddresses/selectors'

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
    case 'CLOUT':
      addressDataR = getCloutAddressData(state, {
        includeCustodial
      })
      break
    case 'DOGE':
      addressDataR = getDogeAddressData(state, {
        includeCustodial
      })
      break
    case 'DOT':
      addressDataR = getDotAddressData(state, {
        includeCustodial
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
    case 'PAX':
      addressDataR = getErc20AddressData(state, {
        coin: 'PAX',
        includeCustodial,
        includeInterest: false
      })
      break
    case 'USDC':
      addressDataR = getErc20AddressData(state, {
        coin: 'USDC',
        includeCustodial,
        includeInterest: false
      })
      break
    case 'USDT':
      addressDataR = getErc20AddressData(state, {
        coin: 'USDT',
        includeCustodial,
        includeInterest: false
      })
      break
    case 'WDGLD':
      addressDataR = getErc20AddressData(state, {
        coin: 'WDGLD',
        includeCustodial,
        includeInterest: false
      })
      break
    case 'AAVE':
      addressDataR = getErc20AddressData(state, {
        coin: 'AAVE',
        includeCustodial,
        includeInterest: false
      })
      break
    case 'YFI':
      addressDataR = getErc20AddressData(state, {
        coin: 'YFI',
        includeCustodial,
        includeInterest: false
      })
      break
    default:
      addressDataR = Remote.Success({ data: [] })
  }

  const transform = (addressData) => {
    return {
      addressData
    }
  }

  return lift(transform)(addressDataR)
}

export default getData
