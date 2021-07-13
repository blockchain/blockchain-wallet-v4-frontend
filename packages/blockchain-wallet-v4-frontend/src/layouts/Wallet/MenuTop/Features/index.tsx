import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { includes, keys } from 'ramda'
import { bindActionCreators } from 'redux'

import { CoinTypeEnum } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { ModalNamesType } from 'data/types'

import { getData } from './selectors'
import Features from './template'

class FeaturesContainer extends React.PureComponent<Props> {
  showModal = type => {
    const {
      coin,
      erc20List,
      lockboxDeviceId,
      lockboxPath,
      modalActions,
      supportedCoins
    } = this.props
    if (type === 'REQUEST') {
      return modalActions.showModal('REQUEST_CRYPTO_MODAL', {
        coin: coin in CoinTypeEnum && coin,
        origin: 'FeaturesTopNav'
      })
    }

    // TODO: remove with send refactor 🙏
    if (includes(coin, erc20List)) {
      return modalActions.showModal(`SEND_ETH_MODAL` as ModalNamesType, {
        coin,
        origin: 'FeaturesTopNav'
      })
    } else if (includes(coin, keys(supportedCoins))) {
      return this.props.modalActions.showModal(
        `SEND_${coin}_MODAL` as ModalNamesType,
        {
          lockboxIndex: lockboxPath ? lockboxDeviceId : null,
          origin: 'FeaturesTopNav'
        }
      )
    }
    return this.props.modalActions.showModal(
      `SEND_BTC_MODAL` as ModalNamesType,
      {
        lockboxIndex: lockboxPath ? lockboxDeviceId : null,
        origin: 'FeaturesTopNav'
      }
    )
  }

  render() {
    return <Features showModal={this.showModal} {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(getData, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(FeaturesContainer)
