import * as balanceSelectors from 'components/Balances/wallet/selectors'
import { getData as getBchAddressData } from 'components/Form/SelectBoxBchAddresses/selectors'
import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import {
  getErc20Data as getErc20AddressData,
  getEthData as getEthAddressData
} from 'components/Form/SelectBoxEthAddresses/selectors'
import { getData as getXlmAddressData } from 'components/Form/SelectBoxXlmAddresses/selectors'
import { lift } from 'ramda'
import { OwnProps } from '.'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

export const getData = (state, ownProps: OwnProps) => {
  let addressDataR
  let balanceDataR

  switch (ownProps.coin) {
    case 'BTC':
      addressDataR = getBtcAddressData(state, { excludeLockbox: true })
      balanceDataR = balanceSelectors.getBtcBalance(state)
      break
    case 'BCH':
      addressDataR = getBchAddressData(state, { excludeLockbox: true })
      balanceDataR = balanceSelectors.getBchBalance(state)
      break
    case 'ETH':
      addressDataR = getEthAddressData(state, { excludeLockbox: true })
      balanceDataR = balanceSelectors.getEthBalance(state)
      break
    case 'PAX':
      addressDataR = getErc20AddressData(state, { coin: ownProps.coin })
      balanceDataR = balanceSelectors.getPaxBalance(state)
      break
    case 'XLM':
      addressDataR = getXlmAddressData(state, { excludeLockbox: true })
      balanceDataR = balanceSelectors.getXlmBalance(state)
      break
    default:
      addressDataR = Remote.Success({ data: [] })
  }

  const transform = (addressData, balanceData) => ({ addressData, balanceData })

  return lift(transform)(addressDataR, balanceDataR)
}
