import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { lift } from 'ramda'
import { OwnProps } from '.'
import { selectors } from 'data'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

export const getData = (state, ownProps: OwnProps) => {
  let addressDataR
  let balanceDataR = selectors.core.data[
    ownProps.coin.toLowerCase()
  ].getBalance(state)

  switch (ownProps.coin) {
    case 'BTC':
      addressDataR = getBtcAddressData(state, { excludeLockbox: true })
      break
    default:
      addressDataR = Remote.Success([])
  }

  const transform = (addressData, balanceData) => ({ addressData, balanceData })

  return lift(transform)(addressDataR, balanceDataR)
}
