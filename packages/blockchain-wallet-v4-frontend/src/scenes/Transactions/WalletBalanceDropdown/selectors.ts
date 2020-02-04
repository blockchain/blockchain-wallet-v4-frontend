import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { OwnProps } from '.'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

export const getData = (state, ownProps: OwnProps) => {
  switch (ownProps.coin) {
    case 'BTC':
      return getBtcAddressData(state, { excludeLockbox: true })
    default:
      return Remote.Success([])
  }
}
