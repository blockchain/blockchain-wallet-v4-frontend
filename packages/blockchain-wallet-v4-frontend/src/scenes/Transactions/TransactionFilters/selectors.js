import { getData as getDataBtcBch } from 'components/Form/SelectBoxBtcAddresses/selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  switch (ownProps.coin) {
    case 'BTC':
    case 'BCH':
      return {
        data: getDataBtcBch(state, ownProps.coin)
      }
    case 'ETH':
      return {
        data: Remote.of({
          legacyEthAddr: selectors.core.kvStore.eth
            .getLegacyAccountAddress(state)
            .getOrElse(null)
        })
      }
    default:
      return { data: Remote.of({}) }
  }
}
